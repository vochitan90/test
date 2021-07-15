import { APP_CONFIG } from 'app/app.config';

export class CONFIRM_INCOME_TAX_CONSTANT {
    static readonly TAXINCOME_LETTER_ATTRIBUTE = 'TAXINCOME_LETTER_ATTRIBUTE';
    static readonly PENDING_ATTRIBUTE = 'PENDING_ATTRIBUTE';
    static readonly SCREEN = {
        ID: 'TAXINCOME_LETTER',
        ACCOUNT: 'ACCOUNT',
        CREATE_TEMPLATE: 'create'
    };
    static readonly LINK = {
        CREATE: '/confirm-income-tax/create',
        LIST: '/confirm-income-tax/list'
    };
    static readonly IMPORT_CONTRACT = 'IMPORT_CONTRACT';

    static readonly COLUMN = {

        // New Field
        CODE: 'taxincomeLetterCode',
        EMP_CODE: "empCode",
        EMP_PAY_YEAR: "empPayYear",
        EMP_NAME: "empName",
        EMP_JOB_TITLE: "empJobtile",
        EMP_TAXCODE: 'empTaxcode',
        VN_WORK_DATE: "vietnamWorkDate",
        EMP_PAY_FROM_DATE: "empPayFromDate",
        EMP_PAY_TO_DATE: "empPayToDate",
        EMP_INCOME_TOTAL: "empIncomeTotal",
        EMP_INCOME_VN: "empIncomeVietnam",
        EMP_INCOME_FOREIGN: "empIncomeForeign",
        EMP_IMCOME_FOREIGN_WITH_HELD: "empIncomeForeignWithheld",
        EMP_TAX_INCOME_WITH_HELD: "empTaxincomeWithheld",
        EMP_INSURANCE_WITH_HELD: "empInsuranceWithheld",
        EMP_OTHER_WITH_HELD: "empOtherWithheld",
        EMP_RENT: "empRent",
        FTS_VALUE: "ftsValue",
        CONTRACT_NO: "contractNo",
        CONTRACT_DATE: "contractDate",
        STATUS: "status",
        BU_NAME: "buName",
        LETTER_AGG_ID: 'aggId',
        BU_ADDRESS: 'buAddress',
        BU_CODE: 'buCode',
        BU_EMAIL: 'buEmail',
        BU_ID: 'buId',
        BU_PHONE: 'buPhone',
        BU_TAXCODE: 'buTaxcode',
        ISSUE_DATE: 'issuedDate',
        NOTE: 'note',
        TAX_INCOMDE_LETTER_CODE: 'taxincomeLetterCode',
        TENANT_CODE: 'tenantCode',
        VIETNAM_WORK_DATE: 'vietnamWorkDate',

        // DEFAUT FIELD
        
        DESCRIPTION: 'description',
        TEMPLATE_TYPE_NAME: 'templateTypeName',
        VERSION: 'version',
        EXT_VALUE: 'extValue',
        MOD_NO: 'modNo',
        NAME: 'name',
        COMPANY_ID: 'companyId',
        RECORD_STATUS: 'recordStatus',
        CHECKER_DATE: 'checkerDate',
        CHECKER_ID: 'checkerId',
        ID: 'id',
        MAKER_ID: 'makerId',
        MAKER_DATE: 'makerDate',
        EFFECTIVE_DATE:'effectiveDate',
        AUTH_STATUS: 'authStatus',
        SEE_ALL_OLD_VERSION : 'seeAllOldVersion',
        DOWNLOAD: 'download',
        ACTION: 'action'
    };
    static readonly API = {

        GET_BU_ACTIVE_FOR_USER: APP_CONFIG.MCR_ETAX + 'services/businessUnitServices/getListBusinessUnitActive',
        GET_SCHEMA_PIVOT: APP_CONFIG.MCR_ETAX + 'services/taxincomeLetterServices/getSchemaPivot',
        PIVOT_PAGING: APP_CONFIG.MCR_ETAX + 'services/taxincomeLetterServices/pivotPaging',
        PIVOT_COUNT: APP_CONFIG.MCR_ETAX + 'services/taxincomeLetterServices/pivotCount',
        CREATE: APP_CONFIG.MCR_ETAX + 'services/taxincomeLetterServices/create',
        UPDATE: APP_CONFIG.MCR_ETAX + 'services/taxincomeLetterServices/update',
        DELETE: APP_CONFIG.MCR_ETAX + 'services/taxincomeLetterServices/delete',
        APPROVE: APP_CONFIG.MCR_ETAX + 'services/taxincomeLetterServices/approve',
        PREVIEW_FILE: APP_CONFIG.MCR_ETAX + 'api/file/reviewtaxincomeletter?',
        GET_TAX_INCOME_DETAIL: APP_CONFIG.MCR_ETAX + 'services/taxincomeLetterServices/getDetail',

        LIST_PROCESS_DETAIL_STATUS: APP_CONFIG.MCR_ETAX + 'services/processUploadServices/listProcessDetailStatus',
        DOWNLOAD_FILE: APP_CONFIG.MCR_ETAX + 'api/file/downloadimport',
        UPLOAD_FILE_TEMP: APP_CONFIG.MCR_ETAX + 'api/file/uploadTemp',
        
        GET_LIST_TEMPLATE_TYPE: APP_CONFIG.MCR_ETAX +  'services/templateDocumentServices/getListTemplateType',
        GET_OLD_VERSION_TEMPLATE_DOC: APP_CONFIG.MCR_ETAX +'services/templateVersionServices/getTemplateVersionActiveByTemplateDoc?',











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