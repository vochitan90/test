import { Injectable } from '@angular/core';
import { APP_CONFIG } from 'app/app.config';
import { HTTP_CONSTANT } from 'app/main/shared/const/app.constant';
import { BaseRequestService } from 'app/main/shared/utils/BaseRequestService';
import { AppState, HttpHelper } from '../../shared';
import { RELEASE_REGISTRATION_CONSTANT } from './releaseRegistration.constant';
import * as client from 'lcs-usbtoken';

// @Injectable({
//     providedIn: 'root'
// })
@Injectable()
export class ReleaseRegistrationService extends BaseRequestService {
    permissions: any;
    BASE_REQUEST_CONSTANT = RELEASE_REGISTRATION_CONSTANT;
    constructor(public httpHelper: HttpHelper, public _appState: AppState) {
        super(httpHelper, _appState);
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
        return this.httpHelper.methodGetService(RELEASE_REGISTRATION_CONSTANT.API.GET_BU_ACTIVE_FOR_USER);
    }

    getListTaxPlace(){
        return this.httpHelper.methodGetService(RELEASE_REGISTRATION_CONSTANT.API.GET_TAX_PLACE);
    }

    getIssueAmount(){
        return this.httpHelper.methodGetService(RELEASE_REGISTRATION_CONSTANT.API.GET_ISSUE_AMOUNT);
    }

    getBusinessUnitDetail(itemId){
        return this.httpHelper.methodPostJsonServiceNew(RELEASE_REGISTRATION_CONSTANT.API.GET_BU_DETAIL, { id: itemId});
    }

    getIssueRegistryDetail(itemId){ 
        return this.httpHelper.methodPostJsonServiceNew(RELEASE_REGISTRATION_CONSTANT.API.GET_ISSUE_REGISTRY_DETAIL, { id: itemId});
    }

    createRR(data){
        return this.httpHelper.methodPostService(RELEASE_REGISTRATION_CONSTANT.API.CREATE, HTTP_CONSTANT.CMD_EQUAL + encodeURIComponent(JSON.stringify(data)), APP_CONFIG.COMMAND_TIME_OUT);
    }

    updateRR(data){
        return this.httpHelper.methodPostService(RELEASE_REGISTRATION_CONSTANT.API.UPDATE, HTTP_CONSTANT.CMD_EQUAL + encodeURIComponent(JSON.stringify(data)), APP_CONFIG.COMMAND_TIME_OUT);
    }

    approveRR(data){
        return this.httpHelper.methodPostService(RELEASE_REGISTRATION_CONSTANT.API.APPROVE, HTTP_CONSTANT.CMD_EQUAL + encodeURIComponent(JSON.stringify(data)), APP_CONFIG.COMMAND_TIME_OUT);
    }

    deleteRR(id){
        // const obj: any = {
        //     id: itemId,
        // }
        //const params: string = 'cmd=' + encodeURIComponent(JSON.stringify(obj));

        const params = `cmd=${JSON.stringify({ id })}`;
        return this.httpHelper.methodPostService(RELEASE_REGISTRATION_CONSTANT.API.DELETE, params, APP_CONFIG.COMMAND_TIME_OUT);
    }

    downloadFile(id){
        return this.httpHelper.methodPostFileService(RELEASE_REGISTRATION_CONSTANT.API.DOWNLOAD_FILE + 'id=' + id, null, APP_CONFIG.COMMAND_TIME_OUT);
        //return this.httpHelper.methodPostFileService("https://app-dev.lcssoft.com.vn/gwetax/mcretax/api/file/reviewtaxincome?aggId=a6de4ec0-4aaa-4dd7-8c3d-1f6e3ab3c0a6", null, APP_CONFIG.COMMAND_TIME_OUT);
    }

    downloadFileV2(id){
        return this.httpHelper.methodPostService(RELEASE_REGISTRATION_CONSTANT.API.DOWNLOAD_FILE_V2 + 'id=' + id, null, APP_CONFIG.COMMAND_TIME_OUT);
        //return this.httpHelper.methodPostFileService("https://app-dev.lcssoft.com.vn/gwetax/mcretax/api/file/reviewtaxincome?aggId=a6de4ec0-4aaa-4dd7-8c3d-1f6e3ab3c0a6", null, APP_CONFIG.COMMAND_TIME_OUT);
    }

    connectWs(wsUrl, cb){
        return client.connectWs(wsUrl, cb);
    }

    healthcheck(wsUrl, callBack){
        return client.healthcheck(wsUrl, callBack);
    }

    checkLogin(wsUrl, params, callBack){
        return client.checkLogin(wsUrl, params, callBack);
    }

    getUsbToken(wsUrl, tokenPin, callBack){
        const params = {
            "tokenPin": tokenPin,
            "tokenSerial": "",
            "version": "1.0.0"
        }
        return client.getUsbToken(wsUrl, params, callBack);
    }

    signDoc(wsUrl, param, callBack){
        return client.signDoc(wsUrl, param, callBack);
    }

    // uploadFile(file : File): Promise<any> {
    //     const formData: FormData = new FormData();
    //     formData.append('file', file, file.name);
    //     formData.append('funcKey', RELEASE_REGISTRATION_CONSTANT.IMPORT_CONTRACT);
    //     return this.httpHelper.methodPostMultiPart(RELEASE_REGISTRATION_CONSTANT.API.UPLOAD_FILE, formData);
    // }

    uploadsigned(file){
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.httpHelper.methodPostMultiPart(RELEASE_REGISTRATION_CONSTANT.API.UPLOAD_FILE_SIGNED + "?iregistryAttachmentId=24", formData);
    }

    getCertByAggid(aggId: string): Promise<any> {
        const params = `aggId=${aggId}`;
        return this.httpHelper.methodPostService(RELEASE_REGISTRATION_CONSTANT.API.GET_CERT_BY_AGGID, params);
    }

    uploadsignedV2(bae64, cttbIssueRegistryAttachmentId){
        const params = `database64=${encodeURIComponent(bae64)}&iregistryAttachmentId=${cttbIssueRegistryAttachmentId}`;
        return this.httpHelper.formPost(RELEASE_REGISTRATION_CONSTANT.API.UPLOAD_FILE_SIGNED_V2, params , APP_CONFIG.COMMAND_TIME_OUT);
    }

    getProcessUploadUserAttribute(): Promise<any> {
        return this._appState.getAttributeValue(RELEASE_REGISTRATION_CONSTANT.RELEASE_REGISTRATION_ATTRIBUTE);
    }

    setProcessUploadUserAttribute(value: string): Promise<any> {
        return this._appState.setAttributeValue(RELEASE_REGISTRATION_CONSTANT.RELEASE_REGISTRATION_ATTRIBUTE, value);
    }

    
}
