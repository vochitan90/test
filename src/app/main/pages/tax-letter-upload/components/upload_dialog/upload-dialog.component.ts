import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { checkIsNotNull } from 'app/main/shared/utils/GridService';
import { FormControl } from '@angular/forms';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { FILE_CONSTANT } from 'app/main/shared/const/app.constant';
import { Subscription } from 'rxjs';
import { UtilCommon, UtilComponent } from 'app/main/shared';
import { TaxLetterUploadStore } from '../../tax-letter-upload.store';
import { ReleaseRegistrationService } from 'app/main/pages/releaseRegistration/releaseRegistration.service';

@Component({
    selector: 'app-period-upload-dialog',
    templateUrl: './upload-dialog.component.html',
    styleUrls: ['./upload-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class TaxLetterUploadDetailDialogComponent implements OnInit, AfterViewInit, OnDestroy {
    public data;
    public listBU: any[];
    private fileControl = new FormControl(null, [FileUploadValidators.filesLimit(1),
    FileUploadValidators.fileSize(FILE_CONSTANT.MAX_SIZE_OTHER), FileUploadValidators.accept(['.xlsx'])]);

    public form: FormGroup;
    private subscription: Subscription;
    public file: File = null;

    constructor(
        private utils: UtilCommon,
        public _store: TaxLetterUploadStore,
        private _changeDetectorRef: ChangeDetectorRef,
        private _utilsCom: UtilComponent,
        private _releaseRegistrationService: ReleaseRegistrationService,
        @Inject(MAT_DIALOG_DATA) private _dialogData: any,
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<TaxLetterUploadDetailDialogComponent>) {

        this.form = _formBuilder.group({
            organizationPayingIncome: ['', Validators.compose([Validators.required])],
            file: this.fileControl,
        });

    }
    ngAfterViewInit(): void {
        const me = this;
        this.subscription = this.fileControl.valueChanges.subscribe(async (value: File) => {
            this.file = value[0];
            this._changeDetectorRef.detectChanges();
        });
    }

    async getValueForForm(): Promise<void> {
        // Get BusinessUnit for dropdown
        this.listBU = await this._releaseRegistrationService.getListBusinessUnitActiveForUser();
        this.form.get("organizationPayingIncome").setValue(this.listBU[0]);

    }

    async ngOnInit(): Promise<void> {
        try {
            this.getValueForForm();
        } catch (err: any) {
            this._store.isLoading = false;
        }
    }

    async upload() {
        if (!this.file) {
            return this._utilsCom.openSnackBar('Vui lòng chọn tập tin');
        }
        const buId = this.form.get("organizationPayingIncome").value.id;
        const uploadFile = await this._store.uploadTemplate(this.file, buId);
        if (checkIsNotNull(uploadFile)) {
            this.matDialogRef.close(true);
            return;
        }
        this._utilsCom.openSnackBar('Tải thất bại', 'error');
        this._changeDetectorRef.detectChanges();
    }

    removeFiles(evt) {
        console.log(evt);
    }

    ngOnDestroy(): void {
        this._store.isLoading = false;
        this.subscription.unsubscribe();
    }

}
