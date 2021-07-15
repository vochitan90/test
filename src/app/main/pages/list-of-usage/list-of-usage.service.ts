import { Injectable } from '@angular/core';
import { BaseRequestService } from 'app/main/shared/utils/BaseRequestService';
import { AppState, HttpHelper } from '../../shared';
import { LIST_OF_USAGE_CONSTANT } from './list-of-usage.constant';
import { IRevonue } from './models/revonue.interface';

// @Injectable({
//     providedIn: 'root'
// })
@Injectable()
export class ListOfUsageService extends BaseRequestService {

    permissions: any;
    BASE_REQUEST_CONSTANT = LIST_OF_USAGE_CONSTANT;
    constructor(public httpHelper: HttpHelper, public _appState: AppState) {
        super(httpHelper, _appState);
    }

    getProcessUploadUserAttribute(): Promise<any> {
        return this._appState.getAttributeValue(this.BASE_REQUEST_CONSTANT.REPORT_LIST_OF_USAGE_ATTRIBUTE);
    }

    setProcessUploadUserAttribute(value: string): Promise<any> {
        return this._appState.setAttributeValue(this.BASE_REQUEST_CONSTANT.REPORT_LIST_OF_USAGE_ATTRIBUTE, value);
    }

    getListBusinessUnitActiveForUser(): Promise<any> {
        return this.httpHelper.methodGetService(LIST_OF_USAGE_CONSTANT.API.GET_LIST_BUSINESS_UNIT_ACTIVE_FOR_USER);
    }

    getListPatternByBuTaxCode(buTaxCode: string): Promise<any> {
        const params = `buTaxCode=${buTaxCode}`;
        return this.httpHelper.methodPostService(LIST_OF_USAGE_CONSTANT.API.GET_LIST_PATTERN, params);
    }

    getListSerial(buTaxCode: string, pattern: string): Promise<any> {
        const params = `buTaxCode=${buTaxCode}&pattern=${pattern}`;
        return this.httpHelper.methodPostService(LIST_OF_USAGE_CONSTANT.API.GET_LIST_SERIAL, params);
    }

    createRuntimeWithExport(data: IRevonue): Promise<any> {
        return this.httpHelper.methodExportPostJsonService(LIST_OF_USAGE_CONSTANT.API.CREATE_RUNTIME_WITH_EXPORT, data);
    }

    getReportRuntimeByid(reportId: any): Promise<any> {
        return this.httpHelper.methodGetService(LIST_OF_USAGE_CONSTANT.API.GET_REPORT_RUNTIME_BYID + 'id=' + reportId);
    }

}
