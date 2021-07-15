import { Component, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AppState } from '../../../utils/AppState';
import { UtilComponent } from 'app/main/shared/utils/UtilComponent';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { UtilCommon } from 'app/main/shared/utils/UtilCommon';
import { Events } from 'app/main/shared/utils/Events';
import {TranslateService} from '@ngx-translate/core';
@Component({
    selector: 'app-change-pass-dialog',
    templateUrl: './change-pass.component.html',
    styleUrls: ['./change-pass.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ChangePassDialogComponent {
    action: string;
    profile: any;
    changePassForm: FormGroup;
    dialogTitle: string;
    spinnerButtonOptions: MatProgressButtonOptions;
    iconCurrent: string;
    iconNew: string;

    @ViewChild('passwordCurrent') passwordCurrent: ElementRef;
    @ViewChild('passwordNew') passwordNew: ElementRef;

    constructor(
        public matDialogRef: MatDialogRef<ChangePassDialogComponent>,
        private _formBuilder: FormBuilder,
        private _appState: AppState,
        private _utilComponent: UtilComponent,
        private _utils: UtilCommon,
        private _events: Events,
        private _translateService: TranslateService,
    ) {
        this.spinnerButtonOptions = this._utilComponent.generateProgressButton(
            this._translateService.instant('CONTROL.CHANGE_PASS')
        );

        this.profile = this._appState.getAppState();

        this.changePassForm = this.createContactForm();

        this.iconCurrent = 'visibility';
        this.iconNew = 'visibility';
    }

    createContactForm(): FormGroup {
        return this._formBuilder.group({
            passwordCurrent: ['', [Validators.required, Validators.minLength(8)]],
            passwordNew: ['', [Validators.required, Validators.minLength(8)]]
        });
    }

    viewpass(): void {
        if (this.passwordCurrent.nativeElement.type === 'text') {
            this.passwordCurrent.nativeElement.type = 'password';
            this.iconCurrent = 'visibility';
        } else if (this.passwordCurrent.nativeElement.type === 'password') {
            this.passwordCurrent.nativeElement.type = 'text';
            this.iconCurrent = 'visibility_off';
        }
        this._utilComponent.removeValidateFormGroup(this.changePassForm);
    }

    viewpass2(): void {
        if (this.passwordNew.nativeElement.type === 'text') {
            this.passwordNew.nativeElement.type = 'password';
            this.iconNew = 'visibility';

        } else if (this.passwordNew.nativeElement.type === 'password') {
            this.passwordNew.nativeElement.type = 'text';
            this.iconNew = 'visibility_off';
        }
        this._utilComponent.removeValidateFormGroup(this.changePassForm);
    }


    changeViewPass(passwordNew: any, iconNew: string): void {
        if (passwordNew.nativeElement.type === 'text') {
            passwordNew.nativeElement.type = 'password';
            iconNew = 'visibility';
        } else if (passwordNew.nativeElement.type === 'password') {
            passwordNew.nativeElement.type = 'text';
            iconNew = 'visibility_off';
        }
    }

    changePass(): void {
        const changePassForm = this.changePassForm;
        if (!this._utilComponent.checkValidateFormWithSpecificForm(changePassForm) || this.spinnerButtonOptions.active) {
            return;
        }
        const passwordCurrent = changePassForm.get('passwordCurrent').value,
            passwordNew = changePassForm.get('passwordNew').value;

        this.spinnerButtonOptions.active = true;
        this._appState.changePass(passwordCurrent, passwordNew).then((dataLogin: any) => {
            this.spinnerButtonOptions.active = false;
            if (dataLogin) {
                if (dataLogin.code === 1) {
                    this._utilComponent.showTranslateSnackbar('CHANGE_PASS_PAGE.CHANGE_PASS_SUCCESS');
                    this.matDialogRef.close();
                    setTimeout(() => {
                        this._events.publish('main:logout');

                        this._appState.clearLogout();

                        this._utils.setRootPage('login');

                    }, 1500);
                    return;
                } else {
                    const msg = dataLogin.msg || 'CHANGE_PASS_PAGE.CHANGE_PASS_FAIL';
                    this._utilComponent.showTranslateSnackbar(msg, 'error');
                    return;
                }
            }
            this._utilComponent.showTranslateSnackbar('CHANGE_PASS_PAGE.CHANGE_PASS_FAIL', 'error');
        }).catch(err => {
            this._utilComponent.showTranslateSnackbar('CHANGE_PASS_PAGE.CHANGE_PASS_FAIL', 'error');
            this.spinnerButtonOptions.active = false;
        });

    }
}
