import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { navigation } from 'app/navigation/navigation';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AppState, BuildMenuTree, Events, UtilCommon } from './main/shared';
@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
    fuseConfig: any;
    navigation: any;
    countMenu = 1;
    dataMenuTreeFinal: any = [];
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DOCUMENT} document
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FuseSplashScreenService} _fuseSplashScreenService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {Platform} _platform
     * @param {TranslateService} _translateService
     */
    constructor(
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private _platform: Platform,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _events: Events, private _utils: UtilCommon,
        private _router: Router,
        private _changeDetectorRef: ChangeDetectorRef,
        private _appState: AppState,
        private _menuTree: BuildMenuTree,
    ) {
        // Get default navigation
        this.navigation = navigation;
        const me = this;
        // Register the navigation to the service

        this._fuseNavigationService.register('main', this.navigation);

        // // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('main');

        this._events.subscribe('load:menuTree', (dataMenuTree: any) => {
            // const intervalMenu = setInterval(()=>{
            //   if (document.getElementById('fuseSidebar')) {
            //     clearInterval(intervalMenu);
            //     this.loadMenuTree(dataMenuTree);
            //   }
            // }, 300);
            setTimeout(() => {
                if (document.getElementById('fuseSidebar')) {
                    this.loadMenuTree(dataMenuTree);
                }
            }, 300);
        });
        // Add languages
        const language: string = localStorage.getItem('language') || 'vi';
        this._translateService.addLangs(['en', 'vi']);

        // Set the default language
        this._translateService.setDefaultLang(language);

        // Set the navigation translations
        if (localStorage.getItem('menuFinal') || localStorage.getItem('menuFinal') !== 'null') {
            try {
                const menuFinal = JSON.parse(localStorage.getItem('menuFinal'));
                if (menuFinal) {
                    if (menuFinal.data && menuFinal.lang) {
                        this._fuseTranslationLoaderService.loadTranslations(menuFinal);
                    }
                }
            } catch (error) {
                console.log('error load menu', error);
            }
        }
        // this._fuseTranslationLoaderService.loadTranslations(navigationEn, navigationVi);

        // Use a language
        this._translateService.use(language);

        // Add is-mobile class to the body if the platform is mobile
        if (this._platform.ANDROID || this._platform.IOS) {
            this.document.body.classList.add('is-mobile');
        }

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        const consoleError = console.error;
        console.error = function () {
            const msgs = [];
            while (arguments.length) {
                const err = arguments[0];
                if (err) {
                    if (me._utils.checkIsString(err)) {
                        if (err.indexOf('*******************************************') > -1 ||
                            err.indexOf('ag-Grid Enterprise') > -1 ||
                            err.indexOf('AG Grid Enterprise License') > -1 ||
                            err.indexOf('Invalid License') > -1 ||
                            err.indexOf('License Key Not Found') > -1 ||
                            err.indexOf('All AG Grid Enterprise features are unlocked') > -1 ||
                            err.indexOf('it is not licensed for development projects intended') > -1 ||
                            err.indexOf('info@ag-grid.com') > -1
                        ) {
                            break;
                        }
                    }
                }
                msgs.push([].shift.call(arguments));
            }
            consoleError.apply(console, msgs);
        };

    }

    async loadMenuTree(dataMenuTree): Promise<any> {
        if (dataMenuTree === true) {
            dataMenuTree = Object.assign([], this.dataMenuTreeFinal);
            dataMenuTree = await this._menuTree.convertLanguageMenu(dataMenuTree);
        }
        if (this._utils.checkISArray(dataMenuTree)) {
            this._fuseNavigationService.unregister('main');
            this.navigation = dataMenuTree;
            const countMenu = this.countMenu;
            const menuName = 'second' + countMenu;
            this._fuseNavigationService.register(menuName, this.navigation);

            this._fuseNavigationService.setCurrentNavigation(menuName);

            setTimeout(() => {
                this.countMenu++;
                document.getElementById('fuseSidebar').click();
            }, 300);

            this.dataMenuTreeFinal = Object.assign([], dataMenuTree);

            this._changeDetectorRef.detectChanges();
        } else {
            this._fuseNavigationService.unregister('main');
            this.navigation = dataMenuTree;
            const countMenu = this.countMenu;
            const menuName = 'second' + countMenu;
            this._fuseNavigationService.register(menuName, this.navigation);

            this._fuseNavigationService.setCurrentNavigation(menuName);

            setTimeout(() => {
                this.countMenu++;
                document.getElementById('fuseSidebar').click();
            }, 300);

            this.dataMenuTreeFinal = Object.assign([], dataMenuTree);

            this._changeDetectorRef.detectChanges();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    ngOnInit(): void {
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.fuseConfig = config;
                // this.fuseConfig.layout.navbar = 'mat-white-500-bg';
                if (this.fuseConfig.layout.width === 'boxed') {
                    this.document.body.classList.add('boxed');
                }
                else {
                    this.document.body.classList.remove('boxed');
                }
            });
    }

    ngAfterViewInit(): void {
        this._router.events.pipe(filter((event: any) => event instanceof NavigationEnd))
            .subscribe((evt: any) => {
                if (evt instanceof NavigationEnd) {
                    const pageTitle: string = this.handleTitlePageToGoogleAnalytics(evt.url);
                    window.document.title = pageTitle;
                    // if (window.location.href.indexOf('localhost') === -1) {
                    //   (<any>window).ga('set', 'page', evt.urlAfterRedirects);
                    //   (<any>window).ga('set', 'title', pageTitle);
                    //   (<any>window).ga('send', 'pageview');
                    // }
                    const hash: string = location.hash;
                    if (location.hash.indexOf('login') > -1) {

                    } else {
                        this._appState.setUrlCurrent(hash);
                    }

                    // this.appState.setUrlCurrent('/bu');
                    if (hash === '#/') {
                        this._router.navigate(['home']);
                        return;
                    }
                    const arrHashHidden: string[] = ['login'];
                    let isHidden = false;
                    for (const hide of arrHashHidden) {
                        if (hash.indexOf(hide) > -1) {
                            isHidden = true;
                            break;
                        }
                    }
                    this._events.publish('hiddenToolBar', isHidden);
                }
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    handleTitlePageToGoogleAnalytics(url: string): string {
        let title = 'CTT56';
        switch (url) {
            case '/contact':
                title = 'Danh sách khách hàng'; break;
            case '/contact/create':
                title = 'Thêm khách hàng'; break;
            case '/account':
                title = 'Danh sách công ty'; break;
            case '/account/create':
                title = 'Thêm công ty'; break;
            default: break;
        }
        return title;
    }
}
