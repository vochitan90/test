import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
// import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMatchMediaService } from '../../services/match-media.service';
import { AppState, Events } from 'app/main/shared';
import {FN_NAMES } from '../../../app/main/shared/const/Permission';

// import { FuseNavigationService } from '../navigation/navigation.service';

@Component({
    selector: 'fuse-shortcuts',
    templateUrl: './shortcuts.component.html',
    styleUrls: ['./shortcuts.component.scss']
})
export class FuseShortcutsComponent implements OnInit, OnDestroy {
    shortcutItems: any[];
    visibleShortcutItems: any[];
    navigationItems: any[];
    filteredNavigationItems: any[];
    searching: boolean;
    mobileShortcutsPanelActive: boolean;

    // @Input()
    // navigation: any;

    @ViewChild('searchInput', {static: true})
    searchInputField;

    @ViewChild('shortcuts',  {static: true})
    shortcutsEl: ElementRef;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {Renderer2} _renderer
     * @param {FuseMatchMediaService} _fuseMatchMediaService
     * @param {ObservableMedia} _observableMedia
     * @param _events
     * @param _appState
     */
    constructor(
        // private _cookieService: CookieService,
        private _fuseMatchMediaService: FuseMatchMediaService,
        // private _fuseNavigationService: FuseNavigationService,
        private _observableMedia: MediaObserver,
        private _renderer: Renderer2,
        private _events: Events,
        private _appState: AppState,
    ) {
        // Set the defaults
        this.shortcutItems = [];
        this.visibleShortcutItems = [];
        this.searching = false;
        this.mobileShortcutsPanelActive = false;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    private _updateVisibleShortcutItems(): void {
        this.visibleShortcutItems = this.shortcutItems.filter((s) => s.visible);
    }

    private _initShortcutItems(): void {
        // User's shortcut items
        this.shortcutItems = [
            {
                'title': 'CONTROL.CREATE_TICKET',
                'type': 'item',
                'icon': 'create',
                'visible': this._appState.hasPermission(FN_NAMES.TICKET_CREATE),
            },
            // {
            //     'title': 'Mail',
            //     'type': 'item',
            //     'icon': 'email',
            //     'url': '/apps/mail'
            // },
            // {
            //     'title': 'Contacts',
            //     'type': 'item',
            //     'icon': 'account_box',
            //     'url': '/apps/contacts'
            // },
            // {
            //     'title': 'To-Do',
            //     'type': 'item',
            //     'icon': 'check_box',
            //     'url': '/apps/todo'
            // }
        ];
        this._updateVisibleShortcutItems();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the navigation items and flatten them
        // this.filteredNavigationItems = this.navigationItems = this._fuseNavigationService.getFlatNavigation(this.navigation);

        // const cookieExists = this._cookieService.check('FUSE2.shortcuts');

        // if ( cookieExists )
        // {
        //     this.shortcutItems = JSON.parse(this._cookieService.get('FUSE2.shortcuts'));
        // }
        this._initShortcutItems();

        this._fuseMatchMediaService.onMediaChange
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                if (this._observableMedia.isActive('gt-sm')) {
                    this.hideMobileShortcutsPanel();
                }
            });

        this._events.subscribe('action:loadUserInfo', ((data: any) => {
            this._initShortcutItems();
        }));
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this._unsubscribeAll.unsubscribe();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Search
     *
     * @param event
     */
    search(event): void {
        const value = event.target.value.toLowerCase();

        if (value === '') {
            this.searching = false;
            this.filteredNavigationItems = this.navigationItems;

            return;
        }

        this.searching = true;

        this.filteredNavigationItems = this.navigationItems.filter((navigationItem) => {
            return navigationItem.title.toLowerCase().includes(value);
        });
    }

    /**
     * Toggle shortcut
     *
     * @param event
     * @param itemToToggle
     */
    toggleShortcut(event, itemToToggle): void {
        event.stopPropagation();

        // for (let i = 0; i < this.shortcutItems.length; i++) {
        //     if (this.shortcutItems[i].url === itemToToggle.url) {
        //         this.shortcutItems.splice(i, 1);

        //         // Save to the cookies
        //         this._cookieService.set('FUSE2.shortcuts', JSON.stringify(this.shortcutItems));

        //         return;
        //     }
        // }

        this.shortcutItems.push(itemToToggle);
        this._updateVisibleShortcutItems();

        // Save to the cookies
        // this._cookieService.set('FUSE2.shortcuts', JSON.stringify(this.shortcutItems));
    }

    /**
     * Is in shortcuts?
     *
     * @param navigationItem
     * @returns {any}
     */
    isInShortcuts(navigationItem): any {
        return this.shortcutItems.find(item => {
            return item.url === navigationItem.url;
        });
    }

    /**
     * On menu open
     */
    onMenuOpen(): void {
        setTimeout(() => {
            this.searchInputField.nativeElement.focus();
        });
    }

    /**
     * Show mobile shortcuts
     */
    showMobileShortcutsPanel(): void {
        this.mobileShortcutsPanelActive = true;
        this._renderer.addClass(this.shortcutsEl.nativeElement, 'show-mobile-panel');
    }

    /**
     * Hide mobile shortcuts
     */
    hideMobileShortcutsPanel(): void {
        this.mobileShortcutsPanelActive = false;
        this._renderer.removeClass(this.shortcutsEl.nativeElement, 'show-mobile-panel');
    }

    openShorcut(): void{
        this._events.publish('showPopupCreateTicket');
        
    }
}
