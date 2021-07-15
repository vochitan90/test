import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReleaseRegistrationStore } from '../releaseRegistration.store';
import { mergeFormWithData } from 'app/main/shared/utils/FunctionUtils';
import { ReleaseRegistrationService } from '../releaseRegistration.service';
import { UtilCommon } from 'app/main/shared/utils/UtilCommon';
import { ACTION } from 'app/main/shared/const/app.constant';
import { RELEASE_REGISTRATION_CONSTANT } from '../releaseRegistration.constant';
import { UtilComponent } from 'app/main/shared/utils/UtilComponent';
import { DomSanitizer } from '@angular/platform-browser';
import { IframeViewComponent } from '../iframe-view/iframe-view.component';

@Component({
    selector: 'app-detail-release-registration-dialog',
    templateUrl: './detail-dialog.component.html',
    styleUrls: ['./detail-dialog.component.scss']
})
export class DetailReleaseRegistrationDialogComponent implements OnInit {

    public issueRegistryDetail: any;
    listOfYears: any[];
    public amountOfYear = 5;
    public data;
    minDate: Date = new Date();
    isUpdateAction: boolean = false;
    currentAction: string;
    //private _addDialogRef: MatDialogRef<IframeViewComponent>;
    private _addDialogRef1: MatDialogRef<IframeViewComponent>;

    listTaxPlace: any[];

    _previewUrl: any;
    currentStatus: number;

    

    public form: FormGroup;
    constructor(
        public _store: ReleaseRegistrationStore,
        private _releaseRegistrationService: ReleaseRegistrationService,
        private _changeDetectorRef: ChangeDetectorRef,
        public matDialogRef: MatDialogRef<DetailReleaseRegistrationDialogComponent>,
        private _utils: UtilCommon,
        private _utilsCom: UtilComponent,
        @Inject(MAT_DIALOG_DATA) public _dialogData: any,
        public _matDialog: MatDialog,
        private sanitizer: DomSanitizer,
        private _formBuilder: FormBuilder
    ) {
        var serialPattern = "^[A,B,C,D,E,G,H,K,L,M,N,P,Q,R,S,T,U,V,X,Y]{2}$";
        this.form = _formBuilder.group({
            // Thông tin đơn vị phát hành
            'organizationPayingIncome': [''],
            'taxCode': [''],
            'contactPhone': [''],
            'buEmail': [''],
            'majorInfo': [''],
            'address': [''],
            'cityProvince': [''],
            'countyDistrictTown': [''],
            'wards': [''],
            'representativeName': [''],
            'representativePhone': [''],
            'representativeAddress': [''],

            // Thông tin chứng từ phát hành
            'pattern': ['', Validators.compose([Validators.required])],
            'decisionNo': ['', Validators.compose([Validators.required])],
            'taxPlace': ['', Validators.compose([Validators.required])],
            'serial': ['', Validators.compose([Validators.required, Validators.pattern(serialPattern)])],
            'issueYear': ['', Validators.compose([Validators.required])],
            'issueAmount': ['', Validators.compose([Validators.required])],
            'issueFrom': ['', Validators.compose([Validators.required])],
        });
    }

    async getValueForForm(itemId): Promise<void> {
        // Get BusinessUnit for dropdown
        this.issueRegistryDetail = await this._releaseRegistrationService.getIssueRegistryDetail(itemId);
        console.log(this.issueRegistryDetail);
        // Continue to load value for orther form
        mergeFormWithData(this.issueRegistryDetail.data, this.form);

        // Dropdown tên đơn vị
        this.form.get("organizationPayingIncome").setValue(this.issueRegistryDetail.data.buName);

        // Địa chỉ
        this.form.get("address").setValue(this.issueRegistryDetail.data.pltbAddress?.streetNumber);

        // Province
        this.form.get("cityProvince").setValue(this.issueRegistryDetail.data.provinceDto?.name);

        // District
        this.form.get("countyDistrictTown").setValue(this.issueRegistryDetail.data.districtDto?.name);

        // Ward
        this.form.get("wards").setValue(this.issueRegistryDetail.data?.wardDto?.name);

        // Build list of year
        this.listOfYears = this._releaseRegistrationService.createListOfYears(new Date().getFullYear(), this.amountOfYear);

        var currentSelectedYear = this.listOfYears.find(res => {
            return res.value == this.issueRegistryDetail.data.issueYear;
        })

        this.form.get("issueYear").setValue(currentSelectedYear);

        // Get value for TaxPlace
        this.listTaxPlace = await this._releaseRegistrationService.getListTaxPlace();
        const currentTaxItem = this.listTaxPlace.filter(x => x.code === this.issueRegistryDetail.data.taxPlace);
        this.form.get("taxPlace").setValue(currentTaxItem[0]);

        // Set issue Form (last field)
        //this.form.get("issueFrom").setValue(this.issueRegistryDetail.data.issueFrom);

        this._changeDetectorRef.detectChanges();
    }

    async ngOnInit(): Promise<void> {
        try {
            this.currentAction = this._dialogData.action;
            this.currentStatus = this._dialogData.data.status;
            if (this._utils.checkIsNotNull(this._dialogData.data)) {

                this.getValueForForm(this._dialogData.data.id);
                // Call api to get detail businessUnitDetail            
                if (this._dialogData.action == ACTION.VIEW) {
                    this.form.disable();
                } else {
                    this.isUpdateAction = true;
                    //this.form.controls['code'].disable();
                }
                return;
            }

        } catch (error) {

        }
    }

    async save(): Promise<void> {
        try {
            const form = this.form;
            if (!this._utilsCom.checkValidateFormWithSpecificForm(form)) {
                return;
            }

            //const buId = this.form.get('organizationPayingIncome').value.id;
            const id = this._dialogData.data.id;
            const pattern = this._utils.getValueFromForm(this.form, RELEASE_REGISTRATION_CONSTANT.COLUMN.PATTERN);
            //const taxPlace = this._utils.getValueFromForm(this.form, RELEASE_REGISTRATION_CONSTANT.COLUMN.TAX_PLACE);
            const taxPlace = this.form.get('taxPlace').value.code;
            const decisionNo = this._utils.getValueFromForm(this.form, RELEASE_REGISTRATION_CONSTANT.COLUMN.DECISION_NO);
            const issueAmount = this._utils.getValueFromForm(this.form, RELEASE_REGISTRATION_CONSTANT.COLUMN.ISSUE_AMOUNT);
            const issueFrom = this._utils.getValueFromForm(this.form, RELEASE_REGISTRATION_CONSTANT.COLUMN.ISSUE_FROM);
            const issueYear = this._utils.getValueFromForm(this.form, RELEASE_REGISTRATION_CONSTANT.COLUMN.ISSUE_YEAR).value;
            const serial = this._utils.getValueFromForm(this.form, RELEASE_REGISTRATION_CONSTANT.COLUMN.SERIAL);


            this._store.setLoading(true);
            let data = await this._store.updateRR(id, taxPlace, decisionNo, issueAmount, issueFrom, issueYear, pattern, serial);
            if (this._utils.checkIsNotNull(data)) {
                this.close();
                return this._utils.routingBackPage(RELEASE_REGISTRATION_CONSTANT.LINK.LIST);
            }
        } catch (error) {
        } finally {
            this._store.setLoading(false);
            this._changeDetectorRef.detectChanges();
        }
    }

    async print(): Promise<void> {
        try {
            const id = this._dialogData.data.id;

            // Get attachmentId by GetDetail
            const a = this.issueRegistryDetail;
            try {
                this._addDialogRef1 = this._matDialog.open(IframeViewComponent, {
                    //panelClass: 'custom-dialog',
                    data: {
                        action: ACTION.UPDATE,
                        data: this._dialogData.data,
                        taxCode: this.issueRegistryDetail.data.taxCode,
                        previewPdf: `${RELEASE_REGISTRATION_CONSTANT.API.PREVIEW_FILE}aggId=${this.issueRegistryDetail.data.aggId}`,
                        status: this.currentStatus,
                        aggId: this.issueRegistryDetail.data.aggId,
                        cttbIssueRegistryAttachments: this.issueRegistryDetail.data.cttbIssueRegistryAttachments
                    },
                    id: 'iframeViewPdf',
                    disableClose: false,
                    width: '95%',

                });
                this._addDialogRef1.afterClosed().subscribe((isSuccess: boolean) => {
                    if (isSuccess) {
                        this.matDialogRef.close(true);
                    }
                });

            } catch (error) {
                console.log(error);
            }
        } catch (error) {
        }
    }

    async release(): Promise<void> {

        //this._store.setLoading(true);
        const id = this._dialogData.data.id;
        let data = await this._store.approveRR(id);
        if (this._utils.checkIsNotNull(data)) {
            this.close();
            return this._utils.routingBackPage(RELEASE_REGISTRATION_CONSTANT.LINK.LIST);
        }
    }

    close() {
        this.matDialogRef.close(true);
    }

    organizationChange(event): void {
        const data = {
            'taxCode': 'text',
            'phoneNumberOrganization': 'text',
            'business': 'text',
            'address': 'text',
            'cityProvince': 'text',
            'countyDistrictTown': 'text',
            'wards': 'text',
            'legalRepresentativeName': 'text',
            'phoneNumberRepresentative': 'text',
            'addressRepresentative': 'text',
        };
        mergeFormWithData(data, this.form);
    }

}
