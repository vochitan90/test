import { Injectable } from '@angular/core';
import { HTTP_CONSTANT } from 'app/main/shared/const/app.constant';
import { BaseRequestService } from 'app/main/shared/utils/BaseRequestService';
import { AppState, HttpHelper } from '../../shared';
import { TAX_LETTER_UPLOAD_CONSTANT } from './tax-letter-upload.constant';

// @Injectable({
//     providedIn: 'root'
// })
@Injectable()
export class TaxLetterUploadService extends BaseRequestService {
    permissions: any;
    BASE_REQUEST_CONSTANT = TAX_LETTER_UPLOAD_CONSTANT;
    constructor(public httpHelper: HttpHelper, public _appState: AppState) {
        super(httpHelper, _appState);
    }
 
    getProcessUploadUserAttribute(): Promise<any> {
        return this._appState.getAttributeValue(TAX_LETTER_UPLOAD_CONSTANT.TAX_LETTER_UPLOAD_ATTRIBUTE);
    }

    setProcessUploadUserAttribute(value: string): Promise<any> {
        return this._appState.setAttributeValue(TAX_LETTER_UPLOAD_CONSTANT.TAX_LETTER_UPLOAD_ATTRIBUTE, value);
    }

    downloadFileImport(id: number): Promise<any> {
        return this.httpHelper.methodDownloadService(TAX_LETTER_UPLOAD_CONSTANT.API.DOWNLOAD_FILE, 'id='+id);
    }

    issueImport(data){
        return this.httpHelper.methodPostService(TAX_LETTER_UPLOAD_CONSTANT.API.ISSUE_IMPORT, HTTP_CONSTANT.CMD_EQUAL + encodeURIComponent(JSON.stringify(data)));
    }

    createTaxLetterFile(data): Promise<any> {
        return this.httpHelper.methodPostMultiPart(TAX_LETTER_UPLOAD_CONSTANT.API.CREATE, HTTP_CONSTANT.CMD_EQUAL + encodeURIComponent(JSON.stringify(data)));
    }

    uploadFile(file : File): Promise<any> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        formData.append('funcKey', TAX_LETTER_UPLOAD_CONSTANT.IMPORT_CONTRACT);
        return this.httpHelper.methodPostMultiPart(TAX_LETTER_UPLOAD_CONSTANT.API.UPLOAD_FILE, formData);
    }

    getListProcessStatus(processId: number, status: number): Promise<any>{
        const params = `processId=${processId}&status=${status}`;
        return this.httpHelper.methodPostService(TAX_LETTER_UPLOAD_CONSTANT.API.LIST_PROCESS_DETAIL_STATUS, params);
    }

    listProcessDetailValid(processId: number): Promise<any>{
        const params = `processId=${processId}`;
        return this.httpHelper.methodPostService(TAX_LETTER_UPLOAD_CONSTANT.API.LIST_PROCESS_DETAIL_VALID, params);
    }
}
