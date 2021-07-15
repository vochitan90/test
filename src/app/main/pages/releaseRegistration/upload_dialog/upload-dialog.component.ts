import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { checkIsNotNull } from 'app/main/shared/utils/GridService';
import { FormControl } from '@angular/forms';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { FILE_CONSTANT } from 'app/main/shared/const/app.constant';
import { Subscription } from 'rxjs';
import { UtilCommon, UtilComponent } from 'app/main/shared';
import { ReleaseRegistrationStore } from '../releaseRegistration.store';
import { Validators } from '@angular/forms';

@Component({
    selector: 'app-period-upload-dialog',
    templateUrl: './upload-dialog.component.html',
    styleUrls: ['./upload-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class CancelUploadDialogComponent implements OnInit, AfterViewInit, OnDestroy {
    public data;
    public listBU: any[];
    private filesControl = new FormControl([], [FileUploadValidators.filesLimit(1), FileUploadValidators.fileSize(FILE_CONSTANT.MAX_SIZE_XLSX)]);
    public form: FormGroup;
    
    private subscription: Subscription;
    private files: Array<File> = [];
    constructor(
        private utils: UtilCommon,
        public store: ReleaseRegistrationStore,
        private _changeDetectorRef: ChangeDetectorRef,
        private _utilsCom: UtilComponent,
        @Inject(MAT_DIALOG_DATA) private _dialogData: any,
        private _formBuilder: FormBuilder,
        public matDialogRef: MatDialogRef<CancelUploadDialogComponent>) {

            this.form = _formBuilder.group({
                organizationPayingIncome: ['', Validators.compose([Validators.required])],
                files: this.filesControl,
                //note: ['', Validators.compose([Validators.required])],
            });
       
    }
    ngAfterViewInit(): void {
        const me = this;
        this.subscription = this.filesControl.valueChanges.subscribe(async (values: Array<File>) => {
            if(this.utils.checkISArray(values)){
                this.files.push(values[0]);
            }else{
                this.files = [];
            }
        });


    }

    async ngOnInit(): Promise<void> {
        
    }

    // async upload() {

    //     try {
    //         if(this.form.valid){
    //             if(!this.utils.checkISArray(this.files)){
    //                 return this._utilsCom.openSnackBar('Vui lòng chọn tập tin');
    //             }
    //             const uploadFile = await this.store.uploadTemplate(this.files[0]);
    //             if(checkIsNotNull(uploadFile)){
    //                 this.matDialogRef.close(true);
    //                 return;
    //             }
    //             this._utilsCom.openSnackBar('Tải thất bại','error');
    //             this._changeDetectorRef.detectChanges();
    //         }
            
    //     } catch (error) {
            
    //     }
    // }

    removeFiles(evt){
        console.log(evt);
    }

    ngOnDestroy(): void {
        this.store.isLoading = false;
        this._changeDetectorRef.detectChanges();
        this.subscription.unsubscribe();
    }

}
