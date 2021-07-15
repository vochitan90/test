import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { TranslateService } from '@ngx-translate/core';
import { UtilCommon, UtilComponent } from 'app/main/shared';
import { COMPONENT_CONSTANT, VALIDATION_CONSTANT_MESSAGE } from 'app/main/shared/const/app.constant';
import { checkIsNotNull } from 'app/main/shared/utils/GridService';
import { ITaxIncomeIssueImport } from '../../models/taxIncome.interface';
import { ITaxIncomeUploadDetail } from '../models/content.interface';
import { IProcessUpload } from '../models/processUpload.interface';
import { UPLOAD_PERIOD_CONSTANT } from '../period-upload.constant';
import { PeriodUploadStore } from '../period-upload.store';


@Component({
    selector: 'app-period-upload-dialog-form',
    templateUrl: './detail-dialog.component.html',
    styleUrls: ['./detail-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class PeriodDetailResultUploadDialogComponent implements OnInit, OnDestroy, AfterViewInit {
    isCheckAll = false;
    showCheckBoxAll = false;
    public data: IProcessUpload;
    public loading = true;
    formGroupAccountDetail: FormGroup;
    dataAccount: any;
    content;
    statusText: string;
    lstSuccess: ITaxIncomeUploadDetail[] = [];
    lstFail: ITaxIncomeUploadDetail[] = [];
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _store: PeriodUploadStore,
        private _utils: UtilCommon,
        private _utilCmp: UtilComponent,
        private _translateService: TranslateService,
        @Inject(MAT_DIALOG_DATA) private _dialogData: any,
        public matDialogRef: MatDialogRef<PeriodDetailResultUploadDialogComponent>) {
    }
    async ngAfterViewInit(): Promise<void> {
        try {
            await this.reloadData();
        } catch (error) {

        } finally {
            this.loading = false;
            this._changeDetectorRef.detectChanges();
        }
    }

    async reloadData(): Promise<void> {
        const response = await this._store.handleListProcessStatus(this.data.id);
        if (this._utils.checkIsNotNull(response)) {
            this.lstSuccess = response.sucessing;
            this.lstFail = response.failing;
            let exceptionContent = null;
            let message = '';
            const fieldUpload = UPLOAD_PERIOD_CONSTANT.FIELD_UPLOAD_EXCEL;
            for (const exception of this.lstSuccess) {
                // Hợp lệ thì show checkbox để phát hành
                if (exception.status === UPLOAD_PERIOD_CONSTANT.STATUS_DETAIL.VALID) {
                    exception.showCheckBox = true;
                    exception.checked = false;
                    this.showCheckBoxAll = true;
                }
                const payFromDate = exception.content.empPayFromMonth + '/' + exception.content.empPayYear;
                const payToDate = exception.content.empPayToMonth + '/' + exception.content.empPayYear;
                exception.content.empTimePay = payFromDate + ' - ' + payToDate;
            }

            for (const exception of this.lstFail) {
                if (exception.content.empPayFromMonth && exception.content.empPayToMonth && exception.content.empPayYear) {
                    const payFromDate = exception.content.empPayFromMonth + '/' + exception.content.empPayYear;
                    const payToDate = exception.content.empPayToMonth + '/' + exception.content.empPayYear;
                    exception.content.empTimePay = payFromDate + ' - ' + payToDate;
                }
                message = '';
                exceptionContent = exception.exceptionContent;
                for (const exp in exceptionContent) {
                    if (exceptionContent[exp]) {
                        for (const field in fieldUpload) {
                            if (exp === field) {
                                message += '- ' + fieldUpload[field] + ' ' + VALIDATION_CONSTANT_MESSAGE[exceptionContent[field]].toLowerCase() + '<br/>';
                            }
                        }
                    }
                }
                if (message) {
                    exception.exceptionContentExt = message;
                }
                // if(exception.exceptionContent)
            }
            this.lstFail = response.failing;
        }
    }

    ngOnInit(): void {
        try {
            if (checkIsNotNull(this._dialogData)) {
                this.data = this._dialogData.data;
                this.statusText = this._translateService.instant('PROCESS_UPLOAD.STATUS_' + this.data.status);
                this.content = JSON.parse(this.data.content.value);
            }
        } catch (err: any) {
            this.loading = false;
            this._changeDetectorRef.detectChanges();
        }
    }

    getStyleStatusText(): string {
        if (this.data) {
            if (this.data.status === 1) {
                return '#018747';
            }
            if (this.data.status === 2) {
                return 'red';
            }
        }
    }

    ngOnDestroy(): void {

    }

    selectedRecord(success: ITaxIncomeUploadDetail): any {
        if (success.showCheckBox) {
            success.checked = !success.checked;
            const numberOfCheckboxes = this.lstSuccess.filter(item => item.showCheckBox).length;
            const numberOfCheckboxesChecked = this.lstSuccess.filter(item => item.checked === true).length;
            if (numberOfCheckboxes === numberOfCheckboxesChecked) {
                this.isCheckAll = true;
            } else {
                this.isCheckAll = false;
            }
        }
    }

    hideTable(evt): void {
        console.log(evt);
    }

    async downloadTemplate(): Promise<void> {
        try {
            await this._store.downloadFile(this.data.id, this.data.fileName);
        } catch (error) {
            this._utilCmp.showTranslateSnackbar('DOWNLOAD_FAIL', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
        } finally {
            this.loading = false;
            this._changeDetectorRef.detectChanges();
        }
    }

    checkAll(): void {
        this.isCheckAll = !this.isCheckAll;
        for (const exp of this.lstSuccess) {
            if (exp.showCheckBox) {
                exp.checked = this.isCheckAll;
            }
        }
    }

    async issue(): Promise<void> {
        const listCheck = this.lstSuccess.filter(item => item.checked === true);
        if (listCheck.length === 0) {
            this._utilCmp.showTranslateSnackbar('Vui lòng chọn upload hợp lệ muốn phát hành', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
            return;
        }
        const data: ITaxIncomeIssueImport = {
            id: this.data.id,
            processDetailIds: listCheck.map(item => item.id)
        };
        this.loading = true;

        const res = await this._store.issueImport(data);
        if (!this._utils.checkIsNotNull(res)) {
            this._utilCmp.showTranslateSnackbar('ISSUE_TAX_INCOME_SUCCESS');
            this.matDialogRef.close(true);
            this.loading = false;
        } else {
            this._utilCmp.showTranslateSnackbar('ISSUE_TAX_INCOME_FAIL', 'error');
            this.loading = false;
        }
    }
}
