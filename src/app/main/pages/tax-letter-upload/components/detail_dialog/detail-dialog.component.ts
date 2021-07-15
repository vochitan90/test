import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { checkIsNotNull } from 'app/main/shared/utils/GridService';
import { TranslateService } from '@ngx-translate/core';
import { COMPONENT_CONSTANT, VALIDATION_CONSTANT_MESSAGE } from 'app/main/shared/const/app.constant';
import { TAX_LETTER_UPLOAD_CONSTANT } from '../../tax-letter-upload.constant';
import { TaxLetterUploadStore } from '../../tax-letter-upload.store';
import { IProcessUpload } from '../../models/processUpload.interface';
import { UtilCommon, UtilComponent } from 'app/main/shared';
import { IContentDetail } from '../../models/content.interface';


@Component({
    selector: 'app-period-upload-dialog-form',
    templateUrl: './detail-dialog.component.html',
    styleUrls: ['./detail-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class TaxLetterDetailResultUploadDialogComponent implements OnInit, OnDestroy, AfterViewInit {
    public data: IProcessUpload;
    public loading = true;
    formGroupAccountDetail: FormGroup;
    dataAccount: any;
    content;
    statusText: string;
    lstSuccess = [];
    lstFail = [];
    currentStatusRecord;

    processDetailIds = [];
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _store: TaxLetterUploadStore,
        private _utils: UtilCommon,
        private _utilCmp: UtilComponent,
        private _formBuilder: FormBuilder,
        private _translateService: TranslateService,
        @Inject(MAT_DIALOG_DATA) private _dialogData: any,
        public matDialogRef: MatDialogRef<TaxLetterDetailResultUploadDialogComponent>) {
    }

    async getAllInforWhenOpenDialog(): Promise<void>{
        const response = await this._store.handleListProcessStatus(this.data.id);
            if (this._utils.checkIsNotNull(response)) {
                this.lstSuccess = response.sucessing;
                this.lstFail = response.failing;
                let exceptionContent = null;
                let message = '';
                const fieldUpload = TAX_LETTER_UPLOAD_CONSTANT.FIELD_UPLOAD_EXCEL;
                //const exceptionContent = response.failing.exceptionContent;
                for (const exception of response.failing) {
                    message = '';
                    const exceptionContent = exception.exceptionContent;
                    for (const exp in exceptionContent) {
                        for (const field in fieldUpload) {
                            if (exp === field) {
                                const fieldName = fieldUpload[field];
                                const msg = VALIDATION_CONSTANT_MESSAGE[exceptionContent[field]].toLowerCase()
                                message += '- ' + fieldName + ' ' + msg +'<br/>';
                            }
                        }
                    }
                    if(message){
                        exception.exceptionContentExt = message;
                    }
                    // if(exception.exceptionContent)
                }
                this.lstFail = response.failing;
            }
    }
    async ngAfterViewInit(): Promise<void> {
        try {
            await this.getAllInforWhenOpenDialog();
        } catch (error) {
            console.log(error);
        } finally {
            this.loading = false;
            this._changeDetectorRef.detectChanges();
        }
    }

    ngOnInit(): void {
        try {
            if (checkIsNotNull(this._dialogData)) {
                this.data = this._dialogData.data;
                this.statusText = this._translateService.instant('TAXINCOME_LETTER_UPLOAD.STATUS_' + this.data.status);
                this.content = JSON.parse(this.data.content.value);
                // const response = await this._store.handleListProcessStatus(this.data.id);
                // if(this._utils.checkIsNotNull(response)){
                //     this.lstSuccess = response.sucessing;
                //     this.lstFail = response.failing;
                // }
                // this.loading = false;
                // this._changeDetectorRef.detectChanges();
            }
        } catch (err: any) {
            this.loading = false;
            this._changeDetectorRef.detectChanges();
        };
    }

    getStyleStatusText() {
        if (this.data) {
            if (this.data.status == 1) {
                return '#018747';
            }
            if (this.data.status == 2) {
                return 'red';
            }
        }
    }

    ngOnDestroy(): void {

    }

    cancel() {
        console.log("cancel");
    }

    export() {

    }

    getCurrentDetailStatusOfRecord(status){
        return this._translateService.instant('TAXINCOME_LETTER_UPLOAD.STATUS_DETAIL_' + status);
    }

    async send(): Promise<void> {
        try {
            await this._store.issueImport(this.data.id, this.processDetailIds);
        } catch (error) {
            this._utilCmp.showTranslateSnackbar('Phát hành thất bại!', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
        } finally{
            this.loading = false;
            await this.getAllInforWhenOpenDialog();
            this._changeDetectorRef.detectChanges();
        }

    }
    release() {
        
    }

    selectedRecord(success: IContentDetail) {
        success.checked = !success.checked;
        this.processDetailIds.push(success.id);
    }

    hideTable(evt) {
        console.log(evt);
    }

    async downloadTemplate(): Promise<void>{
        try {
            await this._store.downloadFile(this.data.id, this.data.fileName);
        } catch (error) {
            this._utilCmp.showTranslateSnackbar('DOWNLOAD_FAIL', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
        } finally{
            this.loading = false;
            this._changeDetectorRef.detectChanges();
        }
    }

}
