import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TdDialogService } from '../components/component/dialogs';
import { checkIsNotNull } from './GridService';
import { COMPONENT_CONSTANT, VALIDATION_CONSTANT } from '../const/app.constant';

@Injectable({ providedIn: 'root' })
export class UtilComponent {

    constructor(private snackBar: MatSnackBar, private translateService: TranslateService, private dialogService: TdDialogService) {

    }

    generateProgressButton(text: string, disabled: boolean = false, active: boolean = false, spinnerSize: number = 18, raised: boolean = true,
        buttonColor: string = 'accent',
        spinnerColor: string = 'mat-white', fullWidth: boolean = true,
        mode: string = 'indeterminate'): any {
        const spinnerButtonOptions: any = {
            active: active,
            text: text,
            spinnerSize: spinnerSize,
            raised: raised,
            buttonColor: buttonColor,
            spinnerColor: spinnerColor,
            fullWidth: fullWidth,
            disabled: disabled,
            mode: mode
        };

        return spinnerButtonOptions;
    }


    generateDialogAlert(message: string, title: string = '', closeButton: string = 'Đóng',
        disableClose: boolean = false,
        viewContainerRef: any = null, width: string = '400px'): void {
        this.dialogService.openAlert({
            message: message,
            disableClose: disableClose, // defaults to false
            viewContainerRef: viewContainerRef, // OPTIONAL
            title: title, // OPTIONAL, hides if not provided
            closeButton: closeButton, // OPTIONAL, defaults to 'CLOSE'
            width: width, // OPTIONAL, defaults to 400px
        });
    }

    generateDialogAlertWithCallBack(callBack: any, message: string, title: string = '', closeButton: string = 'Đóng',
        disableClose: boolean = false,
        viewContainerRef: any = null, width: string = '400px'): void {
        this.dialogService.openAlert({
            message: message,
            disableClose: disableClose, // defaults to false
            viewContainerRef: viewContainerRef, // OPTIONAL
            title: title, // OPTIONAL, hides if not provided
            closeButton: closeButton, // OPTIONAL, defaults to 'CLOSE'
            width: width, // OPTIONAL, defaults to 400px
        }).afterClosed().subscribe((accept: boolean) => {
            callBack.call();
        });
    }

    generateDialogConfirm(callbackAccept: any, callbackCancel: any, message: string, title: string = 'Xác nhận', disableClose: boolean = false,
        cancelButton: string = 'Hủy', acceptButton: string = 'Xác nhận', viewContainerRef: any = null, width: string = '500px'): void {
        this.dialogService.openConfirm({
            message: message,
            disableClose: disableClose, // defaults to false
            viewContainerRef: viewContainerRef, // OPTIONAL
            title: title, // OPTIONAL, hides if not provided
            cancelButton: cancelButton, // OPTIONAL, defaults to 'CLOSE'
            acceptButton: acceptButton,  // OPTIONAL, defaults to 'ACCEPT'
            width: width, // OPTIONAL, defaults to 400px
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                callbackAccept.call();
            } else {
                callbackCancel.call();
            }
        });
    }

    openSnackBar(message: string, type: string = 'complete', action: string = '', duration: number = 5000): MatSnackBarRef<SimpleSnackBar> {
        const config: any = new MatSnackBarConfig();
        if (type === 'complete') {
            config.panelClass = ['complete-snackbar'];
        } else if (type === 'error') {
            config.panelClass = ['error-snackbar'];
        }
        // else if (type === 'error') {
        //     config.panelClass = ['error-snackbar'];
        // }
        config.duration = duration;
        // config.panelClass = ['custom-class'];
        return this.snackBar.open(message, action, config);
    }

    checkValidateForm(formGroup: FormGroup): boolean {
        if (!formGroup.valid) {

            let control: any = null;
            const controls: any = Object.keys(formGroup.controls);

            for (const c of controls) {
                control = formGroup.controls[c];
                if (!control.valid) {
                    control.markAsTouched();
                    control.markAsDirty();
                    control.updateValueAndValidity();
                }
            }
            return false;
        }
        return true;
    }

    removeValidateFormGroup(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(key => {
            if (!formGroup.controls[key].dirty) {
                formGroup.controls[key].setErrors(null);
            }
        });
    }

    checkValidateFormWithSpecificForm(formGroup: FormGroup): any {
        if (!formGroup.valid) {

            let control: any = null,
                nameControl: any = '';

            const controls: any = Object.keys(formGroup.controls);

            for (const c of controls) {
                control = formGroup.controls[c];
                if (!control.valid) {
                    if (nameControl.length === 0) {
                        nameControl = c;
                    }
                    control.markAsTouched();
                    control.markAsDirty();
                    control.updateValueAndValidity();
                }
            }
            if (nameControl.length > 0) {
                const element: any = document.querySelector('[formcontrolname=' + nameControl + ']');
                if (element && typeof element['focus'] === 'function') {
                    element['focus']();
                }
                return false;
            }
            return false;
        }
        return true;
    }

    checkValidateFormWithSpecificFormExclude(formGroup: FormGroup, exclude: Array<String>): any {
        if (!formGroup.valid) {
            let control: any = null,
                nameControl: any = '';
            const controls: any = Object.keys(formGroup.controls);
            let isExclude = false;
            for (const c of controls) {
                isExclude = false;
                for (const str of exclude) {
                    if (str === c) {
                        isExclude = true;
                        break;
                    }
                }
                if (isExclude) {
                    continue;
                }
                control = formGroup.controls[c];
                if (!control.valid) {
                    if (nameControl.length === 0) {
                        nameControl = c;
                    }
                    control.markAsTouched();
                    control.markAsDirty();
                    control.updateValueAndValidity();
                }
            }
            if (nameControl.length > 0) {
                const element: any = document.querySelector('[formcontrolname=' + nameControl + ']');
                if (element && typeof element['focus'] === 'function') {
                    element['focus']();
                }
                return false;
            }
        }
        return true;
    }

    checkFormControlDisabled(formGroup: FormGroup): any {
        const lstControls = [];
        let control: any = null;
        const controls: any = Object.keys(formGroup.controls);
        for (const c of controls) {
            control = formGroup.controls[c];
            if (control.disabled) {
                lstControls.push(c);
            }
        }
        return lstControls;
    }


    showTranslateSnackbar(key: string, type: string = 'complete'): MatSnackBarRef<SimpleSnackBar> {
        const message = this.translateService.instant(key);
        return this.openSnackBar(message, type);
    }

    showTranslateSnackbarWithField(field: string, key: string, type: string = 'complete'): MatSnackBarRef<SimpleSnackBar> {
        const message = field + ' ' + this.translateService.instant(key);
        return this.openSnackBar(message, type);
    }

    showTranslateSnackbarMessage(message: string, type: string = 'complete'): MatSnackBarRef<SimpleSnackBar> {
        return this.openSnackBar(message, type);
    }

    checkValidationErrorSubmit(data, screen: string = '') {
        if (checkIsNotNull(data)) {
            if (data.code === VALIDATION_CONSTANT.EXIST) {
                this.openSnackBar('Mã đã tồn tại', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
                return true;
            }
            if (data.code == VALIDATION_CONSTANT.JOBTITLE_CONFIG_ANOTHOR_WF) {
                this.openSnackBar('Lỗi', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
                return true;
            }
            if (data.code == VALIDATION_CONSTANT.VALID_EFFECTIVEDATE) {
                this.openSnackBar('Ngày hiệu lực không hợp lệ', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
                return true;
            }
        }
        return false;
    }

}
