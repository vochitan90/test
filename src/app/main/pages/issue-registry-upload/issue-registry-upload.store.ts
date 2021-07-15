import { Injectable } from '@angular/core';
import { APP_CONSTANT, COMPONENT_CONSTANT, SCREEN_CONSTANT } from 'app/main/shared/const/app.constant';
import { FN_NAMES } from 'app/main/shared/const/Permission';
import { BaseStoreService } from 'app/main/shared/utils/BaseStoreService';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { map } from 'rxjs/operators';
import { AppState, UtilCommon, UtilComponent } from '../../shared';
import { ISSUE_REGISTRY_UPLOAD_CONSTANT } from './issue-registry-upload.constant';
import { IssueRegistryUploadService } from './issue-registry-upload.service';

// @Injectable({
//     providedIn: 'root'
// })
@Injectable()
export class IssueRegistryUploadStore extends BaseStoreService {
  
    public isFirstEnterSreen = true;
    public gridConfigs: any = {
        editColDefs: {
            status: {
                valueFormatter: (params) => {
                    if (params && params.value || params.value === 0) {
                        let value = params.context.parent._translateService.instant("TAXINCOME_LETTER_UPLOAD.STATUS_" + params.value);
                        return value;
                    }
                }
            },
        },
        delCols: this.delCols(),
        colsOrder: {
            [ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.BU_NAME]: 1,
            [ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.TAX_PLACE_NAME]: 2,
            [ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.STATUS]: 3,
            [ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.MAKER_ID]: 4,
            [ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.MAKER_DATE]: 5
        },
        visibleCols: [
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.BU_NAME,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.TAX_PLACE_NAME,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.STATUS,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.MAKER_DATE,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.MAKER_ID
        ],
        exportCols: [
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.BU_NAME,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.TAX_PLACE_NAME,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.STATUS,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.MAKER_DATE, 
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.MAKER_ID
        ],
    };

    constructor(
        public issueRegistryUploadService: IssueRegistryUploadService,
        public _utils: UtilCommon,
        private _utilCmp: UtilComponent,
        public _appState: AppState) {
            super(issueRegistryUploadService, _utils, _appState);
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
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.AUTH_STATUS,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.CHECKER_DATE,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.CHECKER_ID,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.ID,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.MOD_NO,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.RECORD_STATUS,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.FILE_PATH,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.PROCESS_NAME,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.PERCENT_PROCESS,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.COMPAY_ID,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.CONTENT,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.FUNCTION_KEY,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.FTS_VALUE,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.DESCRIPTION,

            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.AGG_ID,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.BU_ADDRESS,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.BU_CODE,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.BU_TAX_CODE,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.BU_MAJOR,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.BU_PHONE,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.BU_SERIAL,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.BU_PATTERN,

            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.REGISTRY_FORM,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.REGISTRY_TO,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.REGISTRY_YEAR,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.COMPANY_REGISTRY,

            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.TAX_PLACE_ID,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.TAX_PLACE_CODE,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.TENANT_CODE,
            ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.REGISTRY_AMOUNT,

        ];
    }

    cellRenderer() {
        for (let coldef of this._columnDefs) {
            if (coldef.field === ISSUE_REGISTRY_UPLOAD_CONSTANT.COLUMN.FILE_NAME) {
                // coldef.lockPosition=true;
                // coldef.lockPinned = true;
                coldef.cellStyle = { 'color': 'blue', 'white-space': 'normal', 'cursor': 'pointer' };
            }

        }
    }

    async downloadFile(id: number, fileName: string) {
        this.isLoading = true;
        try {
            const dataFile = await this.issueRegistryUploadService.downloadFileImport(id);
            if (this._utils.checkIsNotNull(dataFile)) {
                this._utils.downloadFile(fileName, dataFile);
            }
            this.isLoading = false;
        } catch (error) {
            this.isLoading = false;
        }
    }

    async issueImport(id: number, processDetailIds: number[]){
        const data = {
            "id": id,
            "processDetailIds": processDetailIds
        };
        try {
            const resData = await this.issueRegistryUploadService.issueImport(data);
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

    async uploadTemplate(currentItemDD2, currentItemDD3, dto1, dto2, dto3) {
        this.isLoading = true;
        try {
        
            const data = {
                "taxPlaceId": currentItemDD3.id,
                "buAddress": currentItemDD2.fullAddress,
                "buCode": currentItemDD2.buCode,
                "buMajor": currentItemDD2.majorInfo,
                "buName": currentItemDD2.buName,
                "buPattern": currentItemDD2.pattern,
                "buPhone": currentItemDD2.contactPhone,
                "buSerial": currentItemDD2.serial,
                "buTaxcode": currentItemDD2.taxCode,
                "description": null,
                "extValue": null,
                "registryAmount": currentItemDD2.issueAmount,
                "registryFrom": currentItemDD2.issueFrom,
                "registryTo": currentItemDD2.issueTo,
                "registryYear": currentItemDD2.issueYear,
                "registryTaxinResource": dto1,
                "formResource": dto2,
                "otherResource": dto3,
                "decisionNo": currentItemDD2.decisionNo,
                "buEmail ": currentItemDD2.buEmail,
                "taxEmail": currentItemDD3.contactEmail,
            };

            const upload = await this.issueRegistryUploadService.create(data);
            this.isLoading = false;
            if (!upload) {
                this._utilCmp.showTranslateSnackbar('SAVE_SUCCESS');
                return true;
            }else{
                if(upload.code === "VALIDATION.FILE_NOT_SIGN"){
                    this._utilCmp.showTranslateSnackbar('File chưa được ký!', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
                return null;
                }
            }
            if(this._utilCmp.checkValidationErrorSubmit(upload, SCREEN_CONSTANT.TEMPLATE)){
                return null;
            }
            this._utilCmp.showTranslateSnackbar('SAVE_FAIL', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
            return null;


            return null;
        } catch (error) {
            this.isLoading = false;
            return null;
        }
    }

    uploadFileTemp(file: File): Promise<any> {
        return this.issueRegistryUploadService.uploadFileTemp(file);
    }

    downloadResource(resourceId: string, isDocFile: boolean): Promise<any> {
        return this.issueRegistryUploadService.downloadResource(resourceId, isDocFile);
    }

    downloadCert(aggId: string): Promise<any> {
        return this.issueRegistryUploadService.downloadCert(aggId);
    }

    async handleListProcessStatus(processId: number){
        return await forkJoin([
            this.issueRegistryUploadService.getListProcessStatus(processId, 0),
            //this.taxLetterUploadService.getListProcessStatus(processId, 1)],
            this.issueRegistryUploadService.listProcessDetailValid(processId)],
          ).pipe(
            map((data) => ({ failing: data[0], sucessing: data[1] }),
          )).toPromise();
    }

    getRegistrytaxHistoriesAggid(aggId: string){
        return this.issueRegistryUploadService.getRegistrytaxHistoriesAggid(aggId);
    }

    async downloadTemplate(){
        window.open(window['PROCESS_UPLOAD_TEMPLATE']+'?t='+new Date().getTime(), '_blank');
    }
}
