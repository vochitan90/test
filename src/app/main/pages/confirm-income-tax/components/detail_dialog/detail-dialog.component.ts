import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FormControl } from '@angular/forms';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { ACTION, FILE_CONSTANT } from 'app/main/shared/const/app.constant';
import { Observable, Subscription } from 'rxjs';
import { UtilCommon, UtilComponent } from 'app/main/shared';
import { Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { checkIsNotNull } from 'app/main/shared/utils/GridService';
import { ConfirmIncomeTaxStore } from '../../confirm-income-tax.store';
import { DomSanitizer } from '@angular/platform-browser';
import { CONFIRM_INCOME_TAX_CONSTANT } from '../../confirm-income-tax.constant';
import { ConfirmIncomeTaxService } from '../../confirm-income-tax.service';
import * as moment from 'moment';
import { IframeViewComponent } from '../iframe-view/iframe-view.component';
import { mergeFormWithData } from 'app/main/shared/utils/FunctionUtils';
import { map, startWith } from 'rxjs/operators';



@Component({
    selector: 'app-org-info-detail-dialog',
    templateUrl: './detail-dialog.component.html',
    styleUrls: ['./detail-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class DetailConfirmIncomeTaxDialogComponent implements OnInit, OnChanges {

    public dataTemp;

    currentAction: string;
    public listBU: any[];
    isUpdateAction: boolean = false;

    private _addDialogRef: MatDialogRef<IframeViewComponent>;
    public taxIncomeLetterDetail: any;
    filteredOptions: Observable<any[]>;

    public codePattern = "^[A-Za-z0-9]+$";

    public form: FormGroup;
    constructor(
        public _store: ConfirmIncomeTaxStore,
        private _confirmIncomeTaxService: ConfirmIncomeTaxService,
        public matDialogRef: MatDialogRef<DetailConfirmIncomeTaxDialogComponent>,
        private _utils: UtilCommon,
        private _utilsCom: UtilComponent,
        @Inject(MAT_DIALOG_DATA) public _dialogData: any,
        public _matDialog: MatDialog,
        private sanitizer: DomSanitizer,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
        this.form = _formBuilder.group({
            
            'organizationPayingIncome': ['', Validators.compose([Validators.required])],
            'empPayYear': ['', Validators.compose([Validators.required])],
            'empCode': ['', Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern(this.codePattern)])],
            'empName': ['', Validators.compose([Validators.required])],
            'empJobtile': [''],
            'vietnamWorkDate': [''],
            'empPayFromDate': ['', Validators.compose([Validators.required])],
            'empPayToDate': ['', Validators.compose([Validators.required])],
            'empIncomeTotal': ['', Validators.compose([Validators.required])],
            'empIncomeVietnam': ['', Validators.compose([Validators.required])],
            'empIncomeForeign': [''],

            'empIncomeForeignWithheld': [''],
            'empTaxincomeWithheld': ['', Validators.compose([Validators.required])],
            'empInsuranceWithheld': ['', Validators.compose([Validators.required])],
            'empOtherWithheld': [''],
            'empRent': [''],

            'contractNo': ['', Validators.compose([Validators.required])],
            'contractDate': ['', Validators.compose([Validators.required])],

        });

        this.dataTemp = {
            effectiveDate: this._utils.formatDatePattern(new Date().getTime()),
            contractDate: this._utils.formatDatePattern(new Date().getTime()),
        };

    }

    dateChange(name, event) {

    }

    dateChangeFromDate(name, event) {

    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(changes);

        try {
            this.currentAction = this._dialogData.action;
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

    private _filter(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.listBU.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }

    displayFn(bu: any): string {
        return bu && bu.name ? bu.name : undefined;
    }

    ngOnInit() {
        // try {
        //     this.getValueForForm();
        // } catch (err: any) {
        //     this._store.isLoading = false;
        // }

        try {
            this.currentAction = this._dialogData.action;
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

    private formatDateBeforeSave(oldDate): void {
        // Format date
        const newDate: any = moment(oldDate, 'DD/MM/YYYY');
        return newDate._d.getTime();
    }

    private convertStringToNumber(value){
        if(value){
            return +value.replace(/\./g,'');
        }else{
            return value;
        }
    }

    private numberWithDot(value) {
        return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : value;
    }

    private getValueFromForm(itemId): any {
        return {
            "id": itemId,
            "buId": this.form.get('organizationPayingIncome').value.id,
            "buCode": this.form.get('organizationPayingIncome').value.code,
            "buName": this.form.get('organizationPayingIncome').value.name,
            "buTaxcode": this.form.get('organizationPayingIncome').value.taxcode,
            "buAddress": this.form.get('organizationPayingIncome').value.fullAddress,
            "buPhone": this.form.get('organizationPayingIncome').value.contactPhone,
            "buEmail": this.form.get('organizationPayingIncome').value.contactEmail,

            "empPayYear": this._utils.getValueFromForm(this.form, CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_PAY_YEAR),
            "empCode": this._utils.getValueFromForm(this.form, CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_CODE),
            "empName": this._utils.getValueFromForm(this.form, CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_NAME),
            "empJobtile": this._utils.getValueFromForm(this.form, CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_JOB_TITLE),
            "vietnamWorkDate": this.formatDateBeforeSave(this._utils.getValueFromForm(this.form, CONFIRM_INCOME_TAX_CONSTANT.COLUMN.VN_WORK_DATE)),
            "empPayFromDate": this.formatDateBeforeSave(this._utils.getValueFromForm(this.form, CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_PAY_FROM_DATE)),
            "empPayToDate": this.formatDateBeforeSave(this._utils.getValueFromForm(this.form, CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_PAY_TO_DATE)),
            
            "empIncomeTotal": this.convertStringToNumber(this._utils.getValueFromForm(this.form, CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_INCOME_TOTAL)),
            "empIncomeVietnam": this.convertStringToNumber(this._utils.getValueFromForm(this.form, CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_INCOME_VN)),
            "empIncomeForeign": this.convertStringToNumber(this._utils.getValueFromForm(this.form, CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_INCOME_FOREIGN)),
            "empIncomeForeignWithheld": this.convertStringToNumber(this._utils.getValueFromForm(this.form, CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_IMCOME_FOREIGN_WITH_HELD)),
            "empTaxincomeWithheld": this.convertStringToNumber(this._utils.getValueFromForm(this.form, CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_TAX_INCOME_WITH_HELD)),
            "empInsuranceWithheld": this.convertStringToNumber(this._utils.getValueFromForm(this.form, CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_INSURANCE_WITH_HELD)),
            "empOtherWithheld": this.convertStringToNumber(this._utils.getValueFromForm(this.form, CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_OTHER_WITH_HELD)),
            "empRent": this.convertStringToNumber(this._utils.getValueFromForm(this.form, CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_RENT)),

            "contractNo": this._utils.getValueFromForm(this.form, CONFIRM_INCOME_TAX_CONSTANT.COLUMN.CONTRACT_NO),
            "contractDate": this.formatDateBeforeSave(this._utils.getValueFromForm(this.form, CONFIRM_INCOME_TAX_CONSTANT.COLUMN.CONTRACT_DATE)),
        }
    }

    filterBuItem(buName: string){
        return this.listBU.filter(value => value.name === buName);
    }

    async getValueForForm(itemId): Promise<void> {
        
        // Get BusinessUnit for dropdown
        this.taxIncomeLetterDetail = await this._confirmIncomeTaxService.getTaxIncomeLetterDetail(itemId);
        console.log(this.taxIncomeLetterDetail);

        // Continue to load value for orther form

        this.taxIncomeLetterDetail.data.empIncomeTotal = this.numberWithDot(this.taxIncomeLetterDetail.data.empIncomeTotal);
        this.taxIncomeLetterDetail.data.empIncomeVietnam = this.numberWithDot(this.taxIncomeLetterDetail.data.empIncomeVietnam);
        this.taxIncomeLetterDetail.data.empIncomeForeign = this.numberWithDot(this.taxIncomeLetterDetail.data.empIncomeForeign);
        this.taxIncomeLetterDetail.data.empIncomeForeignWithheld = this.numberWithDot(this.taxIncomeLetterDetail.data.empIncomeForeignWithheld);
        this.taxIncomeLetterDetail.data.empTaxincomeWithheld = this.numberWithDot(this.taxIncomeLetterDetail.data.empTaxincomeWithheld);
        this.taxIncomeLetterDetail.data.empInsuranceWithheld = this.numberWithDot(this.taxIncomeLetterDetail.data.empInsuranceWithheld);
        this.taxIncomeLetterDetail.data.empOtherWithheld = this.numberWithDot(this.taxIncomeLetterDetail.data.empOtherWithheld);
        this.taxIncomeLetterDetail.data.empRent = this.numberWithDot(this.taxIncomeLetterDetail.data.empRent);


        mergeFormWithData(this.taxIncomeLetterDetail.data, this.form);

        this.listBU = await this._confirmIncomeTaxService.getListBusinessUnitActiveForUser();
        const currentBu = this.filterBuItem(this.taxIncomeLetterDetail.data.buName);
        this.form.get("organizationPayingIncome").setValue(currentBu[0]);
        

        this.filteredOptions = this.form.get('organizationPayingIncome').valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.name),
                map(name => name ? this._filter(name) : this.listBU.slice())
            );

        // Ngày đến việt nam
        this.form.controls['vietnamWorkDate'].setValue(new Date(this.taxIncomeLetterDetail.data.vietnamWorkDate));

        // Thu nhập từ ngày
        this.form.controls['empPayFromDate'].setValue(new Date(this.taxIncomeLetterDetail.data.empPayFromDate));

        // Thu nhập đến ngày
        this.form.controls['empPayToDate'].setValue(new Date(this.taxIncomeLetterDetail.data.empPayToDate));

        // Ngày hợp đồng
        this.form.controls['contractDate'].setValue(new Date(this.taxIncomeLetterDetail.data.contractDate));

        this._changeDetectorRef.detectChanges();
    }

    async save(): Promise<void> {
        try {
            const form = this.form;
            if (!this._utilsCom.checkValidateFormWithSpecificForm(form)) {
                return;
            }
            var dataForm = this.getValueFromForm(this._dialogData.data.id);
            this._store.setLoading(true);
            let data = await this._store.updateCIT(dataForm);
            if (this._utils.checkIsNotNull(data)) {
                this.close();
                return this._utils.routingBackPage(CONFIRM_INCOME_TAX_CONSTANT.LINK.LIST);
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
            try {
                this._addDialogRef = this._matDialog.open(IframeViewComponent, {
                    //panelClass: 'custom-dialog',
                    data: {
                        action: ACTION.VIEW,
                        data: this._dialogData.data,
                        previewPdf: `${CONFIRM_INCOME_TAX_CONSTANT.API.PREVIEW_FILE}aggId=${this.taxIncomeLetterDetail.data.aggId}`,
                    },
                    id: 'iframeViewPdf',
                    disableClose: false,
                    width: '100%',

                });
                this._addDialogRef.afterClosed().subscribe((isSuccess: boolean) => {
                    if (isSuccess) {
                        //this.gridOptions.api.refreshServerSideStore({ purge: true });
                    }
                });

            } catch (error) {
                console.log(error);
            }
        } catch (error) {
        }
    }

    close() {
        this.matDialogRef.close(true);
    }

    async release(): Promise<void> {

        //this._store.setLoading(true);
        const id = this._dialogData.data.id;
        let data = await this._store.approveCIT(id);
        if (this._utils.checkIsNotNull(data)) {
            this.close();
            return this._utils.routingBackPage(CONFIRM_INCOME_TAX_CONSTANT.LINK.LIST);
        }
    }
}
