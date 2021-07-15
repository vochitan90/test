import { APP_CONFIG } from 'app/app.config';

export class ISSUE_REGISTRY_UPLOAD_CONSTANT {
    static readonly ISSUE_REGISTRY_UPLOAD_ATTRIBUTE = 'ISSUE_REGISTRY_UPLOAD_ATTRIBUTE';
    static readonly SCREEN = {
        //ID: "ISSUE_REGISTRY_UPLOAD",
        ID: "REGISTRY_TAXINCOME",
        ACCOUNT: 'ACCOUNT',
        CREATE_ACCOUNT: 'create'
    };
    static readonly LINK = {
        LIST: '/issue-registry-upload/list',
    };
    static readonly IMPORT_CONTRACT = 'IMPORT_CONTRACT';
    static readonly FIELD_UPLOAD_EXCEL = {
        
        // New From Tan
        taxincomeLetterCode: "Mã",
        empPayYear: "Xác nhận thu nhập năm",
        empName: "Họ và tên",
        empJobtile: "Chức vụ",
        vietnamWorkDate: "Ngày đến Việt Nam",
        empPayFromDate: "Thu nhập từ ngày",
        empPayToDate: "Thu nhập đến ngày",
        empIncomeTotal: "Số tiền",
        empIncomeVietnam: "Tại Việt Nam",
        empIncomeForeign: "Tại nước ngoài",
        empIncomeForeignWithheld: "Các khoản bị khấu trừ ngoài Việt Nam",
        empTaxincomeWithheld: "Thuế thu nhập cá nhân",
        empInsuranceWithheld: "Bảo hiểm xã hội hoặc các loại bảo hiểm bắt buộc tương tự",
        empOtherWithheld: "Các khoản bị khấu trừ khác",
        empRent: "Số tiền thuê nhà tại Việt Nam",
        contractNo: "Hợp đồng lao động số",
        contractDate: "Ngày hợp đồng",


    };

    static readonly ATTMENT_TYPE = {
        REGISTRY: 1,
        FORM: 2,
        OTHER: 3,
    };

    static readonly STATUS = {
        WAIT_APPROVE: 0,
        APPROVE: 1,
        REJECT: 2,
    };

    static readonly CERT_STATUS = {
        UNKNOWN: 'UNKNOWN',
        GOOD: 'GOOD',
        REVOKED: 'REVOKED',
    };

    static readonly CERT_TAXCODE = {
        CERT_TAX_IS_NULL: 'CERT_TAX_IS_NULL', // không tìm thấy mã số thuế trong chữ ký số
        CERTTAX_NOT_EQ_BUTAX: 'CERTTAX_NOT_EQ_BUTAX', // mã số thuế trong chữ ký số khác mst doanh nghiệp
    };
    
    static readonly COLUMN = {

        // NEW

        AGG_ID: 'aggId',
        BU_ADDRESS: 'buAddress',
        BU_CODE: 'buCode',
        BU_TAX_CODE: 'buTaxcode',
        BU_NAME: 'buName',
        BU_MAJOR: 'buMajor',
        TAX_PLACE_NAME: 'taxPlaceName',
        BU_PATTERN: 'buPattern',
        BU_PHONE: 'buPhone',
        BU_SERIAL: 'buSerial',
        REGISTRY_FORM: 'registryFrom',
        REGISTRY_TO: 'registryTo',
        REGISTRY_YEAR: 'registryYear',
        TAX_PLACE_ID: 'taxPlaceId',
        TAX_PLACE_CODE: 'taxPlaceCode',
        TENANT_CODE: 'tenantCode',
        REGISTRY_AMOUNT: 'registryAmount',
        COMPANY_REGISTRY: 'companyRegistry',

        // OLD
        FILE_PATH: 'filePath',
        DESCRIPTION: 'description',
        CONTENT: 'content',
        MOD_NO: 'modNo',
        COMPAY_ID: 'companyId',
        RECORD_STATUS: 'recordStatus',
        CHECKER_DATE: 'checkerDate',
        CHECKER_ID: 'checkerId',
        ID: 'id',
        FUNCTION_KEY: 'functionKey',
        FTS_VALUE: 'ftsValue',
        MAKER_ID: 'makerId',
        MAKER_DATE: 'makerDate',
        PERCENT_PROCESS: 'percentProcess',
        PROCESS_NAME: 'processName',
        PROCESS_CODE: 'processCode',
        AUTH_STATUS: 'authStatus',
        STATUS: 'status',
        FILE_NAME: 'fileName',
    };
    static readonly API = {
        GET_BU_ACTIVE_FOR_USER: APP_CONFIG.MCR_ETAX + 'services/businessUnitServices/getListBusinessUnitActive',
        GET_ISSUE_REGISTRY_ACTIVE_BY_BU: APP_CONFIG.MCR_ETAX + 'services/issueRegistryServices/getIssueRegistryActive',
        GET_TAX_PLACE: APP_CONFIG.MCR_ETAX + 'services/taxplaceServices/getTaxplace',

        GET_SCHEMA_PIVOT: APP_CONFIG.MCR_ETAX + 'services/registryTaxincomeServices/getSchemaPivot',
        PIVOT_PAGING: APP_CONFIG.MCR_ETAX + 'services/registryTaxincomeServices/pivotPaging',
        PIVOT_COUNT: APP_CONFIG.MCR_ETAX + 'services/registryTaxincomeServices/pivotCount',
        //GET_BY_AGGID: APP_CONFIG.MCR_ETAX_PORTAL + 'services/registryTaxincomeServices/getDetail',
        GET_BY_AGGID: APP_CONFIG.MCR_ETAX + 'services/registryTaxincomeServices/getDetail',

        DOWNLOAD_CERT: APP_CONFIG.MCR_ETAX_PORTAL + 'api/file/downloadCert',

        LIST_PROCESS_DETAIL_STATUS: APP_CONFIG.MCR_ETAX + 'services/processUploadServices/listProcessDetailStatus',
        LIST_PROCESS_DETAIL_VALID: APP_CONFIG.MCR_ETAX + 'services/processUploadServices/listProcessDetailValid',
        
        DOWNLOAD_FILE: APP_CONFIG.MCR_ETAX + 'api/file/downloadimport',
        DOWNLOAD_RESOURCE: APP_CONFIG.MCR_ETAX_PORTAL + 'api/file/downloadresource?',
        PREVIEW_RESOURCE: APP_CONFIG.MCR_ETAX_PORTAL + 'api/file/reviewresource?',

        //UPLOAD_FILE: APP_CONFIG.MCR_EDOC + 'api/file/processImport',
        UPLOAD_FILE: APP_CONFIG.MCR_ETAX + 'api/file/uploadTempPortal',
        ISSUE_IMPORT: APP_CONFIG.MCR_ETAX + 'services/processUploadServices/issueImport',


        // later
        CREATE: APP_CONFIG.MCR_ETAX + 'services/registryTaxincomeServices/create',
        UPDATE: APP_CONFIG.MCR_ETAX + 'accountService/update',
        DELETE: APP_CONFIG.MCR_ETAX + 'accountService/delete',
        BULK_DELETE: APP_CONFIG.MCR_ETAX + 'accountService/bulkDelete',
        PIVOT_PAGING_CONTRACT: APP_CONFIG.MCR_ETAX + 'accountService/pivotPagingByContract',
    };
}
