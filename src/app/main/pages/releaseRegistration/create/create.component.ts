import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilCommon, UtilComponent } from 'app/main/shared';
import { mergeFormWithData } from 'app/main/shared/utils/FunctionUtils';
import { RELEASE_REGISTRATION_CONSTANT } from '../releaseRegistration.constant';
import { ReleaseRegistrationService } from '../releaseRegistration.service';
import { ReleaseRegistrationStore } from '../releaseRegistration.store';

@Component({
    selector: 'app-create-release-registration',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class CreateReleaseRegistrationComponent implements OnInit, OnDestroy {

    // List org
    public listBU: any[];
    public businessUnitDetail: any;
    public listTaxPlace: any[];

    listOfYears: any[];
    listIssueAmount: any[];
    public amountOfYear = 5;
    public data;
    minDate: Date = new Date();

    listOfSkill = [
        {
            skill: '1',
            exp: '2',
        }, {
            skill: '4',
            exp: '5'
        }
    ]

    public form: FormGroup;
    constructor(
        private _releaseRegistrationService: ReleaseRegistrationService,
        private _utils: UtilCommon,
        public _store: ReleaseRegistrationStore,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private utils: UtilCommon,
        private _utilsCom: UtilComponent) {

        var phonePattern = "^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$";
        var serialPattern = "^[A,B,C,D,E,G,H,K,L,M,N,P,Q,R,S,T,U,V,X,Y]{2}$";


        this.form = _formBuilder.group({

            // Thông tin đơn vị phát hành
            'organizationPayingIncome': [''],
            'taxcode': [''],
            'contactPhone': [''],
            'majorInfo': [''],
            'address': [''],
            'cityProvince': [''],
            'countyDistrictTown': [''],
            'wards': [''],
            'representativeName': [''],
            'representativePhone': [''],
            'representativeAddress': [''],

            // Thông tin chứng từ phát hành
            'pattern': ['CTT56', Validators.compose([Validators.required])],
            'decisionNo': ['', Validators.compose([Validators.required])],
            'taxPlace': ['', Validators.compose([Validators.required])],
            'serial': ['', Validators.compose([Validators.required, Validators.pattern(serialPattern)])],
            'issueYear': ['', Validators.compose([Validators.required])],
            'issueAmount': ['', Validators.compose([Validators.required])],
            'issueFrom': ['', Validators.compose([Validators.required])],
            //skills: _formBuilder.array([]),
        });

        // let skillsControl = <FormArray>this.form.controls.skills;

        // this.listOfSkill.forEach(skills => {
        //     //skillsControl.push(this._formBuilder.group({ skill: skills.skill, exp: skills.exp }))
        //     skillsControl.push(this.newSkillWithParam(skills.skill, skills.exp));
        // })

    }

    get skills(): FormArray {
        return this.form.get("skills") as FormArray;
    }

    newSkillWithParam(skill, exp): FormGroup {
        return this._formBuilder.group({
            skill: [skill, Validators.required],
            exp: [exp, Validators.required],
        })
    }

    newSkill(): FormGroup {
        return this._formBuilder.group({
            skill: ['', Validators.required],
            exp: ['', Validators.required],
        })
    }

    addSkills() {
        this.skills.push(this.newSkill());
    }

    removeSkill(i: number) {
        this.skills.removeAt(i);
    }

    async settingUpValue(itemId) {

        this.businessUnitDetail = await this._releaseRegistrationService.getBusinessUnitDetail(itemId);
        mergeFormWithData(this.businessUnitDetail.data, this.form);

        // // Địa chỉ
        this.form.get("address").setValue(this.businessUnitDetail.data.pltbAddress?.streetNumber);

        // Province
        this.form.get("cityProvince").setValue(this.businessUnitDetail.data.provinceDto?.name);

        // District
        this.form.get("countyDistrictTown").setValue(this.businessUnitDetail.data.districtDto?.name);

        // Ward
        this.form.get("wards").setValue(this.businessUnitDetail?.data.wardDto?.name);

        // Build list of year
        // this.listOfYears = this._releaseRegistrationService.createListOfYears(new Date().getFullYear(), this.amountOfYear);
        // this.form.get("issueYear").setValue(this.listOfYears[2]);

        // Load tax place
        // this.listTaxPlace = await this._releaseRegistrationService.getListTaxPlace();
        // this.form.get("taxPlace").setValue(this.listTaxPlace[0]);
        this._changeDetectorRef.detectChanges();
    }

    async getValueForForm(): Promise<void> {
        // Get BusinessUnit for dropdown
        const res = await this._releaseRegistrationService.getListBusinessUnitActiveForUser();
        if (this.utils.checkISArray(res)) {
            this.listBU = res;
            this.form.get("organizationPayingIncome").setValue(-1);

            // Build list of year
            this.listOfYears = this._releaseRegistrationService.createListOfYears(new Date().getFullYear(), this.amountOfYear);
            this.form.get("issueYear").setValue(this.listOfYears[2]);

            //Load tax place
            this.listTaxPlace = await this._releaseRegistrationService.getListTaxPlace();
            this.form.get("taxPlace").setValue(this.listTaxPlace[0]);

            //Load issue amount
            this.listIssueAmount = await this._releaseRegistrationService.getIssueAmount();
            this.form.get("issueAmount").setValue(this.listIssueAmount[0]);

            this._changeDetectorRef.detectChanges();

            // Continue to load value for orther form from item in list BU
            //const itemId = this.form.get("organizationPayingIncome").value.id;       
            //this.settingUpValue(itemId);
        }
    }

    async ngOnInit(): Promise<void> {
        try {
            this.getValueForForm();
        } catch (err: any) {
            this._store.isLoading = false;
        }
    }

    async save(event): Promise<void> {
        try {
            const form = this.form;
            if (!this._utilsCom.checkValidateFormWithSpecificForm(form)) {
                return;
            }

            const buId = this.form.get('organizationPayingIncome').value.id;
            const pattern = this._utils.getValueFromForm(this.form, RELEASE_REGISTRATION_CONSTANT.COLUMN.PATTERN);
            //const taxPlace = this._utils.getValueFromForm(this.form, RELEASE_REGISTRATION_CONSTANT.COLUMN.TAX_PLACE);
            const taxPlace = this.form.get('taxPlace').value.code;
            const decisionNo = this._utils.getValueFromForm(this.form, RELEASE_REGISTRATION_CONSTANT.COLUMN.DECISION_NO);
            const issueAmount = this.form.get(RELEASE_REGISTRATION_CONSTANT.COLUMN.ISSUE_AMOUNT).value.amount;
            const issueFrom = this._utils.getValueFromForm(this.form, RELEASE_REGISTRATION_CONSTANT.COLUMN.ISSUE_FROM);
            const issueYear = this._utils.getValueFromForm(this.form, RELEASE_REGISTRATION_CONSTANT.COLUMN.ISSUE_YEAR).value;
            const serial = this._utils.getValueFromForm(this.form, RELEASE_REGISTRATION_CONSTANT.COLUMN.SERIAL);


            this._store.setLoading(true);
            let data = await this._store.createRR(buId, taxPlace, decisionNo, issueAmount, issueFrom, issueYear, pattern, serial);
            if (this._utils.checkIsNotNull(data)) {
                return this._utils.routingBackPage(RELEASE_REGISTRATION_CONSTANT.LINK.LIST);
            }
        } catch (error) {
        } finally {
            this._store.setLoading(false);
            this._changeDetectorRef.detectChanges();
        }
    }

    close(): void {
        this._utils.routingBackPage(RELEASE_REGISTRATION_CONSTANT.LINK.LIST);
    }

    release(): void {

    }

    organizationChange(event): void {
        this.settingUpValue(event.value.id);
    }

    ngOnDestroy(): void {

        this._store.isLoading = false;
    }
}
