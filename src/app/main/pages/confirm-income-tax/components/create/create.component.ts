
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
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
import * as moment from 'moment';

import { Validators } from '@angular/forms';
import { ConfirmIncomeTaxService } from '../../confirm-income-tax.service';
import { ConfirmIncomeTaxStore } from '../../confirm-income-tax.store';
import { IConfirmIncomeTax } from '../../models/confirm-income-tax';
import { CONFIRM_INCOME_TAX_CONSTANT } from '../../confirm-income-tax.constant';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';



@Component({
    selector: 'app-create-confirm-income-tax',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class CreateConfirmIncomeTaxComponent implements OnInit, AfterViewInit {
    public data: IConfirmIncomeTax;
    public action;
    public dataTemp;
    public isSended;
    public fileName;
    private filesControl = new FormControl([], [FileUploadValidators.filesLimit(1), FileUploadValidators.fileSize(FILE_CONSTANT.MAX_SIZE_XLSX), FileUploadValidators.sizeRange({ minSize: 20, maxSize: 10000 })]);

    public listBU: any[];
    listOfYears: any[];
    public amountOfYear = 5;
    filteredOptions: Observable<any[]>;

    @ViewChild('input1', { static: false }) input1: MatSelect;

    public maskDate: any = "__/__/____";

    public codePattern = "^[A-Za-z0-9]+$";

    public form: FormGroup;
    private subscription: Subscription;
    private files: Array<any> = [];
    public lstTypeTemplate = [];
    minDate: Date = new Date();
    constructor(
        private _confirmIncomeTaxService: ConfirmIncomeTaxService,
        private _utils: UtilCommon,
        public _store: ConfirmIncomeTaxStore,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private utils: UtilCommon,
        private _utilsCom: UtilComponent) {
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
            vietnamWorkDate: this.maskDate,
            empPayFromDate: this.maskDate,
            empPayToDate: this.maskDate,
            contractDate: this.maskDate,
        };
    }

    private _filter(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.listBU.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }

    displayFn(bu: any): string {
        return bu && bu.name ? bu.name : undefined;
    }

    ngOnInit(): void {
        try {
            this.getValueForForm();
            this._changeDetectorRef.detectChanges();

        } catch (err: any) {
            this._store.isLoading = false;
        }
    }

    ngAfterViewInit() {
        //this.input1.focus();
        //this._changeDetectorRef.detectChanges();
    }

    async getValueForForm(): Promise<void> {
        // Get BusinessUnit for dropdown
        const response = await this._confirmIncomeTaxService.getListBusinessUnitActiveForUser();
        if (this.utils.checkISArray(response)) {
            this.listBU = response;
            if (this.listBU.length > 0) {
                this.filteredOptions = this.form.get('organizationPayingIncome').valueChanges
                    .pipe(
                        startWith(''),
                        map(value => typeof value === 'string' ? value : value.name),
                        map(name => name ? this._filter(name) : this.listBU.slice())
                    );
            }

            this.form.get("organizationPayingIncome").setValue(-1);
            this.form.get("empPayYear").setValue(-1);

            //this.form.get("organizationPayingIncome").setValue(this.listBU[0]);
            //this._changeDetectorRef.detectChanges();
        }

        // Build list of year
        this.listOfYears = this._confirmIncomeTaxService.createListOfYears(new Date().getFullYear(), this.amountOfYear);
        this.form.get("empPayYear").setValue(this.listOfYears[2]);
    }

    // ngAfterViewInit(){
    //     this.input1.focus();
    //     this._changeDetectorRef.detectChanges();
    // }

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

    private getValueFromForm(): any {
        return {
            "buId": this.form.get('organizationPayingIncome').value.id,
            "buCode": this.form.get('organizationPayingIncome').value.code,
            "buName": this.form.get('organizationPayingIncome').value.name,
            "buTaxcode": this.form.get('organizationPayingIncome').value.taxcode,
            "buAddress": this.form.get('organizationPayingIncome').value.fullAddress,
            "buPhone": this.form.get('organizationPayingIncome').value.contactPhone,
            "buEmail": this.form.get('organizationPayingIncome').value.contactEmail,

            "empPayYear": this._utils.getValueFromForm(this.form, CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_PAY_YEAR).value,
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

    checkValidationBeforeSubmit(dataForm) {
        if (dataForm.buId === undefined) {
            setTimeout(() => {
                this.input1.focus();
                this.form.controls["organizationPayingIncome"].setValue(null);
                this.form.controls["organizationPayingIncome"].setValidators([Validators.required]);
                this.form.controls["organizationPayingIncome"].updateValueAndValidity();
                this.form.controls["organizationPayingIncome"].markAsTouched();
                this._changeDetectorRef.detectChanges();
            }, 0);

            this._utilsCom.showTranslateSnackbar('Tên tổ chức thu nhập không được để trống!', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
            return false;
        }
        // if(dataForm.empPayYear === undefined){
        //     const element: any = document.querySelector('[formcontrolname="empPayYear"]');
        //     element['focus']();
        //     this._utilsCom.showTranslateSnackbar('Tên tổ chức thu nhập không được để trống!', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
        //     return false;
        // }    
        return true;
    }

    async save(event): Promise<void> {
        try {
            const form = this.form;
            var dataForm = this.getValueFromForm();
            if (this.checkValidationBeforeSubmit(dataForm)) {
                if (!this._utilsCom.checkValidateFormWithSpecificForm(form)) {
                    return;
                }
                this._store.setLoading(true);
                let data = await this._store.createCIT(dataForm);
                if (this._utils.checkIsNotNull(data)) {
                    return this._utils.routingBackPage(CONFIRM_INCOME_TAX_CONSTANT.LINK.LIST);
                }
            } else {
                //this._utilsCom.showTranslateSnackbar('SAVE_FAIL', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
                return null;
            }

        } catch (error) {
        } finally {
            this._store.setLoading(false);
            this._changeDetectorRef.detectChanges();
        }
    }

    close(): void {
        this._utils.routingBackPage(CONFIRM_INCOME_TAX_CONSTANT.LINK.LIST);
    }

    ngOnDestroy(): void {
        this._store.isLoading = false;
    }

    // dateChange(field: string, evt: any) {
    //     if (evt.value) {
    //         this.form.controls['vietnamWorkDate'].setValue(evt.value);
    //     }
    // }

    // dateChangeFromDate(field: string, evt: any) {
    //     if (evt.value) {
    //         this.form.controls['empPayFromDate'].setValue(evt.value);
    //     }
    // }

    // dateChangeToDate(field: string, evt: any) {
    //     if (evt.value) {
    //         this.form.controls['empPayToDate'].setValue(evt.value);
    //     }
    // }

}
