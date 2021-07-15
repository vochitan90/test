import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppState } from '../../../utils/AppState';

@Component({
    selector: 'app-profile-dialog',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ProfileDialogComponent {
    action: string;
    profile: any;
    contactForm: FormGroup;
    dialogTitle: string;


    /**
     * Constructor
     *
     * @param {MatDialogRef<ProfileDialogComponent>} matDialogRef
     * @param _datam
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<ProfileDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _appState: AppState
    ) {
        // Set the defaults
        this.action = _data.action;
        this.profile = this._appState.getAppState();
        this.profile.avatar = 'assets/images/avatars/profile.jpg';
        
        this.contactForm = this.createContactForm();
        this.contactForm.disable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create contact form
     *
     * @returns {FormGroup}
     */
    createContactForm(): FormGroup {
        return this._formBuilder.group({
            id: [this.profile.username],
            name: [this.profile.username],
            avatar: [this.profile.avatar],
            nickname: [this.profile.nickname],
            company: [this.profile.company],
            jobTitle: [this.profile.jobTitle],
            email: [this.profile.email],
            fullName: [this.profile.fullName],
            phone: [this.profile.phone],
            address: [this.profile.address],
            birthday: [this.profile.birthday],
            notes: [this.profile.notes],
            firstName: [this.profile.firstName],
            lastName: [this.profile.lastName]
        });
    }
}
