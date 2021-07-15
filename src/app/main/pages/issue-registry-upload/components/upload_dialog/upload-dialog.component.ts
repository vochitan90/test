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
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { checkIsNotNull } from 'app/main/shared/utils/GridService';
import { FormControl } from '@angular/forms';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { FILE_CONSTANT } from 'app/main/shared/const/app.constant';
import { Subscription } from 'rxjs';
import { UtilCommon, UtilComponent } from 'app/main/shared';
import { ReleaseRegistrationService } from 'app/main/pages/releaseRegistration/releaseRegistration.service';
import { IssueRegistryUploadStore } from '../../issue-registry-upload.store';
import { IssueRegistryUploadService } from '../../issue-registry-upload.service';
import { ResourceDtos } from '../../models/content.interface';
import { RELEASE_REGISTRATION_CONSTANT } from 'app/main/pages/releaseRegistration/releaseRegistration.constant';
import { IframeViewComponent } from '../iframe-view/iframe-view.component';

@Component({
    selector: 'app-period-upload-dialog',
    templateUrl: './upload-dialog.component.html',
    styleUrls: ['./upload-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class IssueRegistryUploadDetailDialogComponent implements OnInit, AfterViewInit, OnDestroy {
    public data;
    public listBU: any[];
    public listTaxPlace: any[];
    public listIssueRegistryByBu: any[];

    fileSignedName: string = '';


    private _viewPdfDialogRef1: MatDialogRef<IframeViewComponent>;

    //private filesControl1 = new FormControl([], [FileUploadValidators.filesLimit(1), FileUploadValidators.fileSize(FILE_CONSTANT.MAX_SIZE_OTHER)]);
    private filesControl2 = new FormControl([], [FileUploadValidators.filesLimit(1), FileUploadValidators.fileSize(FILE_CONSTANT.MAX_SIZE_OTHER)]);
    private filesControl3 = new FormControl([], [FileUploadValidators.filesLimit(1), FileUploadValidators.fileSize(FILE_CONSTANT.MAX_SIZE_OTHER)]);

    public form: FormGroup;
    private subscription1: Subscription;
    private subscription2: Subscription;
    private subscription3: Subscription;
    private files: Array<File> = [];

    allowUpload: true;

    resourceDtos: ResourceDtos[] = [];
    resourceDtos1: ResourceDtos = {};
    resourceDtos2: ResourceDtos[] = [];
    resourceDtos3: ResourceDtos[] = [];

    status: string = 'upload';

    aggId = '';

    constructor(
        private utils: UtilCommon,
        public _store: IssueRegistryUploadStore,
        private _changeDetectorRef: ChangeDetectorRef,
        private _utilsCom: UtilComponent,
        private _issueRegistryUploadService: IssueRegistryUploadService,
        @Inject(MAT_DIALOG_DATA) private _dialogData: any,
        private _formBuilder: FormBuilder,
        public _matDialog: MatDialog,
        public matDialogRef: MatDialogRef<IssueRegistryUploadDetailDialogComponent>
    ) {

        this.form = _formBuilder.group({
            organizationPayingIncome: ['', Validators.compose([Validators.required])],
            issusRegistryActiveByBu: [null, Validators.compose([Validators.required])],
            taxPlace: ['', Validators.compose([Validators.required])],
            //files1: this.filesControl1,
            files2: this.filesControl2,
            files3: this.filesControl3
        });

    }
    ngAfterViewInit(): void {
        const me = this;

        // this.form.get("issusRegistryActiveByBu").valueChanges.subscribe(res => {
        //     console.log(res);

        //     if (res) {
        //         const currentItem = this.listTaxPlace.filter(x => x.code === res.taxPlace);
        //         this.form.get("taxPlace").setValue(currentItem[0]);
        //         this._changeDetectorRef.detectChanges();
        //     }

        // })


        // this.subscription1 = this.filesControl1.valueChanges.subscribe(async (values: Array<File>) => {

        //     this.resourceDtos1 = [];

        //     //const oldValueLength = this.form.value['files1'].length;
        //     if (this.utils.checkISArray(values)) {

        //         console.log(values);
        //         const lastFile: any = values[values.length - 1];
        //         const dataFile = await this._store.uploadFileTemp(lastFile);
        //         if (dataFile.status === "SUCCESS") {
        //             this.resourceDtos1.push(
        //                 {
        //                     "sizeType": null,
        //                     "aliasName": dataFile.fileName,
        //                     "fileName": dataFile.fileName,
        //                     "filePath": dataFile.tempFilePath,
        //                     "mineType": null,
        //                     "storageType": "system",
        //                     "refCode": null
        //                 }
        //             );
        //         }

        //     } else {
        //         this.files = [];
        //     }


        // });

        this.subscription2 = this.filesControl2.valueChanges.subscribe(async (values: Array<File>) => {

            const oldValueLength = this.form.value['files2'].length;
            if (values.length > oldValueLength && this.utils.checkISArray(values)) {

                console.log(values);
                const lastFile: any = values[values.length - 1];
                const dataFile = await this._store.uploadFileTemp(lastFile);
                if (dataFile.status === "SUCCESS") {
                    this.resourceDtos2.push(
                        {
                            "sizeType": null,
                            "aliasName": dataFile.fileName,
                            "fileName": dataFile.fileName,
                            "filePath": dataFile.tempFilePath,
                            "mineType": null,
                            "storageType": "system",
                            "refCode": null
                        }
                    );
                }
            } else {
                this.files = [];
            }
        });

        this.subscription3 = this.filesControl3.valueChanges.subscribe(async (values: Array<File>) => {

            const oldValueLength = this.form.value['files3'].length;
            if (values.length > oldValueLength && this.utils.checkISArray(values)) {

                console.log(values);
                const lastFile: any = values[values.length - 1];
                const dataFile = await this._store.uploadFileTemp(lastFile);
                if (dataFile.status === "SUCCESS") {
                    this.resourceDtos3.push(
                        {
                            "sizeType": null,
                            "aliasName": dataFile.fileName,
                            "fileName": dataFile.fileName,
                            "filePath": dataFile.tempFilePath,
                            "mineType": null,
                            "storageType": "system",
                            "refCode": null
                        }
                    );
                }
            } else {
                this.files = [];
            }
        });
    }

    /**
     * format bytes
    * @param bytes (File size in bytes)
    * @param decimals (Decimals point)
    */
    formatBytes(bytes, decimals): any {
        if (bytes === 0) {
            return '';
        }
        const k = 1024;
        const dm = decimals <= 0 ? 0 : decimals || 2;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return '(' + parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i] + ')';
    }

    removeFile1(control, file, index): void {
        ////this.resourceDtos1.splice(index, 1);
        //control.removeFile(file);
    }

    removeFile2(control, file, index): void {
        this.resourceDtos2.splice(index, 1);
        control.removeFile(file);
    }

    removeFile3(control, file, index): void {
        this.resourceDtos3.splice(index, 1);
        control.removeFile(file);
    }

    getValueForForm(): void {
        // Get BusinessUnit for dropdown
        this._issueRegistryUploadService.getListBusinessUnitActiveForUser().then(res1 => {
            if (this.utils.checkISArray(res1)) {
                this.listBU = res1;
                this.form.get("organizationPayingIncome").setValue(-1);

                // // Get Issue Registry Active By BU
                // this._issueRegistryUploadService.getIssueRegistryActiveByBu(this.listBU[0].id).then(res2 => {
                //     this.listIssueRegistryByBu = res2;
                //     this.form.get("issusRegistryActiveByBu").setValue(this.listIssueRegistryByBu[0]);

                //     // Get Tax Place for dropdown
                //     this._issueRegistryUploadService.getListTaxPlace().then(res3 => {
                //         this.listTaxPlace = res3;

                //         // Set taxPlace for dd2
                //         const taxPlace = this.form.get("issusRegistryActiveByBu").value.taxPlace;
                //         const currentItem = this.listTaxPlace.filter(x => x.code === taxPlace);
                //         this.form.get("taxPlace").setValue(currentItem[0]);

                //         // Continue to get file signed name
                //         const fileName = this.form.get("issusRegistryActiveByBu").value.fileName;
                //         this.fileSignedName = fileName;
                //         this._changeDetectorRef.detectChanges();
                //     });
                // });
            }
        });

        this._changeDetectorRef.detectChanges();
    }

    onChangeGetIssusRegistryActiveByBu(event) {
        // Get Issue Registry Active By BU
        this._issueRegistryUploadService.getIssueRegistryActiveByBu(event.value.id).then(res => {
            this.listIssueRegistryByBu = res;
            if (res.length > 0) {

                this.form.get("issusRegistryActiveByBu").setValue(this.listIssueRegistryByBu[0]);

                // Get dd3
                const dd2 = this.form.get("issusRegistryActiveByBu");
                const currentdd2 = dd2.value;
                if (currentdd2) {

                    this._issueRegistryUploadService.getListTaxPlace().then(res3 => {

                        this.listTaxPlace = res3;
                        const currentItem = this.listTaxPlace.filter(x => x.code === currentdd2.taxPlace);
                        this.form.get("taxPlace").setValue(currentItem[0]);

                    })

                    // Filename
                    this.fileSignedName = dd2.value.fileName;
                    this.aggId = dd2.value.aggId;
                    this._changeDetectorRef.detectChanges();
                }


            } else {

                const dd2 = this.form.get("issusRegistryActiveByBu");
                const dd3 = this.form.get("taxPlace");
                dd2.setValue(null);
                dd3.setValue(null);
                this.fileSignedName = 'Chưa có tài liệu!';
                // REF: https://loiane.com/2017/08/angular-reactive-forms-trigger-validation-on-submit/
                dd2.markAsTouched({ onlySelf: true });
                this._changeDetectorRef.detectChanges();
            }
        });
    }


    getTaxAndFileSigned(event) {
        if (event.value) {

            // get for dd3
            const currentItem = this.listTaxPlace.filter(x => x.code === event.value.taxPlace);
            this.form.get("taxPlace").setValue(currentItem[0]);

            // get file signed info
            console.log(event.value);
            this.fileSignedName = event.value.fileName;
            this._changeDetectorRef.detectChanges();

        }
    }

    ngOnInit(): void {
        try {
            this.getValueForForm();
        } catch (err: any) {
            this._store.isLoading = false;
        }
    }

    async upload() {
        if (this.form.valid) {
            this._changeDetectorRef.detectChanges();
            //this.resourceDtos = this.resourceDtos1.concat(this.resourceDtos2).concat(this.resourceDtos3);
            // Get current value of dd2
            const currentItemDD2 = this.form.get('issusRegistryActiveByBu').value;
            const currentItemDD3 = this.form.get('taxPlace').value;

            this.resourceDtos1 = {
                sizeType: currentItemDD2.sizeType,
                aliasName: currentItemDD2.aliasName,
                fileName: currentItemDD2.fileName,
                filePath: currentItemDD2.filePath,
                mineType: currentItemDD2.mineType,
                refCode: currentItemDD2.refCode,
            }

            const uploadFile = await this._store.uploadTemplate(currentItemDD2, currentItemDD3, this.resourceDtos1, this.resourceDtos2, this.resourceDtos3);
            if (checkIsNotNull(uploadFile)) {
                this.matDialogRef.close(true);
                return;
            }
            //this._utilsCom.openSnackBar('Tải thất bại', 'error');
            //this._changeDetectorRef.detectChanges();

            console.log(this.resourceDtos);
        } else {
            this.form.markAsTouched();
            this._utilsCom.openSnackBar('Tải thất bại, vui lòng xem lại các field!', 'error');
            this._changeDetectorRef.detectChanges();
        }

        // if (!this.utils.checkISArray(this.files)) {
        //     return this._utilsCom.openSnackBar('Vui lòng chọn tập tin');
        // }
        // const buId = this.form.get("organizationPayingIncome").value.id;
        // const uploadFile = await this._store.uploadTemplate(this.files[0], buId);
        // if (checkIsNotNull(uploadFile)) {
        //     this.matDialogRef.close(true);
        //     return;
        // }
        // this._utilsCom.openSnackBar('Tải thất bại', 'error');
        // this._changeDetectorRef.detectChanges();
    }

    async downloadResource(item): Promise<void> {
        try {
            this._store.isLoading = true;
            // IF file doc
            if (this.utils.getExtensionFileDoc(item.name)) {
                const { response, ext } = await this._store.downloadResource(item.id, true);
                if (this.utils.checkIsNotNull(response) && this.utils.checkIsNotNull(ext)) {
                    this.utils.downloadFile(item.name, response);
                } else {
                    this._utilsCom.openSnackBar('Không thể tải tập tin ', 'error');
                }
            } else {// Other
                const response = await this._store.downloadResource(item.id, false);
                if (this.utils.checkIsNotNull(response)) {
                    this.utils.downloadFile(item.name, response);
                } else {
                    this._utilsCom.openSnackBar('Không thể tải tập tin ', 'error');
                }
            }

            this._store.isLoading = false;
        } catch (error) {
            this._store.isLoading = false;
        }
    }

    removeFiles(evt) {
        console.log(evt);
    }

    viewFile() {
        try {
            this._viewPdfDialogRef1 = this._matDialog.open(IframeViewComponent, {
                //panelClass: 'custom-dialog',
                data: {
                    previewPdf: `${RELEASE_REGISTRATION_CONSTANT.API.PREVIEW_FILE}aggId=${this.aggId}`,
                },
                //id: 'iframeViewPdf1',
                disableClose: false,
                width: '100%',

            });
            this._viewPdfDialogRef1.afterClosed().subscribe((isSuccess: boolean) => {
                if (isSuccess) {
                    //this.gridOptions.api.refreshServerSideStore({ purge: true });
                }
            });

        } catch (error) {
            console.log(error);
        }
    }

    ngOnDestroy(): void {
        this._store.isLoading = false;
        //this.subscription1.unsubscribe();
        this.subscription2.unsubscribe();
        this.subscription3.unsubscribe();
    }

}
