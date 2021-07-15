import { Injectable } from '@angular/core';
import { AppState, UtilCommon, UtilComponent } from 'app/main/shared';
import { FN_NAMES } from 'app/main/shared/const/Permission';
import { BaseStoreService } from 'app/main/shared/utils/BaseStoreService';
import { GRID_ATTRIBUTES, transformRequestBeforeQuery } from 'app/main/shared/utils/GridService';
import * as _ from 'lodash';
import { ITaxIncome, ITaxIncomeCancel, ITaxIncomeReplace, ITaxIncomeUpload } from './models/taxIncome.interface';
import { TAX_INCOME_CONSTANT } from './taxIncome.constant';
import { TaxIncomeService } from './taxIncome.service';
// @Injectable({
//     providedIn: 'root'
// })
@Injectable()
export class TaxIncomeStore extends BaseStoreService {
    public isFirstEnterSreen = true;
    public selectedBuIdNew = -1;
    public selectedBuIdCancel = -1;
    public selectedBuIdIssue = -1;
    public isRowSelected = false;
    public gridConfigs: any = {
        editColDefs: {
            taxincomeNo: {
                cellRenderer: (params) => {
                    let value = 'Chờ cấp số';
                    if (params.value) {
                        value = params.value;
                    }
                    return `<span style="color:#039be5">${value}</span>`;
                }
            },
            status: {
                cellRenderer: (params) => {
                    let status = '';
                    switch (params.value) {
                        case 0:
                            status = 'Mới lập';
                            break;
                        case 1:
                            status = 'Phát hành';
                            break;
                        case 2:
                            status = 'Hủy';
                            break;
                        case 3:
                            status = 'Thay thế';
                            break;
                        case 4:
                            status = 'Đã thay thế';
                            break;
                        default:
                            break;
                    }
                    return `<span >${status}</span>`;
                }

            }
        },
        delCols: this.delCols(),
        // Số chứng từ, Ngày chứng từ, Ký hiệu, Tổ chức trả thu nhập,
        // Tên người nộp thuế, Thu nhập chịu thuế, Trạng thái, Ngày cập nhật cuối, Cập nhật bởi
        colsOrder: {
            [TAX_INCOME_CONSTANT.COLUMN.TAXINCOME_NO]: 1,
            [TAX_INCOME_CONSTANT.COLUMN.ISSUED_DATE]: 2,
            [TAX_INCOME_CONSTANT.COLUMN.SERIAL]: 3,
            [TAX_INCOME_CONSTANT.COLUMN.BU_NAME]: 4,
            [TAX_INCOME_CONSTANT.COLUMN.EMP_NAME]: 5,
            [TAX_INCOME_CONSTANT.COLUMN.EMP_TAXINCOME_CALCULATION]: 6,
            [TAX_INCOME_CONSTANT.COLUMN.STATUS]: 7,
            [TAX_INCOME_CONSTANT.COLUMN.MAKER_DATE]: 8,
            [TAX_INCOME_CONSTANT.COLUMN.MAKER_ID]: 9,
        },
        visibleCols: [
            TAX_INCOME_CONSTANT.COLUMN.TAXINCOME_NO,
            TAX_INCOME_CONSTANT.COLUMN.ISSUED_DATE,
            TAX_INCOME_CONSTANT.COLUMN.SERIAL,
            TAX_INCOME_CONSTANT.COLUMN.BU_NAME,
            TAX_INCOME_CONSTANT.COLUMN.EMP_NAME,
            TAX_INCOME_CONSTANT.COLUMN.EMP_TAXINCOME_CALCULATION,
            TAX_INCOME_CONSTANT.COLUMN.STATUS,
            TAX_INCOME_CONSTANT.COLUMN.MAKER_DATE,
            TAX_INCOME_CONSTANT.COLUMN.MAKER_ID,
        ],
        exportCols: [

        ],
    };

    constructor(
        public taxIncomeService: TaxIncomeService,
        private _utilCmp: UtilComponent,
        public _utils: UtilCommon,
        public _appState: AppState) {
        super(taxIncomeService, _utils, _appState);
    }

    initPemision(): void {
        if (!this._utils.checkIsNotNull(this.permissions)) {
            this.permissions = {
                create: this._appState.hasPermission(FN_NAMES.ACCOUNT_CREATE) || this._appState.hasPermission(FN_NAMES.ACCOUNT_CREATE_QTSC),
                delete: this._appState.hasPermission(FN_NAMES.ACCOUNT_DELETE) || this._appState.hasPermission(FN_NAMES.ACCOUNT_DELETE_QTSC),
                export: this._appState.hasPermission(FN_NAMES.ACCOUNT_EXPORT) || this._appState.hasPermission(FN_NAMES.ACCOUNT_EXPORT_QTSC),
                share: this._appState.hasPermission(FN_NAMES.IDL_SHARE_ACCOUNT) || this._appState.hasPermission(FN_NAMES.IDL_SHARE_ACCOUNT_QTSC)
            };
        }
    }

    delColsIssuedDate(): any {
        const delCol = this.delCols();
        delCol.push(TAX_INCOME_CONSTANT.COLUMN.ISSUED_DATE);
        return delCol;
    }

    delCols(): any {
        return [
            TAX_INCOME_CONSTANT.COLUMN.EMP_CONTACT_ADDRESS,
            TAX_INCOME_CONSTANT.COLUMN.EMP_CONTACT_PHONE,
            TAX_INCOME_CONSTANT.COLUMN.EMP_INCOME_TYPE,
            TAX_INCOME_CONSTANT.COLUMN.EMP_NATIONALITY,
            TAX_INCOME_CONSTANT.COLUMN.EMP_PAY_FROM_MONTH,
            TAX_INCOME_CONSTANT.COLUMN.EMP_PAY_TO_MONTH,
            TAX_INCOME_CONSTANT.COLUMN.EMP_TAXINCOME_WITHHELD,
            TAX_INCOME_CONSTANT.COLUMN.EMP_IDNO,
            TAX_INCOME_CONSTANT.COLUMN.EMP_PERSONALTAX_WITHHELD,
            TAX_INCOME_CONSTANT.COLUMN.FTS_VALUE,
            TAX_INCOME_CONSTANT.COLUMN.BU_ID,
            TAX_INCOME_CONSTANT.COLUMN.BU_PHONE,
            TAX_INCOME_CONSTANT.COLUMN.BU_CODE,
            TAX_INCOME_CONSTANT.COLUMN.BU_EMAIL,
            TAX_INCOME_CONSTANT.COLUMN.NOTE,
            TAX_INCOME_CONSTANT.COLUMN.PATTERN,
            TAX_INCOME_CONSTANT.COLUMN.DESCRIPTION,
            TAX_INCOME_CONSTANT.COLUMN.EMPIDNO_ISSUEDDATE,
            TAX_INCOME_CONSTANT.COLUMN.EMP_TAX_CODE,
            TAX_INCOME_CONSTANT.COLUMN.TENANT_CODE,
            TAX_INCOME_CONSTANT.COLUMN.BU_ADDRESS,
            TAX_INCOME_CONSTANT.COLUMN.MOD_NO,
            TAX_INCOME_CONSTANT.COLUMN.EMP_PAY_FROMDATE,
            TAX_INCOME_CONSTANT.COLUMN.EMP_IDNO_ISSUED_PLACE,
            TAX_INCOME_CONSTANT.COLUMN.CHECKER_DATE,
            TAX_INCOME_CONSTANT.COLUMN.ID,
            TAX_INCOME_CONSTANT.COLUMN.EMP_PAY_TODATE,
            TAX_INCOME_CONSTANT.COLUMN.EMP_PAY_YEAR,
            TAX_INCOME_CONSTANT.COLUMN.BU_TAX_CODE,
            TAX_INCOME_CONSTANT.COLUMN.RECORD_STATUS,
            TAX_INCOME_CONSTANT.COLUMN.EMP_CODE,
            TAX_INCOME_CONSTANT.COLUMN.CHECKER_ID,
            TAX_INCOME_CONSTANT.COLUMN.EMP_IS_RESIDENT,
            TAX_INCOME_CONSTANT.COLUMN.AGG_ID,
            TAX_INCOME_CONSTANT.COLUMN.AUTH_STATUS
        ];
    }

    getListBusinessUnitActiveForUser(): Promise<any> {
        return this.taxIncomeService.getListBusinessUnitActiveForUser();
    }

    getListPatternByBuTaxCode(buTaxCode): Promise<any> {
        return this.taxIncomeService.getListPatternByBuTaxCode(buTaxCode);
    }

    getListSerial(buTaxCode, pattern): Promise<any> {
        return this.taxIncomeService.getListSerial(buTaxCode, pattern);
    }

    getByAggid(getByAggid): Promise<any> {
        return this.taxIncomeService.getByAggid(getByAggid);
    }

    create(data: ITaxIncome): Promise<any> {
        return this.taxIncomeService.create(data);
    }

    update(data: ITaxIncome): Promise<any> {
        return this.taxIncomeService.update(data);
    }

    delete(ids: string[]): Promise<any> {
        return this.taxIncomeService.delete(ids);
    }

    issue(ids: string[]): Promise<any> {
        return this.taxIncomeService.issue(ids);
    }

    // START Override
    getAccountUserAttribute(attributeName?: string): Promise<any> {
        return this.workFlowService.getProcessUploadUserAttribute(attributeName).then(screenUserAttribute => {
            this.screenUserAttribute = screenUserAttribute || {};
            const { delCols = [] } = this.gridConfigs;
            if (this.delCols().length > 0) {
                for (const delCol of this.delCols()) {
                    delCols.push(delCol);
                }
            }
            if (this.screenUserAttribute.columnState) {
                if (delCols.length > 0) {
                    _.filter(this.screenUserAttribute.columnState, cs => delCols.indexOf(cs.colId) < 0);
                }
            }
            if (this.screenUserAttribute.normalFilterModel) {
                _.forEach(delCols, c => {
                    delete this.screenUserAttribute.normalFilterModel[c];
                });
            }

            this.lastRequest = this.screenUserAttribute.lastRequest || {};
            this.normalFilterModel = this.screenUserAttribute.normalFilterModel;
            this.columnState = this.screenUserAttribute.columnState;
            this.searchMode = this.screenUserAttribute.searchMode || 0;
            this.fullText = this.screenUserAttribute.fullText || '';
            return this.screenUserAttribute;
        });
    }

    saveAccountUserAttribute(obj: any, saveInStore: boolean = true, attributeName?: string): Promise<any> {
        if (saveInStore) {
            _.forEach(_.pick(obj, GRID_ATTRIBUTES), (value, key) => {
                this[key] = value;
            });
        }
        return this.workFlowService.setProcessUploadUserAttribute(attributeName, JSON.stringify({
            ...this.screenUserAttribute,
            ...obj,
        }));
    }

    pivotPaging(request: any): Promise<any> {
        this.normalFilterModel = request.filterModel;
        if (this.isFullTextSearchMode) {
            request = this.buildFullTexSearchRequest(request, this.fullText);
            // Fix bug get status filter từ  data source mỗi list
            request.filterModel.status = this.normalFilterModel.status;
            request.filterModel.buId = this.normalFilterModel.buId;
        }
        this.lastRequest = request;
        this.screenUserAttribute = this.buildGridAttribute();
        this.isLoading = true;

        return this.workFlowService.pivotPaging(transformRequestBeforeQuery(request))
            .then(data => {
                this.isLoading = false;
                return data;
            }).catch(error => {
                this.isLoading = false;
                throw error;
            });
    }
    // END Override

    downloadTaxIncome(aggId: string): Promise<any> {
        return this.taxIncomeService.downloadTaxIncome(aggId);
    }

    downloadResource(resourceId: string, isDocFile: boolean): Promise<any> {
        return this.taxIncomeService.downloadResource(resourceId, isDocFile);
    }

    cancel(data: ITaxIncomeCancel): Promise<any> {
        return this.taxIncomeService.cancel(data);
    }

    replace(data: ITaxIncomeReplace): Promise<any> {
        return this.taxIncomeService.replace(data);
    }

    processImportTaxincome(data: ITaxIncomeUpload): Promise<any> {
        return this.taxIncomeService.processImportTaxincome(data);
    }

    uploadFileTemp(file: File): Promise<any> {
        return this.taxIncomeService.uploadFileTemp(file);
    }
}
