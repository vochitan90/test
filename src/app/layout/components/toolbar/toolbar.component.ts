import { Component, OnDestroy, OnInit, ViewChild, TemplateRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { navigation } from '../../../navigation/navigation';
import { AppState, Events, UtilCommon } from '../../../main/shared';
import { ProfileDialogComponent } from '../../../main/shared/components/component/profile/profile.component';
import { NotificationComponent } from 'app/main/shared/components/component/notification-component/notification.cmp.component';
import { NotificationService } from 'app/main/pages/notification/notification.service';
import { INotification } from '../../../main/models/notification';
import { ChangePassDialogComponent } from 'app/main/shared/components/component/change-pass/change-pass.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})

export class ToolbarComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];
    dialogRef: any;
    confirmDialogRef: MatDialogRef<ProfileDialogComponent>;
    confirmDialogNotification: MatDialogRef<NotificationComponent>;
    phoneDialogNotification: MatDialogRef<any>;
    popupDialog: any;
    isHiddenToolBar: boolean;
    badgeNumb: number;
    notifications: any[] = [];
    reloadNotification: boolean;
    isShowPopUp: boolean;
    badgeNumbPopUp: number;
    showMultiApp: boolean;
    // Private
    private _unsubscribeAll: Subject<any>;
    subscription: Subscription;
    subscriptionOne: Subscription;
    key: any;
    KEYBOARD_SHORTCUTS: boolean;
    arrayShortcut = [];
    checkKey = true;
    isShowPopUpHelp: boolean;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     */

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,
        public _appState: AppState,
        public _matDialog: MatDialog,
        private _events: Events,
        private _utils: UtilCommon,
        private _notificationSerivce: NotificationService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
        this.languages = [
            {
                id: 'en',
                title: 'English',
                flag: 'us'
            },
            {
                id: 'vi',
                title: 'VietNam',
                flag: 'vi'
            }
        ];

        this.selectedLanguage = this.languages[1];

        this.navigation = navigation;

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.isHiddenToolBar = false;

        this.notifications = [];

        this._events.subscribe('handleNotificationNumber', (notification, aggIdNotification) => {
            if (notification) {
                if (this.badgeNumb > 0) {
                    this.badgeNumb = this.badgeNumb - 1;
                    for (const notif of this.notifications) {
                        if (notif.aggId === aggIdNotification) {
                            notif.isReaded = 0;
                            break;
                        }
                    }
                }
            }
        });

        this._events.subscribe('updateNotificationNumber', (notification) => {
            if (notification) {
                this.badgeNumb = this.badgeNumb + 1;
            }
        });
        this._events.subscribe('gotoDoc', (notification) => {
            this.help(null);
        });
        this._events.subscribe('showPopupHelp', (notification) => {

            this.showInfo();
        });
        this._events.subscribe('gotoDashboard', (notification) => {
            this._utils.setRootPage('/home');
        });
        this._events.subscribe('clickNotification', (notification) => {
            if (notification) {
                notification.callFrom = 'socket';
                this.viewNotification(notification);
            }
        });

        this._events.subscribe('addArrayNotification', (notification) => {
            if (notification) {
                this.reloadNotification = true;
                // this._notificationSerivce.
                //     getPagingListMail(10, this._appState.getPageSize()).then((dataNotifications: any) => {
                //         if (this._utils.checkISArray(dataNotifications.data)) {
                //             const dataNotificationsT: INotification[] = dataNotifications.data;
                //             for (const notif of dataNotificationsT) {
                //                 notif.message = notif.title;
                //                 notif.user = notif.from;
                //                 notif.isReaded = notif.unread;
                //                 notif.time = this._utils.formatDate(notif.createdTime);
                //             }
                //             this.notifications = dataNotificationsT;
                //         }
                //     });
            }
        });

        this._events.subscribe('hiddenToolBar', ((data: any) => {
            if (!this.isHiddenToolBar && !data && this.isHiddenToolBar === data) {
                return;
            }
            this.isHiddenToolBar = data;

            this._fuseConfigService.config = {
                layout: {
                    navbar: {
                        hidden: data
                    },
                    toolbar: {
                        hidden: data
                    },
                    footer: {
                        hidden: data
                    },
                    sidepanel: {
                        hidden: data
                    }
                }
            };
        }));
        this.reloadNotification = false;
        this.isShowPopUp = false;
        this.isShowPopUpHelp = false;
    }
    showInfo(): void {
        if (document.getElementById('matDialogKeyboardS')) {
            return;
        }
        if (this.isShowPopUpHelp) {
            return;
        }
        this.isShowPopUpHelp = true;

        this.dialogRef.afterClosed()
            .subscribe(response => {
                this.isShowPopUpHelp = false;
            });
    }
    keyCode(arr): any {
        return arr['which'] || arr['keyCode'];
    }
    doSomething(): void {
        if (!this.listenForFocus() && this.KEYBOARD_SHORTCUTS) {
            this._events.publish('showPopupCreateTicket');
        }
    }
    getUserAttribute(value): Promise<any> {
        return this._appState.getAttributeValue(value).then(data => {
            if (data) {
                this.KEYBOARD_SHORTCUTS = data.value;
            } else {
                this.KEYBOARD_SHORTCUTS = true;
            }

            return this.KEYBOARD_SHORTCUTS;
        });
    }
    help(event): void {

        let accessLink = 'place_list:';
        accessLink = location.hash.replace('#/', '/');
        this._appState.getlink(accessLink).then(data => {
            if (data) {
                window.open(data, '_blank');
            }
        });

    }
    listenForFocus(): any {
        const input = document.activeElement;
        if (input && (input.tagName == 'INPUT' || input.tagName == 'TEXTAREA')) {
            return true;
        }

        return false;
    }
    ngOnInit(): void {

        const countTicket: any = localStorage.getItem('lstTicket');
        if (!countTicket || countTicket === 'null') {
            this.badgeNumbPopUp = 0;
        } else {
            this.badgeNumbPopUp = JSON.parse(countTicket).length;
        }
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });
      
        // this.getLangUserAttribute().then(data => {
        //     if (data) {
        //         this.selectedLanguage = data;
        //     }
        //     else {
        //         const language = localStorage.getItem('language') || 'vi';
        //         if (language === 'vi') {
        //             this.selectedLanguage = {
        //                 flag: 'vi',
        //                 id: 'vi',
        //                 title: 'VietNam',
        //             };
        //         } else if (language === 'en') {
        //             this.selectedLanguage = {
        //                 flag: 'us',
        //                 id: 'en',
        //                 title: 'English',
        //             };
        //         }
        //     }
        // });
        this._translateService.onLangChange.pipe(skip(0), takeUntil(this._unsubscribeAll)).subscribe((event) => {
            this.selectedLanguage = _.find(this.languages, { 'id': event.lang });
            localStorage.setItem('language', event.lang);
            this._appState.changeLang(event.lang);
            this._appState.changeConfigNumberDirective(event.lang);
            // this._events.publish('load:menuTree', true);
        });
        // An toolbar o cac trang ko can show
        // const arrHashHidden: string[] = ['login', 'approval-ticket'];
        // const hash: string = location.hash;
        // for (const hide of arrHashHidden) {
        //     if (hash.indexOf(hide) > -1) {
        //         // this.isHidden = true;
        //         return;
        //     }else{
        //         this.isHidden = false;
        //     }
        // }

    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        this._unsubscribeAll.unsubscribe();

        this._events.unsubscribe('handleNotificationNumber');
        this._events.unsubscribe('clickNotification');
        this._events.unsubscribe('updateNotificationNumber');
        this._events.unsubscribe('addArrayNotification');
        this._events.unsubscribe('showPopupCreateTicket');
        this._events.unsubscribe('KEYBOARD_SHORTCUTS');
        this._events.unsubscribe('gotoDashboard');
        this._events.unsubscribe('gotoDoc');


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
        if (key === 'quickPanel') {
            this._events.publish('initQuickPanel');
        }
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void {
        // Do your search here...
        console.log(value);
    }

    /**
     * Set the language
     *
     * @param lang
     */
 
    setLanguage(lang): void {
        // Use the selected language for translations
        localStorage.setItem('language', lang);
        // this.setLangUserAttribute(lang);
        this._translateService.use(lang.id);
        this._changeDetectorRef.detectChanges();
    }

    logout(): void {
        this._events.publish('main:logout');
    }

    showProfile(): void {
        this.dialogRef = this._matDialog.open(ProfileDialogComponent, {
            panelClass: 'custom-dialog-default',
            data: {
                contact: {},
                action: 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
            });
    }

    openMenu(): void {
        console.log(' open menu ');
    }

    openDiaglogNotification(): void {
        if (this.reloadNotification) {
            this._notificationSerivce.
                getPagingListMail(0, this._appState.getPageSize()).then((dataNotifications: any) => {
                    if (this._utils.checkISArray(dataNotifications.data)) {
                        const dataNotificationsT: INotification[] = dataNotifications.data;
                        for (const notif of dataNotificationsT) {
                            notif.message = notif.title;
                            notif.user = notif.from;
                            notif.isReaded = notif.unread;
                            notif.time = this._utils.formatDateFullTime(notif.createdTime);
                        }
                        this.notifications = dataNotificationsT;
                    }
                    this.reloadNotification = false;
                });
        }
    }

    trackByNotification(index: number): number {
        return index;
    }

    viewNotification(notification: INotification): void {
        this.dialogRef = this._matDialog.open(NotificationComponent, {
            panelClass: 'notification-component-form-dialog',
            data: {
                notification: notification,
            }
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (notification.isReaded) {
                    notification.isReaded = 0;
                    this.badgeNumb = this.badgeNumb - 1;
                    this._notificationSerivce.updateRead(notification.aggId, notification.isReaded);
                }
                notification.isReaded = 0;
                if (this.badgeNumb === 0) {
                    // this.badgeNumb = null;
                    return;
                }
            });
    }

    ngAfterViewInit(): void {

        // this._notificationSerivce.countNotification().then((unreadNotification: any) => {
        //     if (unreadNotification) {
        //         this.badgeNumb = unreadNotification;
        //         const badgeNumb: number = (this.badgeNumb > 10) ? 10 : this.badgeNumb;
        //         return this._notificationSerivce.getPagingListMail(0, this._appState.getPageSize());
        //     }
        //     this.badgeNumb = 0;
        //     return this._notificationSerivce.getPagingListMail(0, this._appState.getPageSize());

        // }).then((dataNotifications: any) => {
        //     if (!dataNotifications) {
        //         return;
        //     }
        //     if (this._utils.checkISArray(dataNotifications.data)) {
        //         const dataNotificationsT: INotification[] = dataNotifications.data;
        //         for (const notif of dataNotificationsT) {
        //             notif.message = notif.title;
        //             notif.user = notif.from;
        //             notif.isReaded = notif.unread;
        //             notif.time = this._utils.formatDateFullTime(notif.createdTime);
        //         }
        //         this.notifications = dataNotificationsT;
        //     }
        // }).catch(() => {

        // });
    }

    viewAllNotification(): void {
        this.badgeNumb = 0;
        this._notificationSerivce.readAll();
    }

    isReaded(noti: any): string {
        if (noti.isReaded) {
            return 'bold';
        }
        return '';
    }

    changePass(): void {
        this.dialogRef = this._matDialog.open(ChangePassDialogComponent, {
            panelClass: 'custom-dialog-default',
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
            });
    }
    setting(): void {
       
    }

    openApp(): void {
        this.showMultiApp = !this.showMultiApp;
    }
}
