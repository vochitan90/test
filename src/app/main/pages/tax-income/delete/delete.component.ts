import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { APP_CONSTANT, COMPONENT_CONSTANT, FILE_CONSTANT } from 'app/main/shared/const/app.constant';
import { UtilCommon } from 'app/main/shared/utils/UtilCommon';
import { UtilComponent } from 'app/main/shared/utils/UtilComponent';
import { Subscription } from 'rxjs';
import { ITaxIncomeCancel, ResourceDtos } from '../models/taxIncome.interface';
import { TaxIncomeStore } from '../taxIncome.store';
@Component({
    selector: 'app-delete',
    templateUrl: './delete.component.html',
    styleUrls: ['./delete.component.scss']
})
export class DeleteTaxIncomeComponent implements OnInit, AfterViewInit {
    private filesControl = new FormControl([],
        [
            FileUploadValidators.filesLimit(1),
            FileUploadValidators.fileSize(FILE_CONSTANT.MAX_SIZE_XLSX),
            FileUploadValidators.sizeRange({ minSize: 20, maxSize: 10000 })
        ]);
    private files: Array<File> = [];
    private subscription: Subscription;

    form = new FormGroup({
        files: this.filesControl
    });

    constructor(
        public store: TaxIncomeStore,
        public matDialogRef: MatDialogRef<DeleteTaxIncomeComponent>,
        private _formBuilder: FormBuilder,
        public utils: UtilCommon,
        public _utilComponent: UtilComponent,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {
        this.form = _formBuilder.group({
            'note': ['', Validators.compose([Validators.required])],
            files: this.filesControl
        });
    }

    async ngOnInit(): Promise<void> {
        if (this._data) {
            // this.store.isLoading = true;
            // this.taxincome = await this.store.getByAggid(this._data.aggId);
            // this.store.isLoading = false;
        }
    }

    async ngAfterViewInit(): Promise<void> {
        this.subscription = this.filesControl.valueChanges.subscribe(async (values: Array<File>) => {
            if (this.utils.checkISArray(values)) {
                document.getElementsByClassName('upload-input')[0]['style'].visibility = 'hidden';
                // this.files.push(values[0]);
                this.files = values;
            } else {
                document.getElementsByClassName('upload-input')[0]['style'].visibility = 'visible';
                this.files = [];
            }
        });
    }

    async cancel(): Promise<void> {
        if (!this.validate()) {
            return;
        }
        let resourceDto: ResourceDtos;
        if (!this.utils.checkIsString(this.files[0])) {
            const dataFile = await this.store.uploadFileTemp(this.files[0]);
            if (this.utils.checkIsNotNull(dataFile)) {
                if (dataFile.status === APP_CONSTANT.SUCCESS) {
                    resourceDto =
                    {
                        'sizeType': dataFile.sizeType, 'aliasName': dataFile.fileName,
                        'fileName': dataFile.fileName,
                        'filePath': dataFile.tempFilePath,
                        'mineType': dataFile.mineType,
                        'refCode': null
                    };
                }
            } else {
                this._utilComponent.openSnackBar(dataFile.message, COMPONENT_CONSTANT.SNACK_BAR_ERROR);
                return;
            }
        }
        const data: ITaxIncomeCancel = {
            id: this._data.id,
            note: this.form.get('note').value.trim(),
            resourceDto
        };
        const res = await this.store.cancel(data);
        if (!this.utils.checkIsNotNull(res)) {
            this._utilComponent.showTranslateSnackbar('CANCEL_TAX_INCOME_SUCCESS');
            this.matDialogRef.close(true);
        } else {
            this._utilComponent.showTranslateSnackbar('CANCEL_TAX_INCOME_FAIL', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
        }
    }

    validate(): boolean {
        if (!this.form.get('note').value || this.form.get('note').value.trim().length === 0) {
            this._utilComponent.openSnackBar('Vui lòng nhập ghi chú', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
            return false;
        }
        if (!this.utils.checkISArray(this.files)) {
            this._utilComponent.openSnackBar('Vui lòng đính kèm biên bản hủy', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
            return false;
        }
        if (this.files.length > 1) {
            this._utilComponent.openSnackBar('Vui lòng chỉ đính kèm một biên bản hủy', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
            return false;
        }
        return true;
    }
}
