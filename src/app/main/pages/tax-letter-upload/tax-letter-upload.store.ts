import { Injectable } from '@angular/core';
import { APP_CONSTANT, COMPONENT_CONSTANT, SCREEN_CONSTANT } from 'app/main/shared/const/app.constant';
import { FN_NAMES } from 'app/main/shared/const/Permission';
import { BaseStoreService } from 'app/main/shared/utils/BaseStoreService';
import { transformRequestBeforeQuery } from 'app/main/shared/utils/GridService';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { map } from 'rxjs/operators';
import { AppState, UtilCommon, UtilComponent } from '../../shared';
import { TAX_LETTER_UPLOAD_CONSTANT } from './tax-letter-upload.constant';
import { TaxLetterUploadService } from './tax-letter-upload.service';

// @Injectable({
//     providedIn: 'root'
// })
@Injectable()
export class TaxLetterUploadStore extends BaseStoreService {

    public isFirstEnterSreen = true;
    public gridConfigs: any = {
        editColDefs: {
            status: {
                valueFormatter: (params) => {
                    if (params && params.value || params.value === 0) {
                        const value = params.context.parent._translateService.instant('TAXINCOME_LETTER_UPLOAD.STATUS_' + params.value);
                        return value;
                    }
                }
            },
        },
        delCols: this.delCols(),
        colsOrder: {
            [TAX_LETTER_UPLOAD_CONSTANT.COLUMN.PROCESS_CODE]: 1,
            [TAX_LETTER_UPLOAD_CONSTANT.COLUMN.FILE_NAME]: 2,
            [TAX_LETTER_UPLOAD_CONSTANT.COLUMN.STATUS]: 3,
            [TAX_LETTER_UPLOAD_CONSTANT.COLUMN.MAKER_ID]: 4,
            [TAX_LETTER_UPLOAD_CONSTANT.COLUMN.MAKER_DATE]: 5,
            [TAX_LETTER_UPLOAD_CONSTANT.COLUMN.RESULT]: 6,
        },
        visibleCols: [
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.PROCESS_CODE,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.FILE_NAME,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.STATUS,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.MAKER_DATE,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.MAKER_ID,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.RESULT
        ],
        exportCols: [
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.PROCESS_CODE,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.FILE_NAME,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.STATUS,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.MAKER_DATE,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.MAKER_ID,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.RESULT
        ],
    };

    constructor(
        public taxLetterUploadService: TaxLetterUploadService,
        public _utils: UtilCommon,
        private _utilCmp: UtilComponent,
        public _appState: AppState) {
        super(taxLetterUploadService, _utils, _appState);
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
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.AUTH_STATUS,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.CHECKER_DATE,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.CHECKER_ID,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.ID,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.MOD_NO,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.RECORD_STATUS,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.FILE_PATH,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.PROCESS_NAME,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.PERCENT_PROCESS,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.COMPAY_ID,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.CONTENT,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.FUNCTION_KEY,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.FTS_VALUE,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.DESCRIPTION,
            TAX_LETTER_UPLOAD_CONSTANT.COLUMN.TENANT_CODE,        
        ];
    }

    cellRenderer() {
        for (const coldef of this._columnDefs) {
            if (coldef.field === TAX_LETTER_UPLOAD_CONSTANT.COLUMN.FILE_NAME) {
                // coldef.lockPosition=true;
                // coldef.lockPinned = true;
                coldef.cellStyle = { 'color': '#039be5', 'white-space': 'normal', 'cursor': 'pointer' };
            }

        }
    }

    async downloadFile(id: number, fileName: string) {
        this.isLoading = true;
        try {
            const dataFile = await this.taxLetterUploadService.downloadFileImport(id);
            if (this._utils.checkIsNotNull(dataFile)) {
                this._utils.downloadFile(fileName, dataFile);
            }
            this.isLoading = false;
        } catch (error) {
            this.isLoading = false;
        }
    }

    async issueImport(id: number, processDetailIds: number[]) {
        const data = {
            'id': id,
            'processDetailIds': processDetailIds
        };
        try {
            const resData = await this.taxLetterUploadService.issueImport(data);
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

    async uploadTemplate(file, buId) {
        this.isLoading = true;
        try {
            const dataFile = await this.taxLetterUploadService.uploadFile(file);
            this.isLoading = false;
            if (this._utils.checkIsNotNull(dataFile)) {
                if (dataFile.status === APP_CONSTANT.SUCCESS) {

                    // Continue to processImport (Tạo item cho grid table cùng với thông tin của file vừa upload)
                    const resourceDto =
                    {
                        'sizeType': dataFile.sizeType,
                        'aliasName': dataFile.fileName,
                        'fileName': dataFile.fileName,
                        'filePath': dataFile.tempFilePath,
                        'mineType': dataFile.mineType,
                        // "storageType": null, 
                        'refCode': null
                    };
                    const data = {
                        'buId': buId,
                        // "pattern": "CTT56",
                        // "serial": "AA/2021/T",
                        'resourceDto': resourceDto
                    };

                    const upload = await this.taxLetterUploadService.createTaxLetterFile(data);
                    this.isLoading = false;
                    if (!upload) {
                        this._utilCmp.showTranslateSnackbar('SAVE_SUCCESS');
                        return true;
                    }
                    if (this._utilCmp.checkValidationErrorSubmit(upload, SCREEN_CONSTANT.TEMPLATE)) {
                        return null;
                    }
                    this._utilCmp.showTranslateSnackbar('SAVE_FAIL', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
                    return null;

                }
            }
            return null;
        } catch (error) {
            this.isLoading = false;
            return null;
        }
    }

    async handleListProcessStatus(processId: number) {
        return await forkJoin([
            this.taxLetterUploadService.getListProcessStatus(processId, 0),
            // this.taxLetterUploadService.getListProcessStatus(processId, 1)],
            this.taxLetterUploadService.listProcessDetailValid(processId)],
        ).pipe(
            map((data) => ({ failing: data[0], sucessing: data[1] }),
            )).toPromise();
    }

    async downloadTemplate() {
        window.open(window['PROCESS_UPLOAD_TEMPLATE'] + '?t=' + new Date().getTime(), '_blank');
    }

    pivotPaging(request: any): Promise<any> {
        this.normalFilterModel = request.filterModel;
        if (this.isFullTextSearchMode) {
            request = this.buildFullTexSearchRequest(request, this.fullText);
            // Fix bug get functionKey từ  data source mỗi list
            request.filterModel.functionKey = this.normalFilterModel.functionKey;
        }
        this.lastRequest = request;
        this.screenUserAttribute = this.buildGridAttribute();
        this.isLoading = true;
        const res = transformRequestBeforeQuery(request);
        return this.workFlowService.pivotPaging(transformRequestBeforeQuery(request))
            .then(data => {
                this.isLoading = false;
                return data;
            }).catch(error => {
                this.isLoading = false;
                throw error;
            });
    }
}
