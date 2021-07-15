import { Injectable } from '@angular/core';
import { BaseRequestService } from 'app/main/shared/utils/BaseRequestService';
import { AppState, HttpHelper } from '../../shared';
import { ITaxIncome, ITaxIncomeCancel, ITaxIncomeReplace, ITaxIncomeUpload } from './models/taxIncome.interface';
import { TAX_INCOME_CONSTANT } from './taxIncome.constant';

// @Injectable({
//     providedIn: 'root'
// })
@Injectable()
export class TaxIncomeService extends BaseRequestService {
    constructor(public httpHelper: HttpHelper, public _appState: AppState) {
        super(httpHelper, _appState);
    }
    permissions: any;
    BASE_REQUEST_CONSTANT = TAX_INCOME_CONSTANT;

    getProcessUploadUserAttribute(attributeName): Promise<any> {
        return this._appState.getAttributeValue(attributeName);
    }

    setProcessUploadUserAttribute(attributeName, value: string): Promise<any> {
        return this._appState.setAttributeValue(attributeName, value);
    }

    getListBusinessUnitActiveForUser(): Promise<any> {
        return this.httpHelper.methodGetService(TAX_INCOME_CONSTANT.API.GET_LIST_BUSINESS_UNIT_ACTIVE_FOR_USER);
    }

    getListPatternByBuTaxCode(buTaxCode: string): Promise<any> {
        const params = `buTaxCode=${buTaxCode}`;
        return this.httpHelper.methodPostService(TAX_INCOME_CONSTANT.API.GET_LIST_PATTERN, params);
    }

    getListSerial(buTaxCode: string, pattern: string): Promise<any> {
        const params = `buTaxCode=${buTaxCode}&pattern=${pattern}`;
        return this.httpHelper.methodPostService(TAX_INCOME_CONSTANT.API.GET_LIST_SERIAL, params);
    }

    getByAggid(aggId: string): Promise<any> {
        const params = `aggId=${aggId}`;
        return this.httpHelper.methodPostService(TAX_INCOME_CONSTANT.API.GET_BY_AGGID, params);
    }

    create(data: ITaxIncome): Promise<any> {
        const params: string = 'cmd=' + encodeURIComponent(JSON.stringify(data));
        return this.httpHelper.methodPostService(TAX_INCOME_CONSTANT.API.CREATE, params);
    }

    update(data: ITaxIncome): Promise<any> {
        const params: string = 'cmd=' + encodeURIComponent(JSON.stringify(data));
        return this.httpHelper.methodPostService(TAX_INCOME_CONSTANT.API.UPDATE, params);
    }

    delete(ids: string[]): Promise<any> {
        const params = `cmd=${JSON.stringify({ ids })}`;
        return this.httpHelper.methodPostService(TAX_INCOME_CONSTANT.API.DELETE, params);
    }

    issue(ids: string[]): Promise<any> {
        const params = `cmd=${JSON.stringify({ ids })}`;
        return this.httpHelper.methodPostService(TAX_INCOME_CONSTANT.API.ISSUE, params);
    }

    downloadTaxIncome(aggId: string): Promise<any> {
        const params = `aggId=${encodeURIComponent(aggId)}`;
        const url = TAX_INCOME_CONSTANT.API.DOWNLOAD_TAX_INCOME + params;
        return this.httpHelper.methodPostFileService(url, null);
    }

    downloadResource(resourceId: string, isDocFile: boolean): Promise<any> {
        const params = `resourceId=${encodeURIComponent(resourceId)}`;
        const url = TAX_INCOME_CONSTANT.API.DOWNLOAD_RESOURCE + params;
        if (isDocFile) {
            return this.httpHelper.methodDownLoadFileDocx(url, null);
        } else {
            return this.httpHelper.methodDownloadService(url, null);
        }
    }

    cancel(data: ITaxIncomeCancel): Promise<any> {
        const params = 'cmd=' + encodeURIComponent(JSON.stringify(data));
        return this.httpHelper.methodPostService(TAX_INCOME_CONSTANT.API.CANCEL, params);
    }

    replace(data: ITaxIncomeReplace): Promise<any> {
        const params: string = 'cmd=' + encodeURIComponent(JSON.stringify(data));
        return this.httpHelper.methodPostService(TAX_INCOME_CONSTANT.API.REPLACE, params);
    }

    processImportTaxincome(data: ITaxIncomeUpload): Promise<any> {
        const params: string = 'cmd=' + encodeURIComponent(JSON.stringify(data));
        return this.httpHelper.methodPostService(TAX_INCOME_CONSTANT.API.PROCESS_IMPORT_TAXINCOME, params);
    }

    uploadFileTemp(file: File): Promise<any> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.httpHelper.methodPostMultiPart(TAX_INCOME_CONSTANT.API.UPLOAD_TEMP, formData);
    }
}
