import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { AppState, UtilCommon, UtilComponent } from 'app/main/shared';
import { ACTION, APP_CONSTANT, FILE_CONSTANT } from 'app/main/shared/const/app.constant';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ITaxIncome, ITaxIncomeReplace, ResourceDtos } from '../models/taxIncome.interface';
import { PreviewFilePrintComponent } from '../preview-file-print/preview-file-print.component';
import { TAX_INCOME_CONSTANT } from '../taxIncome.constant';
import { TaxIncomeStore } from '../taxIncome.store';

@Component({
    selector: 'app-tax-income-view',
    templateUrl: './tax-income-view.component.html',
    styleUrls: ['./tax-income-view.component.scss']
})
export class TaxIncomeViewComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    @ViewChild('idnoIssuedDate') idIdnoIssuedDate: ElementRef;
    @Input() taxincome: ITaxIncome = {
        empIsResident: 1,
    };
    TAX_INCOME_STATUS = TAX_INCOME_CONSTANT.STATUS;
    @Input() readonly = false;

    @Input() action;

    @Input() showButtonIssue = false;

    @Output() updateComplete: any = new EventEmitter<boolean>();

    taxIncomeFieldRequire: any = [];
    actionType = ACTION;
    listOrg: Array<any> = [];
    selectedOrg = -1;

    listPattern: Array<any> = [];
    selectedPattern = -1;

    listSerial: Array<any> = [];
    selectedSerial = -1;

    empTaxincomeWithheld = '';
    empTaxincomeCalculation = '';
    empPersonaltaxWithheld = '';

    empIdnoIssuedDate: any = null;

    curYear: number;

    listPayYear: Array<any> = [];
    listPayMonth: Array<any> = [];

    haveFilePDFTaxIncome = false;

    private filesControl = new FormControl([],
        [
            FileUploadValidators.filesLimit(1),
            FileUploadValidators.fileSize(FILE_CONSTANT.MAX_SIZE_XLSX),
            FileUploadValidators.sizeRange({ minSize: 20, maxSize: 10000 })
        ]);
    public resourceDtos: ResourceDtos[] = [];

    private subscription: Subscription;
    form = new FormGroup({
        files: this.filesControl
    });
    multipleUpload = true;
    allowUpload = false;
    isNotExistPattern = false;
    isNotExistSerial = false;
    private _previewFileDialogRef: MatDialogRef<PreviewFilePrintComponent>;
    constructor(
        private appState: AppState,
        private utils: UtilCommon,
        private _router: Router,
        public store: TaxIncomeStore,
        private _changeDetectorRef: ChangeDetectorRef,
        private _utilsCom: UtilComponent,
        public _matDialog: MatDialog,
        private _formBuilder: FormBuilder) {
        this.curYear = (new Date()).getFullYear();
        this.form = _formBuilder.group({
            files: this.filesControl
        });

    }

    async ngOnInit(): Promise<void> {
        try {
            this.taxincome.empPayYear = this.curYear;
            this.taxincome.empPayFromMonth = 1;
            this.taxincome.empPayToMonth = 12;
            this.taxIncomeFieldRequire = [
                {
                    key: 'empName',
                    type: 'text',
                    name: 'Họ và tên'
                },
                // {
                //     key: 'empTaxcode',
                //     type: 'text',
                //     name: 'Mã số thuế'
                // },
                {
                    key: 'empNationality',
                    type: 'text',
                    name: 'Quốc tịch'
                },
                {
                    key: 'empContactAddress',
                    type: 'text',
                    name: 'Địa chỉ liên hệ'
                },
                {
                    key: 'empContactPhone',
                    type: 'text', name: 'Điện thoại liên hệ'
                },
                // {
                //     key: 'empIdno',
                //     type: 'text', name: 'Số CMND/CCCD/Passport'
                // },
                // {
                //     key: 'empIdnoIssuedPlace',
                //     type: 'text', name: 'Nơi cấp'
                // },
                {
                    key: 'empIncomeType',
                    type: 'text', name: 'Khoản thu nhập'
                },
                {
                    key: 'empPayYear',
                    type: 'number', name: 'Năm thu nhập'
                },
                {
                    key: 'empPayFromMonth',
                    type: 'number', name: 'tháng bắt đầu trả thu nhập'
                },
                {
                    key: 'empPayToMonth',
                    type: 'number', name: 'tháng kết thúc trả thu nhập'
                },
                {
                    key: 'empTaxincomeWithheld',
                    type: 'number', name: 'Tổng thu nhập chịu thuế phải khấu trừ'
                },
                {
                    key: 'empTaxincomeCalculation',
                    type: 'number', name: 'Tổng thu nhập tính thuế'
                },
                {
                    key: 'empPersonaltaxWithheld',
                    type: 'number', name: 'Số thuế thu nhập cá nhân đã khấu trừ'
                },
            ];
            this.listPayYear = this.createListOfYears(this.curYear, 5);
            this.listPayMonth = this.createListMonth();
            const response = await this.store.getListBusinessUnitActiveForUser();
            if (this.utils.checkISArray(response)) {
                this.listOrg = response;
            }
        } catch (err: any) {
            // this.store.isLoading = false;
        }
    }

    async ngOnChanges(changes: SimpleChanges): Promise<void> {
        if (this.checkChanges(changes, 'taxincome')) {
            if (this.taxincome.buId) {
                this.selectedOrg = this.taxincome.buId;
                // Pattern
                const response = await this.store.getListPatternByBuTaxCode(this.taxincome.buTaxcode);
                if (this.utils.checkISArray(response)) {
                    this.listPattern = response;
                }
                const pattern = this.listPattern.find(i => i === this.taxincome.pattern);
                if (pattern) {
                    this.selectedPattern = this.taxincome.pattern ? this.taxincome.pattern : -1;
                } else { // Không còn tồn tại Pattern này
                    this.isNotExistPattern = true;
                    this.listPattern = [this.taxincome.pattern];
                }
                // Serial
                const responseSerial = await this.store.getListSerial(this.taxincome.buTaxcode, this.taxincome.pattern);
                if (this.utils.checkISArray(responseSerial)) {
                    this.listSerial = responseSerial;
                }
                const serial = this.listSerial.find(i => i === this.taxincome.serial);
                if (serial) {
                    this.selectedSerial = this.taxincome.serial ? this.taxincome.serial : -1;
                } else { // Không còn tồn tại Serial này
                    this.isNotExistSerial = true;
                    this.listSerial = [this.taxincome.serial];
                }
                // 
                if (this.taxincome.empIdnoIssuedDate) {
                    this.empIdnoIssuedDate = this.utils.formatDatePattern(this.taxincome.empIdnoIssuedDate, this.getFormatDatePatternByLanguage());
                    this.idIdnoIssuedDate.nativeElement.value = this.empIdnoIssuedDate;
                }
                this.empTaxincomeWithheld = this.taxincome.empTaxincomeWithheld;
                this.empTaxincomeCalculation = this.taxincome.empTaxincomeCalculation;
                this.empPersonaltaxWithheld = this.taxincome.empPersonaltaxWithheld;
                // Load TaxincomeAttachments
                if (this.taxincome.cttbTaxincomeAttachments) {
                    this.loadTaxincomeAttachments(this.taxincome.cttbTaxincomeAttachments);
                }
                this._changeDetectorRef.detectChanges();
            }
        }
    }

    private getFormatDatePatternByLanguage(): string {
        let pattern = '';
        switch (this.appState.getLanguage()) {
            case 'vi':
                pattern = 'DD/MM/yyyy';
                break;
            case 'en':
                pattern = 'MM/DD/YYYY';
                break;
            default:
                break;
        }
        return pattern;
    }

    loadTaxincomeAttachments(taxincomeAttachments): void {
        this.allowUpload = this.action === this.actionType.REPLACE && this.taxincome.status === this.TAX_INCOME_STATUS.ISSUE;
        const resourceFiles = [];
        for (const item of taxincomeAttachments) {
            // File đính kèm
            if (item.isPrimary === 0) {
                resourceFiles.push({
                    id: item.smtbResource.id,
                    name: item.smtbResource.fileName,
                    isDownload: true,
                    // size: item.smtbResource.fileSize
                    size: 0
                });
                const smtbResource = item.smtbResource;
                this.resourceDtos.push(
                    {
                        'sizeType': smtbResource.sizeType, 'aliasName': smtbResource.fileName,
                        'fileName': smtbResource.fileName,
                        'filePath': smtbResource.filePath,
                        'mineType': smtbResource.mineType,
                        'refCode': null
                    }
                );
            } else if (item.isPrimary === 1) { // File taxincome
                this.haveFilePDFTaxIncome = true;
            }
        }
        this.filesControl.setValue(resourceFiles);
        this.multipleUpload = false;
        setTimeout(() => {
            if (!this.allowUpload && document.getElementsByClassName('upload-input').length > 0) {
                document.getElementsByClassName('upload-input')[0]['style'].visibility = 'hidden';
            }
        });
    }

    ngOnDestroy(): void {
        this.store.isLoading = false;
        this.subscription.unsubscribe();
    }

    async ngAfterViewInit(): Promise<void> {
        this.subscription = this.filesControl.valueChanges.subscribe(async (values: Array<File>) => {
            if (this.allowUpload && this.utils.checkISArray(values)) {
                const latstFile: any = values[values.length - 1];
                if (latstFile.isDownload) {
                    return;
                }
                const dataFile = await this.store.uploadFileTemp(latstFile);
                if (this.utils.checkIsNotNull(dataFile)) {
                    if (dataFile.status === APP_CONSTANT.SUCCESS) {
                        this.resourceDtos.push(
                            {
                                'sizeType': dataFile.sizeType, 'aliasName': dataFile.fileName,
                                'fileName': dataFile.fileName,
                                'filePath': dataFile.tempFilePath,
                                'mineType': dataFile.mineType,
                                'refCode': null
                            }
                        );
                    }
                }
            }
        });
    }

    checkChanges(changes: SimpleChanges, key): any {
        return changes[key] && changes[key].previousValue !== changes[key].currentValue;
    }

    async issue(): Promise<void> {
        this.store.isLoading = true;
        try {
            const data = await this.store.issue([this.taxincome.id]);
            this.store.isLoading = false;
            if (!this.utils.checkIsNotNull(data)) {
                this._utilsCom.showTranslateSnackbar('ISSUE_TAX_INCOME_SUCCESS');
                this.updateComplete.emit(true);
            } else {
                this._utilsCom.showTranslateSnackbar('ISSUE_TAX_INCOME_FAIL', 'error');
            }
        } catch (error) {
            this.store.isLoading = false;
            this._utilsCom.showTranslateSnackbar('ISSUE_TAX_INCOME_FAIL', 'error');
        }
    }

    async replace(): Promise<void> {
        if (!this.validTaxIncome(this.taxIncomeFieldRequire)) {
            return;
        }
        this.formatDataBeforeSave();
        //
        this.readonly = true;
        this.store.isLoading = true;
        try {
            // Format data
            const { buId, buCode, buName, buAddress, buEmail, buPhone,
                buTaxcode, description, empCode, empIdno, empIdnoIssuedDate,
                empIdnoIssuedPlace, empIncomeType, empIsResident, empName,
                empPersonaltaxWithheld, empTaxcode, empTaxincomeCalculation,
                empTaxincomeWithheld, extValue, note, pattern, serial, empNationality,
                empContactAddress, empContactPhone, empPayFromMonth, empPayToMonth, empPayYear
            } = this.taxincome;

            const dataReplace: ITaxIncomeReplace = {
                buId, buCode, buName, buAddress, buEmail, buPhone,
                buTaxcode, description, empCode, empIdno, empIdnoIssuedDate,
                empIdnoIssuedPlace, empIncomeType, empIsResident, empName,
                empPersonaltaxWithheld, empTaxcode, empTaxincomeCalculation,
                empTaxincomeWithheld, extValue, note, pattern, serial, empNationality,
                empContactAddress, empContactPhone, empPayFromMonth, empPayToMonth, empPayYear
            };
            dataReplace.taxincomeRefId = this.taxincome.id;
            dataReplace.resourceDtos = this.resourceDtos;
            // Replace
            const data = await this.store.replace(dataReplace);
            this.readonly = false;
            this.store.isLoading = false;
            if (!this.utils.checkIsNotNull(data)) {
                this._utilsCom.showTranslateSnackbar('REPLACE_TAX_INCOME_SUCCESS');
                this.updateComplete.emit(true);
            } else {
                if (data.code === 'VALIDATION.EXISTS_REPLACE') {
                    this._utilsCom.showTranslateSnackbar('EXISTS_REPLACE_TAX_INCOME', 'error');
                } else {
                    this._utilsCom.showTranslateSnackbar('REPLACE_TAX_INCOME_FAIL', 'error');
                }
            }
        } catch (error) {
            this.readonly = false;
            this.store.isLoading = false;
            this._utilsCom.showTranslateSnackbar('REPLACE_TAX_INCOME_FAIL', 'error');
        }
    }

    async update(): Promise<void> {
        if (!this.validTaxIncome(this.taxIncomeFieldRequire)) {
            return;
        }
        this.formatDataBeforeSave();
        //
        this.readonly = true;
        this.store.isLoading = true;
        try {
            const data = await this.store.update(this.taxincome);
            this.readonly = false;
            this.store.isLoading = false;
            if (!this.utils.checkIsNotNull(data)) {
                this._utilsCom.showTranslateSnackbar('UPDATE_SUCCESS');
                this.updateComplete.emit(true);
            } else {
                this._utilsCom.showTranslateSnackbar('UPDATE_FAIL', 'error');
            }
        } catch (error) {
            this.readonly = false;
            this.store.isLoading = false;
            this._utilsCom.showTranslateSnackbar('UPDATE_FAIL', 'error');
        }
    }

    async save(): Promise<void> {
        if (!this.validTaxIncome(this.taxIncomeFieldRequire)) {
            return;
        }
        this.formatDataBeforeSave();
        //
        this.readonly = true;
        this.store.isLoading = true;
        try {
            const data = await this.store.create(this.taxincome);
            this.readonly = false;
            this.store.isLoading = false;
            if (!this.utils.checkIsNotNull(data)) {
                this._utilsCom.showTranslateSnackbar('SAVE_SUCCESS');
                this.utils.routingPageChild(TAX_INCOME_CONSTANT.LINK.LIST_NEW, this._router);
            } else {
                this._utilsCom.showTranslateSnackbar('SAVE_FAIL', 'error');
            }
        } catch (error) {
            this.readonly = false;
            this.store.isLoading = false;
            this._utilsCom.showTranslateSnackbar('SAVE_FAIL', 'error');
        }
    }

    async clone(): Promise<void> {
        if (!this.validTaxIncome(this.taxIncomeFieldRequire)) {
            return;
        }
        this.formatDataBeforeSave();
        //
        this.readonly = true;
        this.store.isLoading = true;
        try {
            delete this.taxincome.aggId;
            const data = await this.store.create(this.taxincome);
            this.readonly = false;
            this.store.isLoading = false;
            if (!this.utils.checkIsNotNull(data)) {
                this._utilsCom.showTranslateSnackbar('SAVE_SUCCESS');
                this.updateComplete.emit(true);
            } else {
                this._utilsCom.showTranslateSnackbar('SAVE_FAIL', 'error');
            }
        } catch (error) {
            this.readonly = false;
            this.store.isLoading = false;
            this._utilsCom.showTranslateSnackbar('SAVE_FAIL', 'error');
        }
    }

    preview(): void {
        this._previewFileDialogRef = this._matDialog.open(PreviewFilePrintComponent, {
            panelClass: 'custom-dialog',
            data: {
                aggId: this.taxincome.aggId,
            },
            id: 'previewFile',
            disableClose: false,
        });
    }

    async downloadResource(item): Promise<void> {
        try {
            this.store.isLoading = true;
            // IF file doc
            if (this.utils.getExtensionFileDoc(item.name)) {
                const { response, ext } = await this.store.downloadResource(item.id, true);
                if (this.utils.checkIsNotNull(response) && this.utils.checkIsNotNull(ext)) {
                    this.utils.downloadFile(item.name, response);
                } else {
                    this._utilsCom.openSnackBar('Không thể tải tập tin ', 'error');
                }
            } else {// Other
                const response = await this.store.downloadResource(item.id, false);
                if (this.utils.checkIsNotNull(response)) {
                    this.utils.downloadFile(item.name, response);
                } else {
                    this._utilsCom.openSnackBar('Không thể tải tập tin ', 'error');
                }
            }

            this.store.isLoading = false;
        } catch (error) {
            this.store.isLoading = false;
        }
    }

    removeFile(control, file, index): void {
        this.resourceDtos.splice(index, 1);
        control.removeFile(file);
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

    iNumberChange($event: any, field: any, row: any, index: number = -1): void {
        let value: any = null;
        if ($event) {
            if ($event.srcElement) {
                value = $event.srcElement.value;
            } else {
                value = $event;
            }
            if (value.indexOf('.') > -1) {
                this.taxincome[field] = parseFloat(value);
            } else {
                this.taxincome[field] = this.parseNumber(value);
            }
        } else {
            this.taxincome[field] = null;
        }

    }

    numberOnly(event): any {
        const pattern = /[0-9\+\-\ ]/;
        const inputChar = String.fromCharCode(event.charCode);
        if ((event.keyCode !== 8 && !pattern.test(inputChar)) || inputChar === ' ') {
            event.preventDefault();
        }
    }

    preventSpace(event): any {
        if (event.charCode === 32) {
            event.preventDefault();
        }
    }

    async orgChange(value): Promise<void> {
        this.isNotExistPattern = false;
        this.isNotExistSerial = false;
        const buId = Number(value);
        this.selectedPattern = -1;
        this.selectedSerial = -1;
        this.listPattern = [];
        this.listSerial = [];
        if (buId !== -1) {
            const orgInfo = this.listOrg.find(item => item.id === buId);
            // Pattern
            const response = await this.store.getListPatternByBuTaxCode(orgInfo.taxcode);
            if (this.utils.checkISArray(response)) {
                this.listPattern = response;
                // Lấy giá trị đầu tiên của lsit pattern nếu list pattern = 1 và giá trị item đầu khác null
                if (this.listPattern.length === 1 && this.listPattern[0]) {
                    this.selectedPattern = this.listPattern[0];
                    await this.getDefaultSerial(orgInfo.taxcode, this.selectedPattern);
                }
            }
            this.taxincome.buName = orgInfo.name;
            this.taxincome.buCode = orgInfo.code;
            this.taxincome.buAddress = orgInfo.fullAddress;
            this.taxincome.buTaxcode = orgInfo.taxcode;
            this.taxincome.buPhone = orgInfo.contactPhone;
        } else {
            this.taxincome.buName = null;
            this.taxincome.buCode = null;
            this.taxincome.buAddress = null;
            this.taxincome.buTaxcode = null;
            this.taxincome.buPhone = null;
        }
    }

    async patternChange(value): Promise<void> {
        const patternId = Number(value);
        this.selectedSerial = -1;
        this.listSerial = [];
        if (patternId !== -1) {
            await this.getDefaultSerial(this.taxincome.buTaxcode, value);
        }
    }

    async getDefaultSerial(buTaxcode, pattern): Promise<void> {
        // Serial
        const responseSerial = await this.store.getListSerial(buTaxcode, pattern);
        // Lấy giá trị đầu tiên của list serial nếu list serial = 1 và giá trị item đầu khác null
        if (this.utils.checkISArray(responseSerial)) {
            this.listSerial = responseSerial;
            if (this.listSerial.length === 1 && this.listSerial[0]) {
                this.selectedSerial = this.listSerial[0];
            }
        }
    }

    dateChange(evt: any): void {
        if (evt.value && evt.value.getTime()) {
            const dateF = this.utils.formatDatePattern(evt.value.getTime(), this.getFormatDatePatternByLanguage());
            this.empIdnoIssuedDate = dateF;
        } else {
            this.empIdnoIssuedDate = evt;
        }
    }

    private formatDataBeforeSave(): void {
        // Format some data
        const date: any = moment(this.empIdnoIssuedDate, this.getFormatDatePatternByLanguage());
        this.taxincome.empIdnoIssuedDate = date._d.getTime();
        this.taxincome.buId = this.selectedOrg;
        this.taxincome.pattern = this.selectedPattern;
        this.taxincome.serial = this.selectedSerial;
    }

    private parseNumber(value: any): any {
        if (!value) {
            if (value === 0) {
                return 0;
            }
            return null;
        }
        return Number(value.replace(/\./g, ''));
    }

    private validTaxIncome(fields): boolean {
        if (!this.validBuid()) {
            return false;
        }
        if (!this.validPattern()) {
            return false;
        }
        if (!this.validSerial()) {
            return false;
        }
        for (let index = 0; index < fields.length; index++) {
            const field = this.taxIncomeFieldRequire[index];
            const element: any = document.getElementById(field.key);
            this.clearErrors(element);
            if (!this.taxincome[field.key] || (field.type === 'text' && this.taxincome[field.key].trim().length === 0)) {
                this._utilsCom.openSnackBar(`Vui lòng nhập ${field.name}.`, 'error');
                element['style']['borderBottom'] = '1px solid red';
                element.focus();
                return false;
            }
        }
        if (!this.validEmpTaxcode()) {
            return false;
        }
        // Valid ngày cấp
        if (!this.validEmpIdnoIssuedDate()) {
            return false;
        }
        if (!this.validEmpPayFromToMonth()) {
            return false;
        }
        return true;
    }

    private validEmpTaxcode(): boolean {
        const element: any = document.getElementById('empTaxcode');
        const elementIdno: any = document.getElementById('empIdno');
        const elementIdnoIssuedPlace: any = document.getElementById('empIdnoIssuedPlace');
        this.clearErrors(element, elementIdno, elementIdnoIssuedPlace);
        // Vui lòng nhập Mã số thuế hoặc Số CMND/CCCD/Passport
        if (!this.taxincome.empTaxcode && !this.taxincome.empIdno) {
            this._utilsCom.openSnackBar('Vui lòng nhập Mã số thuế hoặc Số CMND/CCCD/Passport ', 'error');
            return false;
        }
        // Trường hợp nhập mã số thuế
        if (this.taxincome.empTaxcode) {
            // Nếu nhập mã số thuế thì kiểm tra 10 hoặc 14 kí tự
            if (this.taxincome.empTaxcode.trim().length === 10) {
                // return true;
            } else if (this.taxincome.empTaxcode.trim().length === 14 && this.taxincome.empTaxcode[10] === '-') {
                // return true;
            }
            else {
                this._utilsCom.openSnackBar('Mã số thuế không đúng định dạng (xxxxxxxxxx-xxx / xxxxxxxxxx).', 'error');
                element['style']['borderBottom'] = '1px solid red';
                element.focus();
                return false;
            }
            // Valid Số CMND nếu có nhập
            if (this.taxincome.empIdno && this.taxincome.empIdno.length > 0 && this.taxincome.empIdno.length < 8) {
                this._utilsCom.openSnackBar('Số CMND/CCCD/Passport từ 8 đến 12 ký tự', 'error');
                elementIdno['style']['borderBottom'] = '1px solid red';
                elementIdno.focus();
                return false;
            }
            return true;
        } else {
            // Trường hợp không có mã số thuế thì kiểm tra thông tin cá nhân theo 3 chỉ tiêu dưới đây:
            // Valid Số CMND
            if (!this.taxincome.empIdno || this.taxincome.empIdno.trim().length === 0) {
                this._utilsCom.openSnackBar('Vui lòng nhập Số CMND/CCCD/Passport', 'error');
                elementIdno['style']['borderBottom'] = '1px solid red';
                elementIdno.focus();
                return false;
            } else if (this.taxincome.empIdno.trim().length < 8) {
                this._utilsCom.openSnackBar('Số CMND/CCCD/Passport từ 8 đến 12 ký tự', 'error');
                elementIdno['style']['borderBottom'] = '1px solid red';
                elementIdno.focus();
                return false;
            }
            // Valid nơi cấp
            // if (!this.taxincome.empIdnoIssuedPlace || this.taxincome.empIdnoIssuedPlace.trim().length === 0) {
            //     this._utilsCom.openSnackBar('Vui lòng nhập nơi cấp', 'error');
            //     elementIdnoIssuedPlace['style']['borderBottom'] = '1px solid red';
            //     elementIdnoIssuedPlace.focus();
            //     return false;
            // }
            return true;
        }
    }

    private validEmpIdnoIssuedDate(): boolean {
        const element: any = document.getElementById('empIdnoIssuedDate');
        this.clearErrors(element);
        if (this.empIdnoIssuedDate === '__/__/____' || !this.empIdnoIssuedDate) {
            return true;
        }
        const date: any = moment(this.empIdnoIssuedDate, this.getFormatDatePatternByLanguage());
        if (!this.utils.checkIsNumber(date._d.getTime())) {
            this._utilsCom.openSnackBar('Ngày cấp không hợp lệ.', 'error');
            // element['style']['borderBottom'] = '1px solid red';
            element.focus();
            return false;
        }
        return true;
    }

    private validBuid(): boolean {
        const element: any = document.getElementById('buId');
        this.clearErrors(element);
        if (Number(this.selectedOrg) === -1) {
            this._utilsCom.openSnackBar('Vui lòng chọn tổ chức trả thu nhập.', 'error');
            element['style']['borderBottom'] = '1px solid red';
            element.focus();
            return false;
        }
        return true;
    }

    private validPattern(): boolean {
        const element: any = document.getElementById('pattern');
        this.clearErrors(element);
        if (this.isNotExistPattern) {
            this._utilsCom.openSnackBar('Mẫu số không còn tồn tại. Vui lòng chọn mẫu số khác.', 'error');
            element['style']['borderBottom'] = '1px solid red';
            element.focus();
            return false;
        }
        if (!this.selectedPattern || Number(this.selectedPattern) === -1) {
            this._utilsCom.openSnackBar('Vui lòng chọn mẫu số.', 'error');
            element['style']['borderBottom'] = '1px solid red';
            element.focus();
            return false;
        }
        return true;
    }

    private validSerial(): boolean {
        const element: any = document.getElementById('serial');
        this.clearErrors(element);
        if (this.isNotExistSerial) {
            this._utilsCom.openSnackBar('Ký hiệu không còn tồn tại. Vui lòng chọn ký hiệu khác.', 'error');
            element['style']['borderBottom'] = '1px solid red';
            element.focus();
            return false;
        }
        if (!this.selectedSerial || Number(this.selectedSerial) === -1) {
            this._utilsCom.openSnackBar('Vui lòng chọn ký hiệu.', 'error');
            element['style']['borderBottom'] = '1px solid red';
            element.focus();
            return false;
        }
        return true;
    }

    private validEmpPayFromToMonth(): boolean {
        const from: any = document.getElementById('empPayFromMonth');
        const to: any = document.getElementById('empPayToMonth');
        this.clearErrors(from, to);
        if (this.taxincome.empPayFromMonth >= this.taxincome.empPayToMonth) {
            this._utilsCom.openSnackBar('Tháng bắt đầu trả thu nhập phải nhỏ hơn tháng kết thúc.', 'error');
            from['style']['borderBottom'] = '1px solid red';
            from.focus();

            to['style']['borderBottom'] = '1px solid red';
            return false;
        }
        return true;
    }

    private clearErrors(...elements: any[]): void {
        for (let element of elements) {
            if (element) {
                if (element.srcElement) {
                    element = element.srcElement;
                }
                if (element.style) {
                    element['style']['borderBottom'] = '';
                }
            }
        }
    }

    private createListOfYears(currentYear, numberOfYear): any[] {
        const backToTwoYears = currentYear - 2;
        const listOfYear = [];
        for (let i = 0; i < numberOfYear; ++i) {
            const value = backToTwoYears + i;
            listOfYear.push(
                {
                    code: value,
                    name: value
                }
            );
        }
        return listOfYear;
    }

    private createListMonth(): any[] {
        const listMonth = [];
        for (let i = 0; i < 12; ++i) {
            listMonth.push(
                {
                    code: i + 1,
                    name: i + 1
                }
            );
        }
        return listMonth;
    }
}
