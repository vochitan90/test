import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// import { NotificationModel, MailFakeDb } from '../../notification.model';
import { NotificationService } from '../../notification.service';
// import { Mail } from 'app/main/apps/mail/mail.model';
// import { MailService } from 'app/main/apps/mail/mail.service';
import { INotification } from '../../../../models/notification';
@Component({
    selector: 'notification-list-item',
    templateUrl: './notification-list-item.component.html',
    styleUrls: ['./notification-list-item.component.scss']
})
export class NotificationListItemComponent implements OnInit, OnDestroy {
    @Input() mail: INotification;
    labels: any[];

    @HostBinding('class.selected')
    selected: boolean;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {MailService} NotificationService
     */
    constructor(
        private _mailService: NotificationService
    ) {
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
        // Set the initial values
        this.mail = this.mail;
        this._mailService.onSelectedMailsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedMails => {
                this.selected = false;
                if (selectedMails.length > 0) {
                    for (const mail of selectedMails) {
                        if (mail.id === this.mail.id) {
                            this.selected = true;
                            break;
                        }
                    }
                }
            });

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
     * On selected change
     */
    onSelectedChange(): void {
        this._mailService.toggleSelectedMail(this.mail.id);
    }

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
     * Toggle Important
     *
     * @param event
     */
    toggleImportant(event): void {
        event.stopPropagation();

        // this.mail.toggleImportant();

        this._mailService.updateMail(this.mail);
    }
}
