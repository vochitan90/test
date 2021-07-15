import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { UtilCommon, UtilComponent } from 'app/main/shared';
import { APP_CONSTANT, COMPONENT_CONSTANT, FILE_CONSTANT } from 'app/main/shared/const/app.constant';
import { Subscription } from 'rxjs';
import { ITaxIncomeUpload, ResourceDtos } from '../../../models/taxIncome.interface';
import { TaxIncomeStore } from '../../../taxIncome.store';

@Component({
    selector: 'app-period-upload-dialog',
    templateUrl: './upload-dialog.component.html',
    styleUrls: ['./upload-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class PeriodUploadDetailDialogComponent implements OnInit, AfterViewInit, OnDestroy {
    public data;

    private filesControl = new FormControl([], [FileUploadValidators.filesLimit(1), FileUploadValidators.fileSize(FILE_CONSTANT.MAX_SIZE_XLSX)]);

    public form = new FormGroup({
        files: this.filesControl
    });
    private subscription: Subscription;
    private files: Array<File> = [];

    listBusinessUnit: any = [];
    selectBUnit = -1;

    listPattern: any = [];
    selectPattern = -1;

    listSerial: any = [];
    selectSerial = -1;
    constructor(
        private utils: UtilCommon,
        public storeTaxIncome: TaxIncomeStore,
        private _changeDetectorRef: ChangeDetectorRef,
        private _utilsCom: UtilComponent,
        @Inject(MAT_DIALOG_DATA) private _dialogData: any,
        public matDialogRef: MatDialogRef<PeriodUploadDetailDialogComponent>) {

    }
    ngAfterViewInit(): void {
        this.subscription = this.filesControl.valueChanges.subscribe(async (values: Array<File>) => {
            if (this.utils.checkISArray(values)) {
                document.getElementsByClassName('upload-input')[0]['style'].visibility = 'hidden';
                // this.files.push(values[0]);
                this.files = values;
            } else {
                this.files = [];
                document.getElementsByClassName('upload-input')[0]['style'].visibility = 'visible';
            }
        });


    }

    async ngOnInit(): Promise<void> {

        this.listBusinessUnit = await this.storeTaxIncome.getListBusinessUnitActiveForUser();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    async businessUnitChange(value): Promise<void> {
        this.selectPattern = -1;
        this.selectSerial = -1;
        this.listPattern = [];
        this.listSerial = [];
        const buId = Number(value);
        if (buId !== -1) {
            const orgInfo = this.listBusinessUnit.find(item => item.id === buId);
            // Pattern
            const response = await this.storeTaxIncome.getListPatternByBuTaxCode(orgInfo.taxcode);
            if (this.utils.checkISArray(response)) {
                this.listPattern = response;
                // Lấy giá trị đầu tiên của lsit pattern nếu list pattern = 1 và giá trị item đầu khác null
                if (this.listPattern.length === 1 && this.listPattern[0]) {
                    this.selectPattern = this.listPattern[0];
                    await this.getDefaultSerial(orgInfo.taxcode, this.selectPattern);
                }
            }
        }
    }

    async patternChange(value): Promise<void> {
        const patternId = Number(value);
        this.selectSerial = -1;
        this.listSerial = [];
        if (patternId !== -1) {
            const orgInfo = this.listBusinessUnit.find(item => item.id === this.selectBUnit);
            await this.getDefaultSerial(orgInfo.taxcode, value);
        }
    }

    async getDefaultSerial(buTaxCode, pattern): Promise<void> {
        // Serial
        const responseSerial = await this.storeTaxIncome.getListSerial(buTaxCode, pattern);
        // Lấy giá trị đầu tiên của list serial nếu list serial = 1 và giá trị item đầu khác null
        if (this.utils.checkISArray(responseSerial)) {
            this.listSerial = responseSerial;
            if (this.listSerial.length === 1 && this.listSerial[0]) {
                this.selectSerial = this.listSerial[0];
            }
        }
    }

    async upload(): Promise<any> {
        // Validate
        if (this.selectBUnit === -1) {
            return this._utilsCom.openSnackBar('Vui lòng chọn tổ chức trả thu nhập', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
        }
        if (!this.selectPattern || this.selectPattern === -1) {
            return this._utilsCom.openSnackBar('Vui lòng chọn mẫu số', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
        }
        if (!this.selectSerial || this.selectSerial === -1) {
            return this._utilsCom.openSnackBar('Vui lòng chọn ký hiệu', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
        }
        if (!this.utils.checkISArray(this.files)) {
            return this._utilsCom.openSnackBar('Vui lòng chọn file cần upload', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
        }
        if (this.files.length > 1) {
            return this._utilsCom.openSnackBar('Vui lòng chỉ upload một file', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
        }
        if (this.files[0].type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            return this._utilsCom.openSnackBar('Vui lòng chỉ upload file .xlsx ', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
        }
        //
        this.storeTaxIncome.isLoading = true;
        const uploadFile = await this.storeTaxIncome.uploadFileTemp(this.files[0]);
        let resourceDto: ResourceDtos;
        if (this.utils.checkIsNotNull(uploadFile)) {
            if (uploadFile.status === APP_CONSTANT.SUCCESS) {
                resourceDto =
                {
                    'sizeType': uploadFile.sizeType, 'aliasName': uploadFile.fileName,
                    'fileName': uploadFile.fileName,
                    'filePath': uploadFile.tempFilePath,
                    'mineType': uploadFile.mineType,
                    'refCode': null
                };
            }
        } else {
            this.storeTaxIncome.isLoading = false;
            this._utilsCom.openSnackBar(uploadFile.message, COMPONENT_CONSTANT.SNACK_BAR_ERROR);
            return;
        }
        const dataUpload: ITaxIncomeUpload = {
            buId: this.selectBUnit,
            pattern: this.selectPattern,
            serial: this.selectSerial,
            resourceDto
        };
        const res = await this.storeTaxIncome.processImportTaxincome(dataUpload);
        if (!this.utils.checkIsNotNull(res)) {
            this.storeTaxIncome.isLoading = false;
            this._utilsCom.showTranslateSnackbar('UPLOAD_TAX_INCOME_SUCCESS');
            this.matDialogRef.close(true);
        } else {
            this.storeTaxIncome.isLoading = false;
            this._utilsCom.showTranslateSnackbar('UPLOAD_TAX_INCOME_FAIL');
        }
        this._changeDetectorRef.detectChanges();
    }

    removeFiles(evt): void {
        console.log(evt);
    }

}
