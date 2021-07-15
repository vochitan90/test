import { Component, OnInit } from '@angular/core';
import { AppState, UtilCommon, UtilComponent } from 'app/main/shared';
import * as moment from 'moment';
import { ListOfUsageStore } from '../list-of-usage.store';
import { IRevonue, IRevonueRuntimeValue, IRuntimeValueParam } from '../models/revonue.interface';

@Component({
    selector: 'app-revonue',
    templateUrl: './revonue.component.html',
    styleUrls: ['./revonue.component.scss']
})
export class RevonueComponent implements OnInit {

    amountOfYear = 5;

    lstTypeYear: any = [];
    typeYear: any;

    lstYear: any = [];
    lstMonth: any = [];
    lstPrecious: any = [];
    data: any = { fromDate: null, toDate: null, month: null, precious: null, year: null };

    //
    listBU: any[] = [];
    selectBU: any = -1;

    listPattern: any[] = [];
    selectPattern: any = -1;

    listSerial: any[] = [];
    selectSerial: any = -1;

    constructor(
        private appState: AppState,
        public store: ListOfUsageStore,
        private _utilsCom: UtilComponent,
        private _utils: UtilCommon,
        private _appState: AppState
    ) {

    }

    async ngOnInit(): Promise<void> {
        try {
            this.lstTypeYear = [
                {
                    code: '1',
                    name: 'Khoảng thời gian'
                }, {
                    code: '2',
                    name: 'Tháng'
                },
                {
                    code: '3',
                    name: 'Quý'
                },
                {
                    code: '5',
                    name: 'Năm'
                }
            ];
            this.typeYear = '1';
            this.lstYear = this.createListOfYears(new Date().getFullYear(), this.amountOfYear);
            this.lstMonth = [];
            for (let index = 1; index <= 12; index++) {
                this.lstMonth.push({ code: index, name: 'Tháng ' + index });
            }

            this.lstPrecious = [
                {
                    code: '1',
                    name: 'Quý 1'
                },
                {
                    code: '2',
                    name: 'Quý 2'
                }, {
                    code: '3',
                    name: 'Quý 3'
                },
                {
                    code: '4',
                    name: 'Quý 4'
                }
            ];
            const response = await this.store.getListBusinessUnitActiveForUser();
            if (this._utils.checkISArray(response)) {
                this.listBU = response;
            }
        }
        catch (err: any) {
            console.log(err);
        }
    }

    async orgChange(event): Promise<void> {
        this.selectPattern = -1;
        this.selectSerial = -1;
        this.listPattern = [];
        this.listSerial = [];
        const buId = Number(event.value);
        if (buId !== -1) {
            const orgInfo = this.listBU.find(item => item.id === buId);
            const response = await this.store.getListPatternByBuTaxCode(orgInfo.taxcode);
            if (this._utils.checkISArray(response)) {
                this.listPattern = response;
                // Lấy giá trị đầu tiên của lsit pattern nếu list pattern = 1 và giá trị item đầu khác null
                if (this.listPattern.length === 1 && this.listPattern[0]) {
                    this.selectPattern = this.listPattern[0];
                    await this.getDefaultSerial(orgInfo.taxcode, this.selectPattern);
                }
            }
        }
    }

    async patternChange(event): Promise<void> {
        const patternId = Number(event.value);
        this.selectSerial = -1;
        this.listSerial = [];
        if (patternId !== -1) {
            const orgInfo = this.listBU.find(item => item.id === this.selectBU);
            await this.getDefaultSerial(orgInfo.taxcode, event.value);
        }
    }

    async getDefaultSerial(buTaxcode, pattern): Promise<void> {
        // Serial
        const responseSerial = await this.store.getListSerial(buTaxcode, pattern);
        // Lấy giá trị đầu tiên của list serial nếu list serial = 1 và giá trị item đầu khác null
        if (this._utils.checkISArray(responseSerial)) {
            this.listSerial = responseSerial;
            if (this.listSerial.length === 1 && this.listSerial[0]) {
                this.selectSerial = this.listSerial[0];
            }
        }
    }

    private getFormatDatePatternByLanguage(): string {
        let pattern = '';
        switch (this.appState.getLanguage()) {
            case 'vi':
                pattern = 'DD/MM/YYYY';
                break;
            case 'en':
                pattern = 'MM/DD/YYYY';
                break;
            default:
                break;
        }
        return pattern;
    }

    private getFormatDatePatternByLanguage2(): string {
        let pattern = '';
        switch (this.appState.getLanguage()) {
            case 'vi':
                pattern = 'dd/MM/yyyy';
                break;
            case 'en':
                pattern = 'MM/dd/yyyy';
                break;
            default:
                break;
        }
        return pattern;
    }

    exportPdf(): void {
        this.excel('PDF');
    }

    exportReport(): void {
        this.excel('XLSX');
    }

    createListOfYears(currentYear, numberOfYear): any[] {
        const backToTwoYears = currentYear - 2;
        const listOfYear = [];
        for (let i = 0; i < numberOfYear; ++i) {
            const value = backToTwoYears + i;
            listOfYear.push(
                {
                    code: value, name: 'Năm ' + (value).toString()
                }
            );

        }
        return listOfYear;
    }

    dateChange(field: string, evt: any): void {
        if (evt.value && evt.value.getTime()) {
            const dateF = this._utils.formatDatePattern(evt.value.getTime(), this.getFormatDatePatternByLanguage());
            this.data[field] = dateF;
        } else {
            this.data[field] = evt;
        }
    }

    validExport(): boolean {
        if (!this.typeYear) {
            this._utilsCom.openSnackBar('Chưa chọn loại thời gian', 'error');
            return false;
        } else {
            if (this.typeYear === '1') {
                const fromDate: any = moment(this.data.fromDate, this.getFormatDatePatternByLanguage());
                const timeForm = fromDate._d.getTime();
                if (!this._utils.checkIsNumber(timeForm)) {
                    this._utilsCom.openSnackBar('Từ ngày không hợp lệ.', 'error');
                    return false;
                }
                const toDate: any = moment(this.data.toDate, this.getFormatDatePatternByLanguage());
                const timeTo = toDate._d.getTime();
                if (!this._utils.checkIsNumber(timeTo)) {
                    this._utilsCom.openSnackBar('Đến ngày không hợp lệ.', 'error');
                    return false;
                }

                if (fromDate >= toDate) {
                    this._utilsCom.openSnackBar('Từ ngày phải nhỏ hơn Đến ngày.', 'error');
                    return false;
                }
            } else if (this.typeYear === '2') {
                if (!this.data.month) {
                    this._utilsCom.openSnackBar('Chưa chọn tháng', 'error');
                    return false;
                }
                if (!this.data.year) {
                    this._utilsCom.openSnackBar('Chưa chọn năm', 'error');
                    return false;
                }
            } else if (this.typeYear === '3') {
                // quy
                if (!this.data.precious) {
                    this._utilsCom.openSnackBar('Chưa chọn quý', 'error');
                    return false;
                }
                if (!this.data.year) {
                    this._utilsCom.openSnackBar('Chưa chọn năm', 'error');
                    return false;
                }
            } else if (this.typeYear === '4') {

            } else if (this.typeYear === '5') {
                const year = this.data.year;
                if (!this.data.year) {
                    this._utilsCom.openSnackBar('Chưa chọn năm', 'error');
                    return false;
                }
            }
        }

        if (this.selectBU === -1) {
            this._utilsCom.showTranslateSnackbar('BUSINESS_UNIT_REQUIRED', 'error');
            return false;
        }
        if (!this.selectPattern) {
            this._utilsCom.openSnackBar('Mẫu số không hợp lệ', 'error');
            return false;
        }
        if (!this.selectSerial) {
            this._utilsCom.openSnackBar('Ký hiệu không hợp lệ', 'error');
            return false;
        }
        // if (!this.selectPattern || this.selectPattern === -1) {
        //     this._utilsCom.showTranslateSnackbar('PATTERN_REQUIRED', 'error');
        //     return false;
        // }
        // if (!this.selectSerial || this.selectSerial === -1) {
        //     this._utilsCom.showTranslateSnackbar('SERIAL_REQUIRED', 'error');
        //     return false;
        // }

        return true;
    }

    excel(exportFormat): void {
        const formatDate = this.getFormatDatePatternByLanguage();
        const format = this.getFormatDatePatternByLanguage2();
        let fromDateFormat, toDateFormat;
        let reportTime, description, time;

        description = 'Kỳ lập báo cáo - ';
        if (!this.validExport()) {
            return;
        }

        if (this.typeYear === '1') {
            // Khoảng thời gian
            const fromDate: any = moment(this.data.fromDate, formatDate);
            const toDate: any = moment(this.data.toDate, formatDate);

            fromDateFormat = this._utils.formatDatePattern(fromDate._d.getTime(), formatDate);
            toDateFormat = this._utils.formatDatePattern(toDate._d.getTime(), formatDate);

            const timeFrom = this._utils.formatDatePattern(fromDate._d.getTime(), 'DD-MM-YYYY');
            const timeTo = this._utils.formatDatePattern(toDate._d.getTime(), 'DD-MM-YYYY');
            // reportTime = this._utils.formatDatePattern(fromDate._d.getTime(), 'YYY-MM-DD') + '_' + this._utils.formatDatePattern(toDate._d.getTime(), 'YYY-MM-DD');
            reportTime = timeFrom + '_' + timeTo;
            time = 'Từ ngày: ' + timeFrom + ' Đến ngày: ' + timeTo;
        } else if (this.typeYear === '2') {
            // thang
            const month = this.data.month;
            const year = this.data.year;
            const fromDate = new Date(year, month - 1, 1);
            const toDate = new Date(year, month, 0);
            fromDateFormat = this._utils.formatDatePattern(fromDate.getTime(), formatDate);
            toDateFormat = this._utils.formatDatePattern(toDate.getTime(), formatDate);
            reportTime = 'Thang_' + month + '-' + year;
            time = 'Tháng ' + month + ' năm ' + year;
        } else if (this.typeYear === '3') {
            // quy
            const year = this.data.year;
            const precious = this.data.precious;
            let fromMonth, toMonth;
            if (precious === '1') {
                fromMonth = 1;
                toMonth = 3;

            } else if (precious === '2') {
                fromMonth = 4;
                toMonth = 6;
            } else if (precious === '3') {
                fromMonth = 7;
                toMonth = 9;
            } else if (precious === '4') {
                fromMonth = 10;
                toMonth = 12;
            }

            reportTime = 'Quy_' + precious + '-' + year;
            const fromDate = new Date(year, fromMonth - 1, 1);
            const toDate = new Date(year, toMonth, 0);

            fromDateFormat = this._utils.formatDatePattern(fromDate.getTime(), formatDate);
            toDateFormat = this._utils.formatDatePattern(toDate.getTime(), formatDate);
            time = 'Quý ' + precious + ' năm ' + year;
        } else if (this.typeYear === '4') {

        } else if (this.typeYear === '5') {
            const year = this.data.year;
            // const fromDate = new Date(year, 1, 1);
            const fromDate = new Date(year, 0, 1);
            const toDate = new Date(year + 1, 0, 0);

            fromDateFormat = this._utils.formatDatePattern(fromDate.getTime(), formatDate);
            toDateFormat = this._utils.formatDatePattern(toDate.getTime(), formatDate);
            reportTime = 'Nam_' + year;
            time = 'Năm ' + year;
        }
        description = description + time;
        const buInfo = this.listBU.find(item => item.id === this.selectBU);
        const tenantCode = this._appState.appState.moreInfo.tenantCode;
        const appCode = this._appState.appState.moreInfo.appCode;
        const username = this._appState.appState.username;

        const reportFileName = 'BANGKE_TINHHINH_SUDUNG_' + reportTime;

        const dataRevonue: IRevonue = {
            companyCode: tenantCode,
            appCode: appCode,
            reportName: reportFileName,
            description: description,
            status: 0,
            makerId: username,
            runtimeValue: null
        };


        const runtimeValue: IRevonueRuntimeValue = {
            companyCode: tenantCode,
            appCode: appCode,
            reportName: 'ETAX_RP001_BANGKE-TINHHINH-SUDUNG.jasper',
            exportFormat,
            params: null
        };

        const runtimeParams: IRuntimeValueParam = {};
        runtimeParams.PM_TENANT_CODE = { 'type': 'java.lang.String', 'format': null, 'value': tenantCode };
        runtimeParams.PM_BU_CODE = { 'type': 'java.lang.String', 'format': null, 'value': buInfo.code };

        runtimeParams.PM_FROM_DATE = { 'type': 'java.util.Date', 'format': format, 'value': fromDateFormat };
        runtimeParams.PM_TO_DATE = { 'type': 'java.util.Date', 'format': format, 'value': toDateFormat };

        const pattern = this.selectPattern === -1 ? 'ALL' : this.selectPattern;
        const serial = this.selectSerial === -1 ? 'ALL' : this.selectSerial;
        runtimeParams.PM_PATTERN = { 'type': 'java.lang.String', 'format': null, 'value': pattern };
        runtimeParams.PM_SERIAL = { 'type': 'java.lang.String', 'format': null, 'value': serial };

        runtimeParams.PM_TAX_PERIOD = {
            'type': 'java.lang.String',
            'format': format,
            'value': time
        };

        runtimeValue.params = runtimeParams;
        dataRevonue.runtimeValue = runtimeValue;

        this.store.isLoading = true;
        this.store.createRuntimeWithExport(dataRevonue).then(data => {
            this.store.handleGetDataFromReport(data, this._utilsCom, () => {
                this.store.isLoading = false;
            }, reportFileName);
        }).catch(err => {
            this.store.isLoading = false;
            this._utilsCom.openSnackBar('Xuất báo cáo thất bại', 'error');
        });
    }

}
