import { Injectable } from '@angular/core';
import { ACTION, APP_CONSTANT, COMPONENT_CONSTANT, SCREEN_CONSTANT } from 'app/main/shared/const/app.constant';
import { FN_NAMES } from 'app/main/shared/const/Permission';
import { BaseStoreService } from 'app/main/shared/utils/BaseStoreService';
import { AppState, UtilCommon, UtilComponent } from '../../shared';
import { IConfirmIncomeTax } from './models/confirm-income-tax';
import { CONFIRM_INCOME_TAX_CONSTANT } from './confirm-income-tax.constant';
import { ConfirmIncomeTaxService } from './confirm-income-tax.service';
import { transformRequestBeforeQuery } from 'app/main/shared/utils/GridService';

// @Injectable({
//     providedIn: 'root'
// })
@Injectable()
export class ConfirmIncomeTaxStore extends BaseStoreService {
    public isFirstEnterSreen = true;
    public isRowSelected = false;
    selectedBuIdNew = -1;

    public gridConfigs: any = {
        editColDefs: {
            // seeAllOldVersion: {
            //     valueFormatter: (params) => {
            //         return 'Xem';
            //     }
            // },
            // authStatus: {
            //     valueFormatter: (params) => {
            //         if (params && params.value) {
            //             return params.context.parent._translateService.instant("AUTH_STATUS." + params.value);
            //         }
            //     }
            // },
            recordStatus: {
                cellRenderer: (params) => {
                    let status = '';
                    switch (params.value) {
                        case 'O':
                            status = "Chưa hủy"
                            break;
                        case 'C':
                            status = "Đã hủy"
                            break;
                    }
                    return status;
                }
            },
            status: {
                cellRenderer: (params) => {
                    let status = "";
                    switch (params.value) {
                        case 0:
                            status = "Lưu nháp";
                            break;
                        case 1:
                            status = "Đã phát hành";
                            break;
                    }
                    return status;
                }
            },
            empPayYear: {
                valueFormatter: (params) => {
                    return params.value;
                }
            }

        },
        delCols: this.delCols(),
        colsOrder: {

            [CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_PAY_YEAR]: 1,
            [CONFIRM_INCOME_TAX_CONSTANT.COLUMN.BU_NAME]: 2,
            [CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_NAME]: 3,
            [CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_JOB_TITLE]: 4,
            [CONFIRM_INCOME_TAX_CONSTANT.COLUMN.STATUS]: 5,        
            [CONFIRM_INCOME_TAX_CONSTANT.COLUMN.MAKER_DATE]: 6,
            [CONFIRM_INCOME_TAX_CONSTANT.COLUMN.MAKER_ID]: 7,

        },
        visibleCols: [

            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_PAY_YEAR,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.BU_NAME,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_NAME,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_JOB_TITLE,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.STATUS,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.MAKER_DATE,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.MAKER_ID
            
        ],
        exportCols: [
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_PAY_YEAR,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.BU_NAME,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_NAME,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_JOB_TITLE,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.STATUS,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.MAKER_DATE,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.MAKER_ID    
        ],
    };

    delCols(): any {
        return [
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.RECORD_STATUS,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.LETTER_AGG_ID,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.AUTH_STATUS,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.BU_ADDRESS,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.BU_CODE,

            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.BU_EMAIL,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.BU_CODE,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.BU_ID,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.BU_PHONE,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.BU_TAXCODE,

            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.CHECKER_DATE,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.CHECKER_ID,


            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.CONTRACT_DATE,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.CONTRACT_NO,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.DESCRIPTION,

            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_CODE,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_INCOME_FOREIGN,
            
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_IMCOME_FOREIGN_WITH_HELD,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_INCOME_TOTAL,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_INCOME_VN,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_INSURANCE_WITH_HELD,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_OTHER_WITH_HELD,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_PAY_FROM_DATE,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_PAY_TO_DATE,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_RENT,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_TAXCODE,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_TAX_INCOME_WITH_HELD,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.FTS_VALUE,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.ID,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.ISSUE_DATE,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.MOD_NO,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.NOTE,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.TAX_INCOMDE_LETTER_CODE,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.TENANT_CODE,
            CONFIRM_INCOME_TAX_CONSTANT.COLUMN.VIETNAM_WORK_DATE,
            //CONFIRM_INCOME_TAX_CONSTANT.COLUMN.EMP_NAME,


        ];
    }

    constructor(
        public confirmIncomeTaxService: ConfirmIncomeTaxService,
        private _utilCmp: UtilComponent,
        public _utils: UtilCommon,
        public _appState: AppState) {
        super(confirmIncomeTaxService, _utils, _appState);
    }

    getListBusinessUnitActiveForUser(): Promise<any> {
        return this.confirmIncomeTaxService.getListBusinessUnitActiveForUser();
    }

    async createCIT(data) {
        try {
            const dataFile = await this.confirmIncomeTaxService.createCIT(data);
            if (!this._utils.checkIsNotNull(dataFile)) {
                this._utilCmp.showTranslateSnackbar('SAVE_SUCCESS');
                return true;
            }
            if (this._utilCmp.checkValidationErrorSubmit(dataFile, "Đăng ký phát hành")) {
                return null;
            }
            this._utilCmp.showTranslateSnackbar('SAVE_FAIL', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
            return null;
        } catch (error) {
            this._utilCmp.showTranslateSnackbar('SAVE_FAIL', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
            return null;
        }
    }

    async updateCIT(data) {
        try {
            const resData = await this.confirmIncomeTaxService.updateCIT(data);
            if (!this._utils.checkIsNotNull(resData)) {
                this._utilCmp.showTranslateSnackbar('UPDATE_SUCCESS');
                return true;
            }
            // if(this._utilCmp.checkValidationErrorSubmit(dataFile, "Đăng ký phát hành")){
            //     return null;
            // }
            this._utilCmp.showTranslateSnackbar('UPDATE_FAIL', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
            return null;
        } catch (error) {
            this._utilCmp.showTranslateSnackbar('UPDATE_FAIL', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
            return null;
        }
    }

    async approveCIT(id) {
        const data = {
            "id": id,
        };
        try {
            const resData = await this.confirmIncomeTaxService.approveRR(data);
            if (!this._utils.checkIsNotNull(resData)) {
                this._utilCmp.showTranslateSnackbar('APPROVE_SUCCESS');
                return true;
            }
            this._utilCmp.showTranslateSnackbar('APPROVE_FAIL', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
            return null;
        } catch (error) {
            this._utilCmp.showTranslateSnackbar('APPROVE_FAIL', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
            return null;
        }
    }

    // START OVERRIDE
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


}
