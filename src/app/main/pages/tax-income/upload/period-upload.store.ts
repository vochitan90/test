import { Injectable } from '@angular/core';
import { AppState, UtilCommon } from 'app/main/shared';
import { FN_NAMES } from 'app/main/shared/const/Permission';
import { BaseStoreService } from 'app/main/shared/utils/BaseStoreService';
import { transformRequestBeforeQuery } from 'app/main/shared/utils/GridService';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { map } from 'rxjs/operators';
import { ITaxIncomeIssueImport } from '../models/taxIncome.interface';
import { UPLOAD_PERIOD_CONSTANT } from './period-upload.constant';
import { UploadPeriodService } from './period-upload.service';

// @Injectable({
//     providedIn: 'root'
// })
@Injectable()
export class PeriodUploadStore extends BaseStoreService {

    public isFirstEnterSreen = true;
    public gridConfigs: any = {
        editColDefs: {
            status: {
                valueFormatter: (params) => {
                    if (params && params.value || params.value === 0) {
                        const value = params.context.parent._translateService.instant('PROCESS_UPLOAD.STATUS_' + params.value);
                        return value;
                    }
                }
            },
            fileName: {
                cellRenderer: (params) => {
                    return `<span style="cursor:pointer; color:#039be5">${params.value}</span>`;
                }
            },
        },
        delCols: this.delCols(),
        colsOrder: {
            [UPLOAD_PERIOD_CONSTANT.COLUMN.PROCESS_CODE]: 1,
            [UPLOAD_PERIOD_CONSTANT.COLUMN.FILE_NAME]: 2,
            [UPLOAD_PERIOD_CONSTANT.COLUMN.STATUS]: 3,
            [UPLOAD_PERIOD_CONSTANT.COLUMN.RESULT]: 4,
            [UPLOAD_PERIOD_CONSTANT.COLUMN.MAKER_ID]: 5,
            [UPLOAD_PERIOD_CONSTANT.COLUMN.MAKER_DATE]: 6
        },
        visibleCols: [
            UPLOAD_PERIOD_CONSTANT.COLUMN.PROCESS_CODE,
            UPLOAD_PERIOD_CONSTANT.COLUMN.FILE_NAME,
            UPLOAD_PERIOD_CONSTANT.COLUMN.STATUS,
            UPLOAD_PERIOD_CONSTANT.COLUMN.RESULT,
            UPLOAD_PERIOD_CONSTANT.COLUMN.MAKER_DATE,
            UPLOAD_PERIOD_CONSTANT.COLUMN.MAKER_ID,
        ],
        exportCols: [
            UPLOAD_PERIOD_CONSTANT.COLUMN.PROCESS_CODE,
            UPLOAD_PERIOD_CONSTANT.COLUMN.FILE_NAME,
            UPLOAD_PERIOD_CONSTANT.COLUMN.STATUS,
            UPLOAD_PERIOD_CONSTANT.COLUMN.MAKER_DATE, UPLOAD_PERIOD_CONSTANT.COLUMN.MAKER_ID
        ],
    };

    constructor(
        public uploadPeriodService: UploadPeriodService,
        public _utils: UtilCommon,
        public _appState: AppState) {
        super(uploadPeriodService, _utils, _appState);
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
            UPLOAD_PERIOD_CONSTANT.COLUMN.AUTH_STATUS,
            UPLOAD_PERIOD_CONSTANT.COLUMN.CHECKER_DATE,
            UPLOAD_PERIOD_CONSTANT.COLUMN.CHECKER_ID,
            UPLOAD_PERIOD_CONSTANT.COLUMN.ID,
            UPLOAD_PERIOD_CONSTANT.COLUMN.MOD_NO,
            UPLOAD_PERIOD_CONSTANT.COLUMN.RECORD_STATUS,
            UPLOAD_PERIOD_CONSTANT.COLUMN.FILE_PATH,
            UPLOAD_PERIOD_CONSTANT.COLUMN.PROCESS_NAME,
            UPLOAD_PERIOD_CONSTANT.COLUMN.PERCENT_PROCESS,
            UPLOAD_PERIOD_CONSTANT.COLUMN.FUNCTION_KEY,
            UPLOAD_PERIOD_CONSTANT.COLUMN.FTS_VALUE,
            UPLOAD_PERIOD_CONSTANT.COLUMN.DESCRIPTION,
            UPLOAD_PERIOD_CONSTANT.COLUMN.TENANT_CODE,
        ];
    }

    async downloadFile(id: number, fileName: string): Promise<void> {
        this.isLoading = true;
        try {
            const dataFile = await this.uploadPeriodService.downloadFileImport(id);
            if (this._utils.checkIsNotNull(dataFile)) {
                this._utils.downloadFile(fileName, dataFile);
            }
            this.isLoading = false;
        } catch (error) {
            this.isLoading = false;
        }
    }

    async handleListProcessStatus(processId: number): Promise<any> {
        return await forkJoin(
            this.uploadPeriodService.getListProcessStatus(processId, 0),
            this.uploadPeriodService.listProcessDetailValid(processId),
        ).pipe(
            map((data) => ({ failing: data[0], sucessing: data[1] }),
            )).toPromise();
    }

    async listProcessDetailValid(processId: number): Promise<any> {
        return this.uploadPeriodService.listProcessDetailValid(processId);
    }

    async downloadTemplate(): Promise<any> {
        window.open(window['PROCESS_UPLOAD_TEMPLATE'] + '?t=' + new Date().getTime(), '_blank');
    }

    issueImport(data: ITaxIncomeIssueImport): Promise<any> {
        return this.uploadPeriodService.issueImport(data);
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
