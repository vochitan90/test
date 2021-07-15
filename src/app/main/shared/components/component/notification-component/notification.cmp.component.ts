import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppState } from '../../../utils/AppState';
@Component({
    selector: 'app-notification-dialog',
    templateUrl: './notification.cmp.component.html',
    styleUrls: ['./notification.cmp.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class NotificationComponent {
    profile: any;
    dialogTitle: string;
    notification: any;

    constructor(
        public matDialogRef: MatDialogRef<NotificationComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _appState: AppState
    ) {
        if (_data.notification) {
            if (!_data.notification.message) {
                _data.notification.message = _data.notification.title;
            }
            if (_data.notification.callFrom === 'socket') {
                _data.notification.title = '';
            }
        }
        this.notification = _data.notification;
    }

}
