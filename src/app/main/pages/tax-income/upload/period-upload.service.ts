import { Injectable } from '@angular/core';
import { AppState, HttpHelper } from 'app/main/shared';
import { BaseRequestService } from 'app/main/shared/utils/BaseRequestService';
import { ITaxIncomeIssueImport } from '../models/taxIncome.interface';
import { UPLOAD_PERIOD_CONSTANT } from './period-upload.constant';

// @Injectable({
//     providedIn: 'root'
// })
@Injectable()
export class UploadPeriodService extends BaseRequestService {
    permissions: any;
    BASE_REQUEST_CONSTANT = UPLOAD_PERIOD_CONSTANT;
    constructor(public httpHelper: HttpHelper, public _appState: AppState) {
        super(httpHelper, _appState);
    }

    getProcessUploadUserAttribute(): Promise<any> {
        return this._appState.getAttributeValue(UPLOAD_PERIOD_CONSTANT.PROCESS_UPLOAD_ATTRIBUTE);
    }

    setProcessUploadUserAttribute(value: string): Promise<any> {
        return this._appState.setAttributeValue(UPLOAD_PERIOD_CONSTANT.PROCESS_UPLOAD_ATTRIBUTE, value);
    }

    downloadFileImport(id: number): Promise<any> {
        return this.httpHelper.methodDownloadService(UPLOAD_PERIOD_CONSTANT.API.DOWNLOAD_FILE, 'id=' + id);
    }

    getListProcessStatus(processId: number, status: number): Promise<any> {
        const params = `processId=${processId}&status=${status}`;
        return this.httpHelper.methodPostService(UPLOAD_PERIOD_CONSTANT.API.LIST_PROCESS_DETAIL_STATUS, params);
    }

    listProcessDetailValid(processId: number): Promise<any> {
        const params = `processId=${processId}`;
        return this.httpHelper.methodPostService(UPLOAD_PERIOD_CONSTANT.API.LIST_PROCESS_DETAIL_VALID, params);
    }

    issueImport(data: ITaxIncomeIssueImport): Promise<any> {
        const params: string = 'cmd=' + encodeURIComponent(JSON.stringify(data));
        return this.httpHelper.methodPostService(UPLOAD_PERIOD_CONSTANT.API.ISSUE_IMPORT, params);
    }
}
