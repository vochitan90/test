import { Injectable } from '@angular/core';
import { HTTP_CONSTANT } from 'app/main/shared/const/app.constant';
import { BaseRequestService } from 'app/main/shared/utils/BaseRequestService';
import { AppState, HttpHelper } from '../../shared';
import { ISSUE_REGISTRY_UPLOAD_CONSTANT } from './issue-registry-upload.constant';

// @Injectable({
//     providedIn: 'root'
// })
@Injectable()
export class IssueRegistryUploadService extends BaseRequestService {
    permissions: any;
    BASE_REQUEST_CONSTANT = ISSUE_REGISTRY_UPLOAD_CONSTANT;
    constructor(public httpHelper: HttpHelper, public _appState: AppState) {
        super(httpHelper, _appState);
    }
 
    getProcessUploadUserAttribute(): Promise<any> {
        return this._appState.getAttributeValue(ISSUE_REGISTRY_UPLOAD_CONSTANT.ISSUE_REGISTRY_UPLOAD_ATTRIBUTE);
    }

    setProcessUploadUserAttribute(value: string): Promise<any> {
        return this._appState.setAttributeValue(ISSUE_REGISTRY_UPLOAD_CONSTANT.ISSUE_REGISTRY_UPLOAD_ATTRIBUTE, value);
    }

    getListBusinessUnitActiveForUser(){
        return this.httpHelper.methodGetService(ISSUE_REGISTRY_UPLOAD_CONSTANT.API.GET_BU_ACTIVE_FOR_USER);
    }

    getIssueRegistryActiveByBu(buId){
        //return this.httpHelper.methodPostJsonServiceNew(ISSUE_REGISTRY_UPLOAD_CONSTANT.API.GET_ISSUE_REGISTRY_ACTIVE_BY_BU, buId);
        const params = `buId=${buId}`;
        return this.httpHelper.methodPostService(ISSUE_REGISTRY_UPLOAD_CONSTANT.API.GET_ISSUE_REGISTRY_ACTIVE_BY_BU, params);
    }

    getListTaxPlace(){
        return this.httpHelper.methodGetService(ISSUE_REGISTRY_UPLOAD_CONSTANT.API.GET_TAX_PLACE);
    }

    downloadFileImport(id: number): Promise<any> {
        return this.httpHelper.methodDownloadService(ISSUE_REGISTRY_UPLOAD_CONSTANT.API.DOWNLOAD_FILE, 'id='+id);
    }

    downloadResource(aggId: string, isDocFile: boolean): Promise<any> {
        const params = `aggId=${encodeURIComponent(aggId)}`;
        const url = ISSUE_REGISTRY_UPLOAD_CONSTANT.API.DOWNLOAD_RESOURCE + params;
        if (isDocFile) {
            return this.httpHelper.methodDownLoadFileDocx(url, null);
        } else {
            return this.httpHelper.methodDownloadService(url, null);
        }
    }

    downloadCert(aggId: string): Promise<any> {
        const params = `aggId=${encodeURIComponent(aggId)}`;
        return this.httpHelper.methodDownloadService(ISSUE_REGISTRY_UPLOAD_CONSTANT.API.DOWNLOAD_CERT, params);
    }

    issueImport(data){
        return this.httpHelper.methodPostService(ISSUE_REGISTRY_UPLOAD_CONSTANT.API.ISSUE_IMPORT, HTTP_CONSTANT.CMD_EQUAL + encodeURIComponent(JSON.stringify(data)));
    }

    create(data): Promise<any> {
        return this.httpHelper.methodPostMultiPart(ISSUE_REGISTRY_UPLOAD_CONSTANT.API.CREATE, HTTP_CONSTANT.CMD_EQUAL + encodeURIComponent(JSON.stringify(data)));
    }

    uploadFile(file : File): Promise<any> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        formData.append('funcKey', ISSUE_REGISTRY_UPLOAD_CONSTANT.IMPORT_CONTRACT);
        return this.httpHelper.methodPostMultiPart(ISSUE_REGISTRY_UPLOAD_CONSTANT.API.UPLOAD_FILE, formData);
    }

    uploadFileTemp(file: File): Promise<any> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.httpHelper.methodPostMultiPart(ISSUE_REGISTRY_UPLOAD_CONSTANT.API.UPLOAD_FILE, formData);
    }

    getListProcessStatus(processId: number, status: number): Promise<any>{
        const params = `processId=${processId}&status=${status}`;
        return this.httpHelper.methodPostService(ISSUE_REGISTRY_UPLOAD_CONSTANT.API.LIST_PROCESS_DETAIL_STATUS, params);
    }

    getRegistrytaxHistoriesAggid(aggId: string): Promise<any> {
        const params = `aggId=${aggId}`;
        return this.httpHelper.methodPostService(ISSUE_REGISTRY_UPLOAD_CONSTANT.API.GET_BY_AGGID, params);
    }

    listProcessDetailValid(processId: number): Promise<any>{
        const params = `processId=${processId}`;
        return this.httpHelper.methodPostService(ISSUE_REGISTRY_UPLOAD_CONSTANT.API.LIST_PROCESS_DETAIL_VALID, params);
    }
}
