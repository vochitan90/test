import { Injectable } from '@angular/core';
import { ACTION, APP_CONSTANT, COMPONENT_CONSTANT, SCREEN_CONSTANT } from 'app/main/shared/const/app.constant';
import { FN_NAMES } from 'app/main/shared/const/Permission';
import { BaseStoreService } from 'app/main/shared/utils/BaseStoreService';
import { AppState, UtilCommon, UtilComponent } from '../../shared';
import { IOrgInfo } from './models/org-info.interface';
import { ORG_INFO_CONSTANT } from './org-info.constant';
import { OrgInfoService } from './org-info.service';

// @Injectable({
//     providedIn: 'root'
// })
@Injectable()
export class OrgInfoStore extends BaseStoreService {
    
    public isFirstEnterSreen = true;
    public isRowSelected = false;
    public gridConfigs: any = {
        editColDefs: {
            // seeAllOldVersion: {
            //     valueFormatter: (params) => {
            //         return 'Xem';
            //     }
            // },
            authStatus: {
                valueFormatter: (params) => {
                    if (params && params.value) {
                        return params.context.parent._translateService.instant("AUTH_STATUS." + params.value);
                    }
                }
            },
            recordStatus: {
                valueFormatter: (params) => {
                    if (params && params.value) {
                        return params.context.parent._translateService.instant("RECORD_STATUS." + params.value);
                    }
                }
            }
        },
        delCols: this.delCols(),
        colsOrder: {
            [ORG_INFO_CONSTANT.COLUMN.CODE]: 1,
            [ORG_INFO_CONSTANT.COLUMN.NAME]: 2,
            [ORG_INFO_CONSTANT.COLUMN.LEGAL_REPRESENTATIVE_NAME]: 3,
            [ORG_INFO_CONSTANT.COLUMN.RECORD_STATUS]: 4,
            [ORG_INFO_CONSTANT.COLUMN.MAKER_DATE]: 5,
            [ORG_INFO_CONSTANT.COLUMN.MAKER_ID]: 6
            
        },
        visibleCols: [
            ORG_INFO_CONSTANT.COLUMN.CODE,
            ORG_INFO_CONSTANT.COLUMN.NAME,
            ORG_INFO_CONSTANT.COLUMN.LEGAL_REPRESENTATIVE_NAME,
            ORG_INFO_CONSTANT.COLUMN.RECORD_STATUS,
            ORG_INFO_CONSTANT.COLUMN.MAKER_DATE,
            ORG_INFO_CONSTANT.COLUMN.MAKER_ID,

        ],
        exportCols: [
            ORG_INFO_CONSTANT.COLUMN.CODE,
            ORG_INFO_CONSTANT.COLUMN.NAME,
            ORG_INFO_CONSTANT.COLUMN.PHONE_NUMBER,
            ORG_INFO_CONSTANT.COLUMN.LEGAL_REPRESENTATIVE_NAME,
            ORG_INFO_CONSTANT.COLUMN.RECORD_STATUS,
            ORG_INFO_CONSTANT.COLUMN.MAKER_DATE,
            ORG_INFO_CONSTANT.COLUMN.MAKER_ID,
        ],
    };

    constructor(
        public templateService: OrgInfoService,
        private _utilCmp: UtilComponent,
        public _utils: UtilCommon,
        public _appState: AppState) {
            super(templateService, _utils, _appState);
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
            ORG_INFO_CONSTANT.COLUMN.ID,
            ORG_INFO_CONSTANT.COLUMN.MOD_NO,
            ORG_INFO_CONSTANT.COLUMN.FTS_VALUE,
            ORG_INFO_CONSTANT.COLUMN.DOWNLOAD,
            ORG_INFO_CONSTANT.COLUMN.DESCRIPTION,
            ORG_INFO_CONSTANT.COLUMN.ALIAS_NAME,
            ORG_INFO_CONSTANT.COLUMN.MOD_NO,
            ORG_INFO_CONSTANT.COLUMN.FTS_VALUE,
            ORG_INFO_CONSTANT.COLUMN.DESCRIPTION,
            ORG_INFO_CONSTANT.COLUMN.COMPANY_CODE,
            ORG_INFO_CONSTANT.COLUMN.CHECKER_DATE,
            ORG_INFO_CONSTANT.COLUMN.CHECKER_ID,
            ORG_INFO_CONSTANT.COLUMN.TEMPLATE_TYPE_ID,
            ORG_INFO_CONSTANT.COLUMN.TEMPLATE_TYPE_CODE,
            ORG_INFO_CONSTANT.COLUMN.TEMPLATE_TYPE_NAME,
            ORG_INFO_CONSTANT.COLUMN.TEMPLATE_TYPE_VERSION_ID,
            ORG_INFO_CONSTANT.COLUMN.COMPANY_ID,
            ORG_INFO_CONSTANT.COLUMN.TAX_CODE,
            ORG_INFO_CONSTANT.COLUMN.PHONE_NUMBER,
            ORG_INFO_CONSTANT.COLUMN.ADDRESS_ID,
            ORG_INFO_CONSTANT.COLUMN.BUSSINESS_UNITTYPE_ID,
            ORG_INFO_CONSTANT.COLUMN.CONTACT_EMAIL,
            ORG_INFO_CONSTANT.COLUMN.FORMATTED_ADDRESS,
            ORG_INFO_CONSTANT.COLUMN.REPRESENTATIVE_ADDRESS,
            ORG_INFO_CONSTANT.COLUMN.HOT_LINE,
            ORG_INFO_CONSTANT.COLUMN.LOCALITY_ID,
            ORG_INFO_CONSTANT.COLUMN.MAJOR_INFO,
            ORG_INFO_CONSTANT.COLUMN.FULL_ADDRESS,
            ORG_INFO_CONSTANT.COLUMN.PARENT_CODE,
            ORG_INFO_CONSTANT.COLUMN.PARENT_ID,
            ORG_INFO_CONSTANT.COLUMN.PARENT_NAME,

            ORG_INFO_CONSTANT.COLUMN.REPRESENTATIVE_PHONE,
            ORG_INFO_CONSTANT.COLUMN.STREET_NUMBER,
            ORG_INFO_CONSTANT.COLUMN.TENANT_CODE,
            ORG_INFO_CONSTANT.COLUMN.WEBSITE,
            ORG_INFO_CONSTANT.COLUMN.AUTH_STATUS,
        ];
    }

    cellRenderer() {
        for (let coldef of this._columnDefs) {
            // if (coldef.field === TEMPLATE_CONSTANT.COLUMN.NAME) {
            //     coldef.cellStyle = { 'color': 'blue', 'white-space': 'normal', 'cursor': 'pointer' };
            // }
            // if (coldef.field === TEMPLATE_CONSTANT.COLUMN.SEE_ALL_OLD_VERSION) {
            //     coldef.cellStyle = { 'color': 'blue', 'white-space': 'normal', 'cursor': 'pointer' };
            // }
        }
    }

    async downloadFile(id: number, fileName: string) {
        this.isLoading = true;
        try {
            const { response, ext } = await this.templateService.downloadTemplateVersion(id);
            if (this._utils.checkIsNotNull(response) && this._utils.checkIsNotNull(ext)) {
                this._utils.downloadFile(fileName + this._utils.getExtensionFileDoc(ext), response);
            } else {
                this._utilCmp.openSnackBar('Không thể tải tập tin ', 'error');
            }
            this.isLoading = false;
        } catch (error) {
            this.isLoading = false;
        }
    }

    async updateRecordStatus(id: number, status: string) {
        this.isLoading = true;
        try {
            const params = {
                "id": id,
                "status": status
            };
            const response = await this.templateService.activeDeActiveTemplate(params);
            if (!this._utils.checkIsNotNull(response)) {
                return true;
            } else {
                this._utilCmp.openSnackBar('Không thể chuyển trạng thái ', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
            }
            this.isLoading = false;
            return false;
        } catch (error) {
            this.isLoading = false;
            return false;
        }
    }


    async uploadTemplate(code: string, name: string, templateTypeId: number, description: string,
        effectiveDate: number, file) {
        this.isLoading = true;
        try {
            const dataFile = await this.templateService.uploadFileTemp(file);
            if (this._utils.checkIsNotNull(dataFile)) {
                if (dataFile.status == APP_CONSTANT.SUCCESS) {
                    const resourceDto =
                    {
                        "sizeType": dataFile.sizeType, "aliasName": dataFile.fileName,
                        "fileName": dataFile.fileName,
                        "filePath": dataFile.tempFilePath,
                        "mineType": dataFile.mineType,
                        "storageType": null, "refCode": null
                    };
                    const data1 = {
                        "code": code, "name": name,
                        "description": description, "templateTypeId": templateTypeId,
                        "effectiveDate": effectiveDate,
                        "resourceDto": resourceDto
                    };

                    const upload = await this.templateService.createTemplateFile(data1);
                    this.isLoading = false;
                    if (!upload) {
                        this._utilCmp.showTranslateSnackbar('SAVE_SUCCESS');
                        return true;
                    }
                    if(this._utilCmp.checkValidationErrorSubmit(upload, SCREEN_CONSTANT.TEMPLATE)){
                        return null;
                    }
                    this._utilCmp.showTranslateSnackbar('SAVE_FAIL', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
                    return null;
                } else {
                    this._utilCmp.openSnackBar(dataFile.message, 'error');
                    return null;
                }
            }
            this._utilCmp.showTranslateSnackbar('UPLOAD_FAIL');
            return null;
        } catch (error) {
            this._utilCmp.showTranslateSnackbar('SAVE_FAIL', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
            this.isLoading = false;
            return null;
        }
    }

    async updaeUploadTemplate(code: string, name: string, templateTypeId: number, description: string,
        effectiveDate: number, file, data: IOrgInfo = null, action: string = ACTION.CREATE) {
        this.isLoading = true;
        try {
            let dataFile;
            let data1;
            if (!this._utils.checkIsString(file)) {
                dataFile = await this.templateService.uploadFileTemp(file);
                if (this._utils.checkIsNotNull(dataFile)) {
                    if (dataFile.status == APP_CONSTANT.SUCCESS) {
                        const resourceDto =
                        {
                            "sizeType": dataFile.sizeType, "aliasName": dataFile.fileName,
                            "fileName": dataFile.fileName,
                            "filePath": dataFile.tempFilePath,
                            "mineType": dataFile.mineType,
                            "storageType": null, "refCode": null
                        };
                        data1 = {
                            "id": data.id,
                            "templateVersionId": data.templateVersionId,
                            "code": code, "name": name,
                            "description": description, "templateTypeId": templateTypeId,
                            "effectiveDate": effectiveDate,
                            "resourceDto": resourceDto
                        };
                    }
                } else {
                    this._utilCmp.openSnackBar(dataFile.message, COMPONENT_CONSTANT.SNACK_BAR_ERROR);
                    return false;
                }
            } else {
                data1 = {
                    "id": data.id,
                    "templateVersionId": data.templateVersionId,
                    "code": code, "name": name,
                    "description": description, "templateTypeId": templateTypeId,
                    "effectiveDate": effectiveDate,
                    "resourceDto": null
                };
            }

            const upload = await this.templateService.updateTemplateFile(data1);
            this.isLoading = false;
            if (!upload) {
                // this._utilCmp.openSnackBar('Cập nhật thành công');
                this._utilCmp.showTranslateSnackbar('UPDATE_SUCCESS');
                return true;
            }
            if(this._utilCmp.checkValidationErrorSubmit(upload, SCREEN_CONSTANT.TEMPLATE)){
                return null;
            }
            // this._utilCmp.openSnackBar('Không thể cập nhật mẫu');
            this._utilCmp.showTranslateSnackbar('UPDATE_FAIL', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
            return null;
        } catch (error) {
            this.isLoading = false;
            this._utilCmp.showTranslateSnackbar('UPDATE_FAIL', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
            return null;
        }
    }

    async approveTemplate(_ids: number[], _status: string): Promise<boolean> {
        this.isLoading = true;
        try {
            const data = {
                "ids": _ids,
                "status": _status
            }
            const response = await this.templateService.approve(data);
            this.isLoading = false;
            if (this._utils.checkIsNotNull(response)) {
                this._utilCmp.openSnackBar('Không thể duyệt ', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
                return false;
            }
            if(this._utilCmp.checkValidationErrorSubmit(response, SCREEN_CONSTANT.TEMPLATE)){
                return null;
            }
            return true;
        } catch (error) {
            this.isLoading = false;
            this._utilCmp.openSnackBar('Không thể duyệt ', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
            return false;
        }
    }

}
