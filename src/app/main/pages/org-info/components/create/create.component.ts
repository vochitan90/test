import { ORG_INFO_CONSTANT } from './../../org-info.constant';
import { IOrgInfo } from '../../models/org-info.interface';
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
import { ACTION, AUTH_STATUS_CONSTANT, COMPONENT_CONSTANT, FILE_CONSTANT } from 'app/main/shared/const/app.constant';
import { from, Subscription } from 'rxjs';
import { UtilCommon, UtilComponent } from 'app/main/shared';

import { Validators } from '@angular/forms';
import { OrgInfoService } from '../../org-info.service';
import { OrgInfoStore } from '../../org-info.store';
// import { getUsbToken, healthcheck } from 'lcs-usbtoken';

import * as client from 'lcs-usbtoken';


@Component({
    selector: 'app-create-org-info',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class CreateOrgInfoComponent implements OnInit {
    public data: IOrgInfo;
    public action;
    public dataTemp;
    public isSended;
    public fileName;
    private filesControl = new FormControl([], [FileUploadValidators.filesLimit(1), FileUploadValidators.fileSize(FILE_CONSTANT.MAX_SIZE_XLSX), FileUploadValidators.sizeRange({ minSize: 20, maxSize: 10000 })]);

    provinces: [];
    districts: [];
    wards: [];

    public codePattern = "^[A-Za-z0-9]+$";
    public phonePattern = "^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$";
    public taxCodePattern = "^(([0-9]{10}-[0-9]{3})|([0-9]{10}))$"; // https://stackoverflow.com/questions/23536133/how-do-you-match-multiple-regex-patterns-for-a-single-line-of-text-in-java

    public form = new FormGroup({
        files: this.filesControl
    });
    private subscription: Subscription;
    private files: Array<any> = [];
    public lstTypeTemplate = [];
    minDate: Date = new Date();
    constructor(
        private _orgInfoService: OrgInfoService,
        private utils: UtilCommon,
        public store: OrgInfoStore,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _utilComponent: UtilComponent) {

            this.form = _formBuilder.group({
                'organizationPayingIncome': ['', Validators.compose([Validators.required])],
                'code': ['', Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern(this.codePattern)])],
                'taxCode': ['', Validators.compose([Validators.required, Validators.pattern(this.taxCodePattern)])],
                'phoneNumberOrganization': ['', Validators.compose([Validators.required])],
                'contactEmail': ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])],
                'business': ['', Validators.compose([Validators.required])],
                'address': ['', Validators.compose([Validators.required])],
                'cityProvince': ['', Validators.compose([Validators.required])],
                'countyDistrictTown': ['', Validators.compose([Validators.required])],
                'wards': ['', Validators.compose([Validators.required])],
                'legalRepresentativeName': ['', Validators.compose([Validators.required])],
                'phoneNumberRepresentative': ['', Validators.compose([Validators.required])],
                'addressRepresentative': ['', Validators.compose([Validators.required])],

            });
    }

    async getDistrict(event): Promise<void>{
        try{
            const res = await this._orgInfoService.getDictricts({"provinceId": event.value.id});
            this.districts = res.data;
            this.form.controls['countyDistrictTown'].setValue(res.data[0]);

        } catch (error) {
        } finally {
            var districtId = this.form.get('countyDistrictTown').value.id;
            const res = await this._orgInfoService.getWards({"districtId": districtId});
            this.wards = res.data;
            this.form.controls['wards'].setValue(res.data[0]);
            this._changeDetectorRef.detectChanges();
        }
    }

    async getWards(event): Promise<void>{
        try{
            const res = await this._orgInfoService.getWards({"districtId": event.value.id});
            this.wards = res.data;
            this.form.controls['wards'].setValue(res.data[0]);

        } catch (error) {
        } finally {
            this._changeDetectorRef.detectChanges();
        }
    }

    async ngOnInit(): Promise<void> {
        try {
            this.provinces = await this._orgInfoService.getProvince();
            console.log(this.provinces);
            
        } catch (err: any) {
            this.store.isLoading = false;
        }
    }

    checkValidationBeforeSave(res){
        if(res.code === "VALIDATION.CODE_IS_EXIST"){
            this._utilComponent.showTranslateSnackbar('Mã code đã tồn tại, vui lòng chọn mã khác!', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
            return false;
        }
        if(res.code === "VALIDATION.TAX_CODE_IS_EXIST"){
            this._utilComponent.showTranslateSnackbar('Mã số thuế đã tồn tại, vui lòng chọn mã khác!', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
            return false;
        }   
        return true;
    }

    save(): void {
        try {
            if(this.form.valid){
                const formData = this.form.getRawValue();
                this._orgInfoService.createOrgInfo(formData).then((res: any) => {
                    if(res){
                        this.checkValidationBeforeSave(res);
                    }else{
                        this._utilComponent.showTranslateSnackbar("Thêm thông tin thành công!");
                        this.utils.routingBackPage(ORG_INFO_CONSTANT.LINK.LIST);
                    }
                    this.store.isLoading = false;
                    this._changeDetectorRef.detectChanges();
                })
            }    
        } catch (error) {
            this._utilComponent.showTranslateSnackbar('SAVE_FAIL', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
        } finally {
            
        }      
    }

    close(): void {
        this.utils.routingBackPage(ORG_INFO_CONSTANT.LINK.LIST);
    }

    ngOnDestroy(): void {
        this.store.isLoading = false;
    }

}
