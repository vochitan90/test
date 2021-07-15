import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseConfigService } from '@fuse/services/config.service';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Events, UtilCommon } from '../../../../../main/shared';
import { AppState } from '../../../../../main/shared/utils/AppState';
@Component({
    selector: 'navbar-vertical-style-1',
    templateUrl: './style-1.component.html',
    styleUrls: ['./style-1.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarVerticalStyle1Component implements OnInit, OnDestroy {
    fuseConfig: any;
    fusePerfectScrollbarUpdateTimeout: any;
    navigation: any;
    userInfo: any;
    unitInfo: any;
    icon: string;
    title: string;
    isCA: boolean;
    // Private
    private _fusePerfectScrollbar: FusePerfectScrollbarDirective;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {Router} _router
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _router: Router,
        public _appState: AppState,
        private _events: Events,
        private _utils: UtilCommon
    ) {
        // if (window.location.href.indexOf('callcenter') > -1) {
        //     this.title = 'TMS';
        //     this.icon = 'assets/assets/qtsc/fav.ico';
        // } else if (window.location.href.indexOf('vin-ca') > -1) {
        //     this.title = 'VIN-CA';
        //     this.icon = 'assets/assets/ca/fav.ico';
        //     this.isCA = true;
        // } else {
        //     this.title = 'TMS';
        //     this.icon = 'assets/images/icons/favicon.ico';
        // }
        this.title = 'CTT56';
        this.icon = 'assets/images/logos/logo.svg';
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        if (this._appState) {
            if (this._appState.appState) {
                this.userInfo = this._appState.appState;
            }
            if (this._appState.unitInfo) {
                this.unitInfo = this._appState.unitInfo;
            }
        }
        this._events.subscribe('action:loadUserInfo', ((data: any) => {
            if (data) {
                this.userInfo = data;
            }
        }));
        this._events.subscribe('action:loadCAUnitInfo', ((data: any) => {
            if (data) {
                this.unitInfo = data;
            }
        }));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // Directive
    @ViewChild(FusePerfectScrollbarDirective)
    set directive(theDirective: FusePerfectScrollbarDirective) {
        if (!theDirective) {
            return;
        }

        this._fusePerfectScrollbar = theDirective;

        // Update the scrollbar on collapsable item toggle
        this._fuseNavigationService.onItemCollapseToggled
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.fusePerfectScrollbarUpdateTimeout = setTimeout(() => {
                    this._fusePerfectScrollbar.update();
                }, 310);
            });

        // Scroll to the active item position
        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                take(1)
            )
            .subscribe(() => {
                setTimeout(() => {
                    const activeNavItem: any = document.querySelector('navbar .nav-link.active');

                    if (activeNavItem) {
                        if (activeNavItem.offsetParent) {
                            const activeItemOffsetTop = activeNavItem.offsetTop,
                                activeItemOffsetParentTop = activeNavItem.offsetParent.offsetTop,
                                scrollDistance = activeItemOffsetTop - activeItemOffsetParentTop - (48 * 3) - 168;

                            this._fusePerfectScrollbar.scrollToTop(scrollDistance);
                        }
                    }
                });
            }
            );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                if (this._fuseSidebarService.getSidebar('navbar')) {
                    this._fuseSidebarService.getSidebar('navbar').close();
                }
            }
            );

        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.fuseConfig = config;
            });

        // Get current navigation
        this._fuseNavigationService.onNavigationChanged
            .pipe(
                filter(value => value !== null),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe(() => {
                this.navigation = this._fuseNavigationService.getCurrentNavigation();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        if (this.fusePerfectScrollbarUpdateTimeout) {
            clearTimeout(this.fusePerfectScrollbarUpdateTimeout);
        }

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar opened status
     */
    toggleSidebarOpened(): void {
        this._fuseSidebarService.getSidebar('navbar').toggleOpen();
    }

    /**
     * Toggle sidebar folded status
     */
    toggleSidebarFolded(): void {
        this._fuseSidebarService.getSidebar('navbar').toggleFold();
    }

    openHomePage(): void {
        this._utils.routingPageChild('home');
    }

    getIndigoClass(): string {
        // if (this._utils.isQTSC()) {
        //     return '';
        // }
        return 'mat-indigo-700-bg';
    }

    getStyleText(): string {
        // if (this._utils.isQTSC()) {
        //     return 'black !important';
        // }
        return '';
    }

    getTextClass(): string {
        // if (this._utils.isQTSC()) {
        //     return 'h5 email mt-8';
        // }
        return 'h5 email hint-text mt-8';
    }

    getTextClassApplication(): string {
        // if (this._utils.isQTSC()) {
        //     return 'logo-text';
        // }
        return 'logo-text secondary-text';
    }
}
