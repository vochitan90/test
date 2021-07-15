import { Injectable } from '@angular/core';
import { APP_CONSTANT, COMPONENT_CONSTANT, SCREEN_CONSTANT } from 'app/main/shared/const/app.constant';
import { FN_NAMES } from 'app/main/shared/const/Permission';
import { BaseStoreService } from 'app/main/shared/utils/BaseStoreService';
import { ppid } from 'process';
import { AppState, UtilCommon, UtilComponent } from '../../shared';
import { RELEASE_REGISTRATION_CONSTANT } from './invoice-letter.constant';
import { ReleaseRegistrationService } from './invoice-letter.service';

// @Injectable({
//     providedIn: 'root'
// })
@Injectable()
export class ReleaseRegistrationStore extends BaseStoreService {
    public isFirstEnterSreen = true;
    public isRowSelected = false;
    public gridConfigs: any = {
        editColDefs: {
            // authStatus: {
            //     valueFormatter: (params) => {
            //         if (params && params.value) {
            //             return params.context.parent._translateService.instant('AUTH_STATUS.' + params.value);
            //         }
            //     }
            // },
            recordStatus: {
                // valueFormatter: (params) => {
                //     if (params && params.value) {
                //         return params.context.parent._translateService.instant('RECORD_STATUS.' + params.value);
                //     }
                // }

                cellRenderer: (params) => {
                    let status = '';
                    switch(params.value){
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
                            status = "Chờ xác nhận";
                            break;
                        case 1:
                            status = "Đã xác nhận";
                            break;
                        case 2:
                            status = "Đã ký";
                            break;
                    }
                    return status;
                }
            },
            issueYear: {
                valueFormatter: (params) => {
                    return params.value;
                }
            }
        },
        delCols: this.delCols(),
        colsOrder: {


            [RELEASE_REGISTRATION_CONSTANT.COLUMN.BU_NAME]: 1,
            [RELEASE_REGISTRATION_CONSTANT.COLUMN.ISSUE_YEAR]: 2,
            [RELEASE_REGISTRATION_CONSTANT.COLUMN.PATTERN]: 3,
            [RELEASE_REGISTRATION_CONSTANT.COLUMN.SERIAL]: 4,
            [RELEASE_REGISTRATION_CONSTANT.COLUMN.ISSUE_AMOUNT]: 5,

            [RELEASE_REGISTRATION_CONSTANT.COLUMN.STATUS]: 6,
            [RELEASE_REGISTRATION_CONSTANT.COLUMN.RECORD_STATUS]: 7,

            [RELEASE_REGISTRATION_CONSTANT.COLUMN.MAKER_DATE]: 8,
            [RELEASE_REGISTRATION_CONSTANT.COLUMN.MAKER_ID]: 9,



        },
        visibleCols: [

            RELEASE_REGISTRATION_CONSTANT.COLUMN.BU_NAME,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.BU_TAX_CODE,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.ISSUE_YEAR,

            RELEASE_REGISTRATION_CONSTANT.COLUMN.PATTERN,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.SERIAL,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.ISSUE_AMOUNT,
           
            RELEASE_REGISTRATION_CONSTANT.COLUMN.STATUS,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.RECORD_STATUS,
            
            RELEASE_REGISTRATION_CONSTANT.COLUMN.MAKER_ID,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.MAKER_DATE,
            

        ],
        exportCols: [

            // RELEASE_REGISTRATION_CONSTANT.COLUMN.BU_NAME,
            // RELEASE_REGISTRATION_CONSTANT.COLUMN.BU_TAX_CODE,
            // RELEASE_REGISTRATION_CONSTANT.COLUMN.ISSUE_YEAR,

            // RELEASE_REGISTRATION_CONSTANT.COLUMN.PATTERN,
            // RELEASE_REGISTRATION_CONSTANT.COLUMN.SERIAL,
            // RELEASE_REGISTRATION_CONSTANT.COLUMN.ISSUE_AMOUNT,
           
            // RELEASE_REGISTRATION_CONSTANT.COLUMN.STATUS,
            // RELEASE_REGISTRATION_CONSTANT.COLUMN.RECORD_STATUS,
            
            // RELEASE_REGISTRATION_CONSTANT.COLUMN.MAKER_ID,
            // RELEASE_REGISTRATION_CONSTANT.COLUMN.MAKER_DATE,

        ],
    };

    constructor(
        public releaseRegistrationService: ReleaseRegistrationService,
        private _utilCmp: UtilComponent,
        public _utils: UtilCommon,
        public _appState: AppState) {
        super(releaseRegistrationService, _utils, _appState);
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

    delCols(): any {
        return [
            RELEASE_REGISTRATION_CONSTANT.COLUMN.ID,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.MOD_NO,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.DESCRIPTION,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.DESCRIPTION,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.CHECKER_DATE,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.CHECKER_ID,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.TAX_PLACE,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.TENANT_CODE,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.DECISION_NO,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.AGG_ID,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.FORMATTED_ADDRESS,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.BU_ID,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.CONTACT_PHONE,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.FTS_VALUE,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.FULL_ADDRESS,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.ISSUE_FROM,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.ISSUE_REGISTRY_CODE,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.LOCALITY_ID,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.MAJOR_INFO,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.REPRESENTATIVE_ADDRESS,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.REPRESENTATIVE_NAME,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.REPRESENTATIVE_PHONE,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.STREET_NUMBER,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.AUTH_STATUS,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.ISSUE_REGISTRY_CODE,
            RELEASE_REGISTRATION_CONSTANT.COLUMN.BU_CODE,

        ];
    }

    async createRR(buId, taxPlace, decisionNo, issueAmount, issueFrom, issueYear, pattern, serial) {
        const data = {
            "buId": buId,
            "tenantCode": "ETAX",
            "taxPlace": taxPlace,
            "decisionNo": decisionNo,
            "issueAmount": issueAmount,
            "issueFrom": issueFrom,
            "issueYear": issueYear,
            "pattern": pattern,
            "serial": serial,
            "description": "",
            "extValue": null
        };
        try {
            const dataFile = await this.releaseRegistrationService.createRR(data);
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

    async updateRR(id, taxPlace, decisionNo, issueAmount, issueFrom, issueYear, pattern, serial) {
        const data = {
            "id": id,
            //"tenantCode": "ETAX",
            "taxPlace": taxPlace,
            "decisionNo": decisionNo,
            "issueAmount": issueAmount,
            "issueFrom": issueFrom,
            "issueYear": issueYear,
            "pattern": pattern,
            "serial": serial,
            "description": "",
            "extValue": null
        };
        try {
            const resData = await this.releaseRegistrationService.updateRR(data);
            // if (resData.status === undefined) {
            //     this._utilCmp.showTranslateSnackbar('UPDATE_SUCCESS');
            //     return true;
            // }
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

    async approveRR(id) {
        const data = {
            "id": id,
        };
        try {
            const resData = await this.releaseRegistrationService.approveRR(data);
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

    // async getUsbToken(wsUrl, callBack){
    //     //GET USB TOKENS
    //     const params = {
    //         "tokenSerial": "",
    //         "version": "1.0.0"
    //     } 
    //     try {
    //         const resData = await this.releaseRegistrationService.getUsbToken(wsUrl, params);
    //         if (!this._utils.checkIsNotNull(resData)) {
    //             return true;
    //         }
    //     } catch (error) {
    //         this._utilCmp.showTranslateSnackbar('Lấy danh sách thất bại!', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
    //         return null;
    //     }
        
    // }

    getCertByAggid(aggId): Promise<any> {
        return this.releaseRegistrationService.getCertByAggid(aggId);
    }

    // async uploadTemplate(file) {
    //     this.isLoading = true;
    //     try {
    //         const dataFile = await this.releaseRegistrationService.uploadFile(file);
    //         this.isLoading = false;
    //         if (this._utils.checkIsNotNull(dataFile)) {
    //             if (dataFile.status == APP_CONSTANT.SUCCESS) {
    //                 return true;
    //             }
    //         }
    //         return null;
    //     } catch (error) {
    //         this.isLoading = false;
    //         return null;
    //     }
    // }
}
