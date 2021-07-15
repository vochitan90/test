import { APP_CONFIG } from 'app/app.config';

export class RELEASE_REGISTRATION_CONSTANT {
    static readonly RELEASE_REGISTRATION_ATTRIBUTE = 'ISSUE_REGISTRY_ATTRIBUTE';
    static readonly SCREEN = {
        ID: 'ISSUE_REGISTRY',
        ACCOUNT: 'ACCOUNT',
        CREATE_TEMPLATE: 'create'
    };
    static readonly LINK = {
        CREATE: '/issue-registry/create',
        LIST: '/issue-registry/list'
    };
    static readonly IMPORT_CONTRACT = 'IMPORT_CONTRACT';

    static readonly COLUMN = {
        BU_ID: 'buId',
        BU_EMAIL: 'buEmail',
        ISSUED_DATE: 'issuedDate',
        NOTE: 'note',
        PATTERN: 'pattern',
        DESCRIPTION: 'description',
        EMPIDNO_ISSUEDDATE: 'empIdnoIssuedDate',
        EMP_TAX_CODE: 'empTaxcode',
        TENANT_CODE: 'tenantCode',
        BU_ADDRESS: 'buAddress',
        MOD_NO: 'modNo',
        EMP_PAY_FROMDATE: 'empPayFromDate',
        EMP_IDNO_ISSUED_PLACE: 'empIdnoIssuedPlace',
        CHECKER_DATE: 'checkerDate',
        EMP_NAME: 'empName',
        ID: 'id',
        EMP_PAY_TODATE: 'empPayToDate',
        MAKER_ID: 'makerId',
        MAKER_DATE: 'makerDate',
        TAX_INCOMENO: 'taxincomeNo',
        EMP_IDNO: 'empIdno',
        AUTH_STATUS: 'authStatus',
        BU_CODE: 'buCode',
        BU_NAME: 'buName',
        EMP_PAY_YEAR: 'empPayYear',
        BU_TAX_CODE: 'buTaxcode',
        RECORD_STATUS: 'recordStatus',
        EMP_CODE: 'empCode',
        SERIAL: 'serial',
        CHECKER_ID: 'checkerId',
        EMP_IS_RESIDENT: 'empIsResident',
        BU_PHONE: 'buPhone',
        AGG_ID: 'aggId',
        STATUS: 'status',
        DECISION_NO: 'decisionNo',
        ISSUE_AMOUNT: 'issueAmount',
        ISSUE_FROM: 'issueFrom',
        ISSUE_YEAR: 'issueYear',
        EXT_VALUE: 'extValue',
        TAX_PLACE: 'taxPlace',
        FORMATTED_ADDRESS: 'formattedAddress',
        CONTACT_PHONE: 'contactPhone',
        FTS_VALUE: 'ftsValue',
        FULL_ADDRESS: 'fullAddress',
        LOCALITY_ID: 'localityId',
        MAJOR_INFO: 'majorInfo',
        REPRESENTATIVE_ADDRESS: 'representativeAddress',
        REPRESENTATIVE_NAME: 'representativeName',
        REPRESENTATIVE_PHONE: 'representativePhone',
        STREET_NUMBER: 'streetNumber',
        ISSUE_REGISTRY_CODE: 'issueRegistryCode',

    };
    static readonly API = {

        GET_BU_ACTIVE_FOR_USER: APP_CONFIG.MCR_ETAX + 'services/businessUnitServices/getListBusinessUnitActive',
        GET_TAX_PLACE: APP_CONFIG.MCR_ETAX + 'services/taxplaceServices/getTaxplace',
        GET_ISSUE_AMOUNT: APP_CONFIG.MCR_ETAX + 'services/skuServices/getSku',
        GET_BU_DETAIL: APP_CONFIG.MCR_ETAX + 'services/businessUnitServices/businessUnitDetail',

        GET_ISSUE_REGISTRY_DETAIL: APP_CONFIG.MCR_ETAX + 'services/issueRegistryServices/getCttbIssueRegistryDetail',

        GET_SCHEMA_PIVOT: APP_CONFIG.MCR_ETAX + 'services/issueRegistryServices/getSchemaPivot',
        PIVOT_PAGING: APP_CONFIG.MCR_ETAX + 'services/issueRegistryServices/pivotPaging',
        PIVOT_COUNT: APP_CONFIG.MCR_ETAX + 'services/issueRegistryServices/pivotCount',

        CREATE: APP_CONFIG.MCR_ETAX + 'services/issueRegistryServices/create',
        UPDATE: APP_CONFIG.MCR_ETAX + 'services/issueRegistryServices/update',
        DELETE: APP_CONFIG.MCR_ETAX + 'services/issueRegistryServices/delete',
        APPROVE: APP_CONFIG.MCR_ETAX + 'services/issueRegistryServices/approve',
        PREVIEW_FILE: APP_CONFIG.MCR_ETAX + 'api/file/reviewissueregistry?',
        PREVIEW_FILE_ETAX_PORTAL: APP_CONFIG.MCR_ETAX_PORTAL + 'api/file/reviewissueregistry?',
        UPLOAD_FILE_SIGNED: APP_CONFIG.MCR_ETAX + 'api/file/uploadsigned',
        UPLOAD_FILE_SIGNED_V2: APP_CONFIG.MCR_ETAX + 'api/file/uploadiregistrysigned',
        GET_CERT_BY_AGGID: APP_CONFIG.MCR_ETAX + 'services/issueRegistryServices/getCert',

        //UPLOAD_FILE: APP_CONFIG.MCR_ETAX + 'api/file/downloadissueregistry?',
        DOWNLOAD_FILE: APP_CONFIG.MCR_ETAX + 'api/file/downloadissueregistry?',
        DOWNLOAD_FILE_V2: APP_CONFIG.MCR_ETAX + 'api/file/downloadissueregistrybase64?',
    };
}

