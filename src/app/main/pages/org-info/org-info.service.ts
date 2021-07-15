import { Injectable } from '@angular/core';
import { APP_CONFIG } from 'app/app.config';
import { AG_GRID_CONSTANT, HTTP_CONSTANT } from 'app/main/shared/const/app.constant';
import { BaseRequestService } from 'app/main/shared/utils/BaseRequestService';
import { AppState, HttpHelper } from '../../shared';
import { ORG_INFO_CONSTANT } from './org-info.constant';

// @Injectable({
//     providedIn: 'root'
// })
@Injectable()
export class OrgInfoService extends BaseRequestService {
    
    permissions: any;
    BASE_REQUEST_CONSTANT = ORG_INFO_CONSTANT;
    constructor(public httpHelper: HttpHelper, public _appState: AppState) {
        super(httpHelper, _appState);
    }

    getProvince(): Promise<any> {
        return this.httpHelper.methodGetService(ORG_INFO_CONSTANT.API.GET_PROVINCES);
    }

    getDictricts(provinceId): Promise<any> {  
        return this.httpHelper.methodPostJsonServiceNew(ORG_INFO_CONSTANT.API.GET_DISTRICTS, provinceId);
    }

    getWards(districtId): Promise<any> {
        return this.httpHelper.methodPostJsonServiceNew(ORG_INFO_CONSTANT.API.GET_WARDS, districtId);
    }

    rebuildObjectForCreate(formData): any{
        return {
            tenantCode: "ETAX",
            parentId: "",
            code: formData.code,
            name: formData.organizationPayingIncome,
            aliasName: "",
            description: "",
            extValue: null,
            taxcode: formData.taxCode,
            majorInfo: formData.business,
            hotline: "0283784763",
            contactPhone: formData.phoneNumberOrganization,
            contactEmail: formData.contactEmail,
            website: "",
            representativeName: formData.legalRepresentativeName,
            representativeAddress: formData.addressRepresentative,
            representativePhone: formData.phoneNumberRepresentative,
            addressObj: {
                streetNumber: formData.address,
                provinceId: formData.cityProvince.id,
                districtId: formData.countyDistrictTown.id,
                wardId: formData.wards.id
            }
        }
    }

    rebuildObjectForUpdate(formData, itemId, addressId){
        return {
            id: itemId,
            tenantCode: "ETAX",
            parentId: "",
            code: formData.code,
            name: formData.organizationPayingIncome,
            aliasName: "",
            description: "",
            extValue: null,
            taxcode: formData.taxCode,
            majorInfo: formData.business,
            hotline: "0283784763",
            contactPhone: formData.phoneNumberOrganization,
            contactEmail: formData.contactEmail,
            website: "",
            representativeName: formData.legalRepresentativeName,
            representativeAddress: formData.addressRepresentative,
            representativePhone: formData.phoneNumberRepresentative,
            addressObj: {
                id: addressId,
                streetNumber: formData.address,
                provinceId: formData.cityProvince.id,
                districtId: formData.countyDistrictTown.id,
                wardId: formData.wards.id
            }
        }
    }

    createOrgInfo(formData: any) : Promise<any>{
        const obj: any = this.rebuildObjectForCreate(formData);
        const params: string = 'cmd=' + encodeURIComponent(JSON.stringify(obj));
        return this.httpHelper.methodPostService(ORG_INFO_CONSTANT.API.CREATE, params, APP_CONFIG.COMMAND_TIME_OUT);
    }

    updateOrgInfo(formData: any, itemId: number, addressId: number) : Promise<any>{
        const obj: any = this.rebuildObjectForUpdate(formData, itemId, addressId);
        const params: string = 'cmd=' + encodeURIComponent(JSON.stringify(obj));
        return this.httpHelper.methodPostService(ORG_INFO_CONSTANT.API.UPDATE, params, APP_CONFIG.COMMAND_TIME_OUT);
    }

    deleteOrgInfo(itemId: any) : Promise<any>{
        const obj: any = {
            id: itemId,
        }
        const params: string = 'cmd=' + encodeURIComponent(JSON.stringify(obj));
        return this.httpHelper.methodPostService(ORG_INFO_CONSTANT.API.DELETE, params, APP_CONFIG.COMMAND_TIME_OUT);
    }

    getBusinessUnitDetail(itemId) : Promise<any>{
        return this.httpHelper.methodPostJsonServiceNew(ORG_INFO_CONSTANT.API.GET_BU_DETAIL, {id: itemId});
    }




















    
    getProcessUploadUserAttribute(): Promise<any> {
        return this._appState.getAttributeValue(ORG_INFO_CONSTANT.TEMPLATE_ATTRIBUTE);
    }

    setProcessUploadUserAttribute(value: string): Promise<any> {
        return this._appState.setAttributeValue(ORG_INFO_CONSTANT.TEMPLATE_ATTRIBUTE, value);
    }

    downloadFileImport(id: number): Promise<any> {
        return this.httpHelper.methodDownLoadFileDocx(ORG_INFO_CONSTANT.API.DOWNLOAD_FILE, 'id=' + id);
    }

    uploadFileTemp(file: File): Promise<any> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.httpHelper.methodPostMultiPart(ORG_INFO_CONSTANT.API.UPLOAD_FILE_TEMP, formData);
    }

    createTemplateFile(data): Promise<any> {
        return this.httpHelper.methodPostMultiPart(ORG_INFO_CONSTANT.API.CREATE, HTTP_CONSTANT.CMD_EQUAL + encodeURIComponent(JSON.stringify(data)));
    }

    updateTemplateFile(data): Promise<any> {
        return this.httpHelper.methodPostMultiPart(ORG_INFO_CONSTANT.API.UPDATE, HTTP_CONSTANT.CMD_EQUAL + encodeURIComponent(JSON.stringify(data)));
    }

    getListTemplateType(): Promise<any> {
        return this.httpHelper.methodGetService(ORG_INFO_CONSTANT.API.GET_LIST_TEMPLATE_TYPE);
    }

    getTemplateVersionDetail(id: number): Promise<any> {
        return this.httpHelper.methodGetService(ORG_INFO_CONSTANT.API.GET_TEMPLATE_VERSION_DETAIL+'id='+id);
    }


    getListOldVersion(id: number): Promise<any>{
        return this.httpHelper.methodGetService(ORG_INFO_CONSTANT.API.GET_OLD_VERSION_TEMPLATE_DOC + 'templateDocId=' + id);
    }

    countListOldVersion(): Promise<any>{
        return this.httpHelper.methodPostService(ORG_INFO_CONSTANT.API.TEMPLATE_VERION_PIVOT_COUNT, HTTP_CONSTANT.REQUEST_EQUAL + encodeURIComponent(JSON.stringify(AG_GRID_CONSTANT.PARAMS_COUNT)));
    }

    downloadTemplateVersion(id: number): Promise<any> {
        return this.httpHelper.methodDownLoadFileDocx(ORG_INFO_CONSTANT.API.TEMPLATE_VERION_DOWNLOAD_TEMPLATE, 'id=' + id);
    }

    approve(data): Promise<any> {
        return this.httpHelper.methodPostService(ORG_INFO_CONSTANT.API.TEMPLATE_VERION_APPROVE, HTTP_CONSTANT.CMD_EQUAL+ encodeURIComponent(JSON.stringify(data)));
    }

    activeDeActiveTemplate(data): Promise<any>{
        return this.httpHelper.methodPostService(ORG_INFO_CONSTANT.API.TEMPLATE_VERION_ACTIVE_DEACTION, HTTP_CONSTANT.CMD_EQUAL+ encodeURIComponent(JSON.stringify(data)));
    }

}
