import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
// import { NotificationModel, MailFakeDb } from '../notification.model';
import { NotificationService } from '../notification.service';
import { UtilCommon, Events } from 'app/main/shared';
import { INotification } from '../../../models/notification';
@Component({
    selector: 'notification-details',
    templateUrl: './notification-details.component.html',
    styleUrls: ['./notification-details.component.scss'],
    animations: fuseAnimations
})
export class NotificationDetailsComponent implements OnInit, OnDestroy {
    mail: INotification;
    labels: any[];
    showDetails: boolean;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {MailService} _mailService
     */
    constructor(
        private _mailService: NotificationService,
        private _utils: UtilCommon,
        private _events: Events,
    ) {
        // Set the defaults
        this.showDetails = false;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to update the current mail
        this._mailService.onCurrentMailChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(currentMail => {
                if (currentMail) {
                    if (Array.isArray(currentMail)) {
                        if (currentMail.length > 0) {
                            this.mail = currentMail[0];
                            if (this.mail.isReaded) {
                                this.mail.isReaded = 0;
                                this._mailService.updateRead(this.mail.aggId, 0);
                            }
                        }
                    } else {
                        this.mail = currentMail;
                        if (this.mail.isReaded) {
                            this.mail.isReaded = 0;
                            this._mailService.updateRead(this.mail.aggId, 0);
                            this._events.publish('handleNotificationNumber', true, this.mail.aggId);
                        }
                    }
                    // this.mail = currentMail;
                } else {
                    if (this.mail) {
                        this.mail = null;
                    }
                }
                // this.mail = currentMail;
            });
        // this.mail = this._mailService.getMailCurrent();
        // Subscribe to update on label change
        this._mailService.onLabelsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(labels => {
                this.labels = labels;
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
     * Toggle star
     *
     * @param event
     */
    toggleStar(event): void {
        event.stopPropagation();

        // this.mail.toggleStar();

        this._mailService.updateMail(this.mail);
    }

    /**
     * Toggle important
     *
     * @param event
     */
    toggleImportant(event): void {
        event.stopPropagation();

        // this.mail.toggleImportant();

        this._mailService.updateMail(this.mail);
    }
}
