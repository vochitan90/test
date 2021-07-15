import { APP_CONFIG } from 'app/app.config';

export class ORG_INFO_CONSTANT {
    static readonly TEMPLATE_ATTRIBUTE = 'BUSINESS_UNIT_ATTRIBUTE'; // mỗi màn hình có attribute riêng
    static readonly PENDING_ATTRIBUTE = 'PENDING_ATTRIBUTE';
    static readonly SCREEN = {
        ID: "BUSINESS_UNIT",
        ORG_INFO: 'ORG_INFO',
        CREATE_TEMPLATE: 'create'
    };
    static readonly LINK = { // link chuyển hướng
        CREATE: '/org-info/create',
        LIST: '/org-info/list'

    };
    static readonly IMPORT_CONTRACT = 'IMPORT_CONTRACT';

    static readonly COLUMN = {

        
        ORGANIZATION_PAYING_INCOME: '',
        TAX_CODE: 'taxcode',
        PHONE_NUMBER: 'contactPhone',
        BUSINESS: '',
        ADDRESS: '',
        CITY_PROVINCE: '',
        COUNTY_DISTRICT_TOWN: '',
        WARDS: '',
        LEGAL_REPRESENTATIVE_NAME: 'representativeName',
        DENOMINATOR: '',
        SYMBOL: '',
        YEAR_OF_USE: '',
        AMOUNT: '',
        STARTING_NUMBER: '',
        FULL_ADDRESS: 'fullAddress',


        // OLD
        COMPANY_CODE: 'companyCode',
        ALIAS_NAME:'aliasName',
        CODE: 'code',
        TEMPLATE_VERSION_ID: 'templateVersionId',
        DESCRIPTION: 'description',
        TEMPLATE_TYPE_NAME: 'templateTypeName',
        VERSION: 'version',
        EXT_VALUE: 'extValue',
        TEMPLATE_TYPE_CODE: 'templateTypeCode',
        TEMPLATE_TYPE_ID:'templateTypeId',
        TEMPLATE_TYPE_VERSION_ID: 'templateVersionId',
        MOD_NO: 'modNo',
        NAME: 'name',
        COMPANY_ID: 'companyId',
        RECORD_STATUS: 'recordStatus',
        CHECKER_DATE: 'checkerDate',
        CHECKER_ID: 'checkerId',
        ID: 'id',
        FTS_VALUE: 'ftsValue',
        MAKER_ID: 'makerId',
        MAKER_DATE: 'makerDate',
        EFFECTIVE_DATE:'effectiveDate',
        AUTH_STATUS: 'authStatus',
        SEE_ALL_OLD_VERSION : 'seeAllOldVersion',
        DOWNLOAD: 'download',
        ACTION: 'action',
        ADDRESS_ID: 'addressId',
        BUSSINESS_UNITTYPE_ID: 'businessUnittypeId',
        CONTACT_EMAIL: 'contactEmail',
        FORMATTED_ADDRESS: 'formattedAddress',
        REPRESENTATIVE_ADDRESS: 'representativeAddress',
        HOT_LINE: 'hotline',
        LOCALITY_ID: 'localityId',
        MAJOR_INFO: 'majorInfo',
        PARENT_CODE: 'parentCode',
        PARENT_ID: 'parentId',
        PARENT_NAME: 'parentName',
        REPRESENTATIVE_PHONE: 'representativePhone',
        STREET_NUMBER: 'streetNumber',
        TENANT_CODE: 'tenantCode', 
        WEBSITE: 'website',

        STATUS: 'status',

    };
    static readonly API = {
        GET_SCHEMA_PIVOT: APP_CONFIG.MCR_ETAX + 'services/businessUnitServices/getSchemaPivot',
        PIVOT_PAGING: APP_CONFIG.MCR_ETAX + 'services/businessUnitServices/pivotPaging',
        PIVOT_COUNT: APP_CONFIG.MCR_ETAX + 'services/businessUnitServices/pivotCount',
        CREATE: APP_CONFIG.MCR_ETAX + 'services/businessUnitServices/create',
        UPDATE: APP_CONFIG.MCR_ETAX + 'services/businessUnitServices/update',
        DELETE: APP_CONFIG.MCR_ETAX + 'services/businessUnitServices/delete',
        
        // From Tan
        GET_PROVINCES: APP_CONFIG.MCR_ETAX + 'services/localityServices/province',
        GET_DISTRICTS: APP_CONFIG.MCR_ETAX + 'services/localityServices/district',
        GET_WARDS: APP_CONFIG.MCR_ETAX + 'services/localityServices/ward',

        GET_BU_DETAIL: APP_CONFIG.MCR_ETAX + 'services/businessUnitServices/businessUnitDetail',




        LIST_PROCESS_DETAIL_STATUS: APP_CONFIG.MCR_EDOC + 'services/processUploadServices/listProcessDetailStatus',
        DOWNLOAD_FILE: APP_CONFIG.MCR_EDOC + 'api/file/downloadimport',
        UPLOAD_FILE_TEMP: APP_CONFIG.MCR_EDOC + 'api/file/uploadTemp',

        GET_LIST_TEMPLATE_TYPE: APP_CONFIG.MCR_EDOC +  'services/templateDocumentServices/getListTemplateType',
        GET_OLD_VERSION_TEMPLATE_DOC: APP_CONFIG.MCR_EDOC +'services/templateVersionServices/getTemplateVersionActiveByTemplateDoc?',

        // later
        TEMPLATE_VERION_GET_SCHEMA_PIVOT: APP_CONFIG.MCR_EDOC + 'services/templateVersionServices/getSchemaPivot',
        TEMPLATE_VERION_PIVOT_PAGING: APP_CONFIG.MCR_EDOC + 'services/templateVersionServices/pivotPaging',
        TEMPLATE_VERION_PIVOT_COUNT: APP_CONFIG.MCR_EDOC + 'services/templateVersionServices/pivotCount',
        TEMPLATE_VERION_DOWNLOAD_FILE: APP_CONFIG.MCR_EDOC + 'api/file/downloadimport',
        TEMPLATE_VERION_UPLOAD_FILE_TEMP: APP_CONFIG.MCR_EDOC + 'api/file/uploadTemp',
        TEMPLATE_VERION_CREATE: APP_CONFIG.MCR_EDOC + 'services/templateVersionServices/create',
        TEMPLATE_VERION_ACTIVE_DEACTION: APP_CONFIG.MCR_EDOC + 'services/templateVersionServices/activeDeactive',
        TEMPLATE_VERION_GET_TEMPLATE_VERSION_ACTIVE_BY_TE :APP_CONFIG.MCR_EDOC + 'services/templateVersionServices/getTemplateVersionActiveByTe',
        TEMPLATE_VERION_GET_ALL_TEMPLATE_VERSION_ACTIVE_BY_TE :APP_CONFIG.MCR_EDOC + 'services/templateVersionServices/getAllTemplateVersionByTemplateDoc',
        GET_TEMPLATE_VERSION_DETAIL :APP_CONFIG.MCR_EDOC + 'services/templateVersionServices/getTemplateVersionDetail?',
        TEMPLATE_VERION_DOWNLOAD_TEMPLATE :APP_CONFIG.MCR_EDOC + 'api/file/downloadTemplateVersion',

        TEMPLATE_VERION_APPROVE: APP_CONFIG.MCR_EDOC +'services/templateVersionServices/approve',
        TEMPLATE_VERION_UPDATE: APP_CONFIG.MCR_EDOC +'services/templateVersionServices/update',
        
    };
}


// M - > tạo mớiLê, 16:39P - > chờ duyệt A -> approveR -> reject
// A P không được update