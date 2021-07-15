import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
// import { Location } from '@angular/common';
// import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
// import { NotificationModel, MailFakeDb } from '../notification.model';
import { NotificationService } from '../notification.service';
import { UtilCommon, AppState, Events } from 'app/main/shared';

// import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
// import { Mail } from 'app/main/apps/mail/mail.model';
// import { MailService } from 'app/main/apps/mail/mail.service';
import { INotification } from '../../../models/notification';
@Component({
    selector: 'notification-list',
    templateUrl: './notification-list.component.html',
    styleUrls: ['./notification-list.component.scss'],
    // directives: [InfiniteScrollDirective],
    animations: fuseAnimations,
})
export class NotificationListComponent implements OnInit, OnDestroy, AfterViewInit {
    notifications: INotification[];
    currentNotificaion: any;
    offset: number = 0;
    totalLength: number = 0;
    config = {
        suppressScrollX: true
    };

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ActivatedRoute} _activatedRoute
     * @param {MailService} _mailService
     * @param {Location} _location
     */
    constructor(
        private _mailService: NotificationService,
        private _appState: AppState,
        private _utils: UtilCommon,
        private _events: Events
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.notifications = [];
        this.offset = 0;

        this._events.subscribe('loadMailNotification', (data) => {
            if (this.totalLength >= this._appState.getPageSize()) {
                this.offset += this._appState.getPageSize();
                this.loadDataMail(this.offset);
            }
        });

        this._events.subscribe('searchMailNotification', (data) => {
            // if (this.totalLength >= this._appState.getPageSize()) {
            //     this.offset += this._appState.getPageSize();
            //     this.loadDataMail(this.offset);
            // }
            // if (data) {
            this.totalLength = 0;
            this.notifications = [];
            this.currentNotificaion = null;
            this.offset = 0;
            this._mailService.setCurrentMail(null);
            this.loadDataMail(0, data);
            // }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // this._mailService.onMailsChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(notifications => {
        //         this.notifications = notifications;
        //     });

        // this.notifications = MailFakeDb.mails;
        // // Subscribe to update current mail on changes
        // this._mailService.onCurrentMailChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(currentMail => {
        //         if (!currentMail) {
        //             // Set the current mail id to null to deselect the current mail
        //             this.currentNotificaion = null;

        //             // Handle the location changes
        //             // const labelHandle = this._activatedRoute.snapshot.params.labelHandle,
        //             //     filterHandle = this._activatedRoute.snapshot.params.filterHandle,
        //             //     folderHandle = this._activatedRoute.snapshot.params.folderHandle;

        //             // if (labelHandle) {
        //             //     this._location.go('apps/mail/label/' + labelHandle);
        //             // }
        //             // else if (filterHandle) {
        //             //     this._location.go('apps/mail/filter/' + filterHandle);
        //             // }
        //             // else {
        //             //     this._location.go('apps/mail/' + folderHandle);
        //             // }
        //         }
        //         else {
        //             this.currentNotificaion = currentMail;
        //         }
        //     });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this._mailService.mails = [];
        this.notifications = [];
        this._events.unsubscribe('loadMailNotification');
        this._events.unsubscribe('searchMailNotification');

    }

    loadDataMail(offset: number, keyword: string = ''): void {
        this._mailService.getPagingListMail(offset, this._appState.getPageSize(), keyword).then((dataNotifications: any) => {
            if (dataNotifications) {
                const dataNotification: INotification[] = dataNotifications.data;
                if (this._utils.checkISArray(dataNotification)) {

                    for (const notif of dataNotification) {
                        notif.message = notif.title;
                        notif.user = notif.from;
                        notif.isReaded = notif.unread;
                        notif.time = this._utils.formatDateFullTime(notif.createdTime);

                    }
                    this.totalLength = dataNotification.length;
                    Array.prototype.push.apply(this.notifications, dataNotification);
                    Array.prototype.push.apply(this._mailService.mails, dataNotification);
                }
                //  
            }
        }).catch(() => {

        });
    }
    ngAfterViewInit(): void {
        this.loadDataMail(this.offset);
        // this._mailService.getPagingList(30).then((dataNotifications: any) => {
        //     if (dataNotifications) {
        //         const dataNotification: INotification[] = dataNotifications.data;
        //         if (this._utils.checkISArray(dataNotification)) {
        //             // for (const data1 of dataNotification) {
        //             //     dataNotification.push(data1);
        //             // }

        //             // for (let index = 0; index < 20; index++) {
        //             //     dataNotification.push(dataNotification[3]);
        //             // }
        //             // for (const data2 of dataNotification) {
        //             // //     dataNotification.push(data2);
        //             // // }

        //             // // for (const data3 of dataNotification) {
        //             // //     dataNotification.push(data3);
        //             // // }
        //             for (const notif of dataNotification) {
        //                 notif.message = notif.title;
        //                 notif.user = notif.from;
        //                 notif.isReaded = notif.unread;
        //                 notif.time = this._utils.formatDate(notif.createdTime);


        //                 // this._mailService.updateRead(notif.aggId, 1);
        //             }
        //             this.notifications = dataNotification;
        //             this._mailService.mails = dataNotification;
        //         }
        //         //  
        //     }
        // }).catch(() => {

        // });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Read mail
     *
     * @param mailId
     */
    readMail(mail: INotification): void {
        // const labelHandle = this._activatedRoute.snapshot.params.labelHandle,
        //     filterHandle = this._activatedRoute.snapshot.params.filterHandle,
        //     folderHandle = this._activatedRoute.snapshot.params.folderHandle;

        // if (labelHandle) {
        //     this._location.go('apps/mail/label/' + labelHandle + '/' + mailId);
        // }
        // else if (filterHandle) {
        //     this._location.go('apps/mail/filter/' + filterHandle + '/' + mailId);
        // }
        // else {
        //     this._location.go('apps/mail/' + folderHandle + '/' + mailId);
        // }

        // // Set current mail
        this._mailService.setCurrentMail(mail.id);
        this.currentNotificaion = mail;
        // this._mailService.setMailCurrent(mail);
    }

    // onScrollDown(): void {
    //     if (this.totalLength >= this._appState.getPageSize()) {
    //         this.offset += this._appState.getPageSize();
    //         this.loadDataMail(this.offset);
    //         console.log('scrolled!!');
    //     }
    // }

    // onUp(): void {
    //     console.log('onUp !!');
    // }
}
