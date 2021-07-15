import { Injectable } from '@angular/core';
import { APP_CONFIG } from 'app/app.config';
import { AG_GRID_CONSTANT, HTTP_CONSTANT } from 'app/main/shared/const/app.constant';
import { BaseRequestService } from 'app/main/shared/utils/BaseRequestService';
import { AppState, HttpHelper } from '../../shared';
import { CONFIRM_INCOME_TAX_CONSTANT } from './confirm-income-tax.constant';

// @Injectable({
//     providedIn: 'root'
// })
@Injectable()
export class ConfirmIncomeTaxService extends BaseRequestService {
    permissions: any;
    BASE_REQUEST_CONSTANT = CONFIRM_INCOME_TAX_CONSTANT;
    constructor(public httpHelper: HttpHelper, public _appState: AppState) {
        super(httpHelper, _appState);
    }
    
    getProcessUploadUserAttribute(): Promise<any> {
        return this._appState.getAttributeValue(CONFIRM_INCOME_TAX_CONSTANT.TAXINCOME_LETTER_ATTRIBUTE);
    }

    setProcessUploadUserAttribute(value: string): Promise<any> {
        return this._appState.setAttributeValue(CONFIRM_INCOME_TAX_CONSTANT.TAXINCOME_LETTER_ATTRIBUTE, value);
    }

    // Continue here
    createCIT(data){
        const params: string = 'cmd=' + encodeURIComponent(JSON.stringify(data));
        return this.httpHelper.methodPostService(CONFIRM_INCOME_TAX_CONSTANT.API.CREATE, params, APP_CONFIG.COMMAND_TIME_OUT);
    }

    updateCIT(data){
        const params: string = 'cmd=' + encodeURIComponent(JSON.stringify(data));
        return this.httpHelper.methodPostService(CONFIRM_INCOME_TAX_CONSTANT.API.UPDATE, params, APP_CONFIG.COMMAND_TIME_OUT);
    }

    deleteCIT(id){
        const params = `cmd=${JSON.stringify({ id })}`;
        return this.httpHelper.methodPostService(CONFIRM_INCOME_TAX_CONSTANT.API.DELETE, params, APP_CONFIG.COMMAND_TIME_OUT);
    }

    approveRR(data){
        return this.httpHelper.methodPostService(CONFIRM_INCOME_TAX_CONSTANT.API.APPROVE, HTTP_CONSTANT.CMD_EQUAL + encodeURIComponent(JSON.stringify(data)), APP_CONFIG.COMMAND_TIME_OUT);
    }

    createListOfYears(currentYear, numberOfYear): any[]{
        var backToTwoYears = currentYear - 2;
        var listOfYear = [];
        for (let i = 0; i < numberOfYear; ++i) {
            listOfYear.push({
                id: i,
                value: ""+(backToTwoYears + i)
            });
        }
        return listOfYear;
    }

    getListBusinessUnitActiveForUser(){
        return this.httpHelper.methodGetService(CONFIRM_INCOME_TAX_CONSTANT.API.GET_BU_ACTIVE_FOR_USER);
    }

    getTaxIncomeLetterDetail(itemId){ 
        return this.httpHelper.methodPostJsonServiceNew(CONFIRM_INCOME_TAX_CONSTANT.API.GET_TAX_INCOME_DETAIL, { id: itemId});
    }









    

    downloadFileImport(id: number): Promise<any> {
        return this.httpHelper.methodDownLoadFileDocx(CONFIRM_INCOME_TAX_CONSTANT.API.DOWNLOAD_FILE, 'id=' + id);
    }

    uploadFileTemp(file: File): Promise<any> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.httpHelper.methodPostMultiPart(CONFIRM_INCOME_TAX_CONSTANT.API.UPLOAD_FILE_TEMP, formData);
    }

    createTemplateFile(data): Promise<any> {
        return this.httpHelper.methodPostMultiPart(CONFIRM_INCOME_TAX_CONSTANT.API.CREATE, HTTP_CONSTANT.CMD_EQUAL + encodeURIComponent(JSON.stringify(data)));
    }

    updateTemplateFile(data): Promise<any> {
        return this.httpHelper.methodPostMultiPart(CONFIRM_INCOME_TAX_CONSTANT.API.UPDATE, HTTP_CONSTANT.CMD_EQUAL + encodeURIComponent(JSON.stringify(data)));
    }

    getListTemplateType(): Promise<any> {
        return this.httpHelper.methodGetService(CONFIRM_INCOME_TAX_CONSTANT.API.GET_LIST_TEMPLATE_TYPE);
    }

    getTemplateVersionDetail(id: number): Promise<any> {
        return this.httpHelper.methodGetService(CONFIRM_INCOME_TAX_CONSTANT.API.GET_TEMPLATE_VERSION_DETAIL+'id='+id);
    }


    getListOldVersion(id: number): Promise<any>{
        return this.httpHelper.methodGetService(CONFIRM_INCOME_TAX_CONSTANT.API.GET_OLD_VERSION_TEMPLATE_DOC + 'templateDocId=' + id);
    }

    countListOldVersion(): Promise<any>{
        return this.httpHelper.methodPostService(CONFIRM_INCOME_TAX_CONSTANT.API.TEMPLATE_VERION_PIVOT_COUNT, HTTP_CONSTANT.REQUEST_EQUAL + encodeURIComponent(JSON.stringify(AG_GRID_CONSTANT.PARAMS_COUNT)));
    }

    downloadTemplateVersion(id: number): Promise<any> {
        return this.httpHelper.methodDownLoadFileDocx(CONFIRM_INCOME_TAX_CONSTANT.API.TEMPLATE_VERION_DOWNLOAD_TEMPLATE, 'id=' + id);
    }

    approve(data): Promise<any> {
        return this.httpHelper.methodPostService(CONFIRM_INCOME_TAX_CONSTANT.API.TEMPLATE_VERION_APPROVE, HTTP_CONSTANT.CMD_EQUAL+ encodeURIComponent(JSON.stringify(data)));
    }

    activeDeActiveTemplate(data): Promise<any>{
        return this.httpHelper.methodPostService(CONFIRM_INCOME_TAX_CONSTANT.API.TEMPLATE_VERION_ACTIVE_DEACTION, HTTP_CONSTANT.CMD_EQUAL+ encodeURIComponent(JSON.stringify(data)));
    }
    

}
