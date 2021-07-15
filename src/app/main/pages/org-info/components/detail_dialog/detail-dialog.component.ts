import { action } from 'mobx';
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
import { FormControl } from '@angular/forms';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { ACTION, COMPONENT_CONSTANT, FILE_CONSTANT } from 'app/main/shared/const/app.constant';
import { Subscription } from 'rxjs';
import { UtilCommon, UtilComponent } from 'app/main/shared';
import { Validators } from '@angular/forms';
import { OrgInfoService } from '../../org-info.service';
import { OrgInfoStore } from '../../org-info.store';
import { ORG_INFO_CONSTANT } from '../../org-info.constant';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { checkIsNotNull } from 'app/main/shared/utils/GridService';


@Component({
    selector: 'app-org-info-detail-dialog',
    templateUrl: './detail-dialog.component.html',
    styleUrls: ['./detail-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class DetailOrgInfoDialogComponent implements OnInit, AfterViewInit {

    isUpdateAction: boolean = false;
    public data: any;

    provinces: [];
    districts: [];
    wards: [];

    isLoading: boolean = true;

    public form: FormGroup;
    constructor(
        public store: OrgInfoStore,
        private _orgInfoService: OrgInfoService,
        public matDialogRef: MatDialogRef<DetailOrgInfoDialogComponent>,
        public orgInfoService: OrgInfoService,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private _dialogData: any,
        private _utils: UtilCommon,
        private _utilComponent: UtilComponent,
        private _formBuilder: FormBuilder
    ) {
        this.form = _formBuilder.group({
            'organizationPayingIncome': ['', Validators.compose([Validators.required])],
            'code': ['', Validators.compose([Validators.required])],
            'taxCode': ['', Validators.compose([Validators.required])],
            'phoneNumberOrganization': ['', Validators.compose([Validators.required])],
            'contactEmail': ['', Validators.compose([Validators.required])],
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

    compareProvinces(object1: any, object2: any) {
        return object1 && object2 && object1.id == object2.id;
    }

    compareDistricts(object1: any, object2: any) {
        return object1 && object2 && object1.id == object2.id;
    }

    compareWards(object1: any, object2: any) {
        return object1 && object2 && object1.id == object2.id;
    }

    async ngAfterViewInit(): Promise<void> {
        try {
            if (this._utils.checkIsNotNull(this._dialogData.data)) {

                //this.data = this._dialogData.data;

                // Call api to get detail businessUnitDetail
                let res = await this.orgInfoService.getBusinessUnitDetail(this._dialogData.data.id);
                this.data = res;
                // Provinces
                this.provinces = await this._orgInfoService.getProvince();
                this.form.controls['cityProvince'].setValue(res.data.provinceDto);
                // Districts
                let disTemp = await this._orgInfoService.getDictricts({ "provinceId": res.data.provinceDto.id });
                this.districts = disTemp.data;
                this.form.controls['countyDistrictTown'].setValue(res.data.districtDto);
                // Wards
                let wardTemp = await this._orgInfoService.getWards({"districtId": res.data.districtDto.id });
                this.wards = wardTemp.data;
                this.form.controls['wards'].setValue(res.data.wardDto);

                this.form.controls['organizationPayingIncome'].setValue(res.data.name);
                this.form.controls['code'].setValue(res.data.code);
                this.form.controls['taxCode'].setValue(res.data.taxcode);
                this.form.controls['phoneNumberOrganization'].setValue(res.data.contactPhone);
                this.form.controls['contactEmail'].setValue(res.data.contactEmail);
                this.form.controls['business'].setValue(res.data.majorInfo);     
                this.form.controls['address'].setValue(res.data.pltbAddress.streetNumber);
                
                // Representative part
                this.form.controls['legalRepresentativeName'].setValue(res.data.representativeName);                  
                this.form.controls['phoneNumberRepresentative'].setValue(res.data.representativePhone);    
                this.form.controls['addressRepresentative'].setValue(res.data.representativeAddress);

                if (this._dialogData.action == ACTION.VIEW) {
                    this.form.disable();
                } else {
                    this.isUpdateAction = true;
                    //this.form.controls['code'].disable();
                }
                // this.dataTemp = {
                //     effectiveDate: this._utils.formatDatePattern(this.data.effectiveDate)
                // }
                return;

            }


        } catch (err: any) {
            // this.loading = false;
        } finally {
            this._changeDetectorRef.detectChanges();

        };
    }

    async ngOnInit(): Promise<void> {
    }

    async getDistrict(event): Promise<void> {
        try {
            const res = await this._orgInfoService.getDictricts({ "provinceId": event.value.id });
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

    async getWards(event): Promise<void> {
        try {
            const res = await this._orgInfoService.getWards({ "districtId": event.value.id });
            this.wards = res.data;
            this.form.controls['wards'].setValue(res.data[0]);

        } catch (error) {
        } finally {
            this._changeDetectorRef.detectChanges();
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
                this.store.setLoading(true);
                this._orgInfoService.updateOrgInfo(this.form.getRawValue(), this._dialogData.data.id, this.data.data.pltbAddress.id).then((res: any) => {
                    if(res){
                        this.store.setLoading(false);
                        this._changeDetectorRef.detectChanges();
                        this.checkValidationBeforeSave(res);    
                    }else{
                        this.isLoading = false;
                        this.store.setLoading(false);
                        this._utilComponent.showTranslateSnackbar("Cập nhật thông tin thành công!");
                        this._changeDetectorRef.detectChanges();
                        this.matDialogRef.close(true); 
                        this._utils.routingBackPage(ORG_INFO_CONSTANT.LINK.LIST);
                    }                   
                })
            }
        } catch (error) {
            this._utilComponent.showTranslateSnackbar('SAVE_FAIL', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
        }
    }

    close(){
        this.matDialogRef.close()
    }
}
