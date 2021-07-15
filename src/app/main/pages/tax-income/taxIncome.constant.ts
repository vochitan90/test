import { APP_CONFIG } from 'app/app.config';

export class TAX_INCOME_CONSTANT {
    static readonly TAXINCOME_NEW_ATTRIBUTE = 'TAXINCOME_NEW_ATTRIBUTE';
    static readonly TAXINCOME_ISSUSE_ATTRIBUTE = 'TAXINCOME_ISSUSE_ATTRIBUTE';
    static readonly TAXINCOME_DELETE_ATTRIBUTE = 'TAXINCOME_DELETE_ATTRIBUTE';

    static readonly SCREEN = {
        TAXINCOME: 'TAXINCOME',
        CREATE: 'create'
    };
    static readonly STATUS = {
        NEW: 0,
        ISSUE: 1,
        CANCEL: 2,
        REPLACE: 3,
        REPLACED: 4
    };
    static readonly LINK = {
        CREATE: '/tax-income/create',
        LIST_NEW: '/tax-income/new',
    };

    static readonly COLUMN = {
        EMP_PERSONALTAX_WITHHELD: 'empPersonaltaxWithheld',
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
        TAXINCOME_NO: 'taxincomeNo',
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
        BU_ID: 'buId',
        FTS_VALUE: 'ftsValue',
        EMP_TAXINCOME_CALCULATION: 'empTaxincomeCalculation',
        EMP_CONTACT_ADDRESS: 'empContactAddress',
        EMP_CONTACT_PHONE: 'empContactPhone',
        EMP_INCOME_TYPE: 'empIncomeType',
        EMP_NATIONALITY: 'empNationality',
        EMP_PAY_FROM_MONTH: 'empPayFromMonth',
        EMP_PAY_TO_MONTH: 'empPayToMonth',
        EMP_TAXINCOME_WITHHELD: 'empTaxincomeWithheld',
    };
    static readonly API = {
        GET_SCHEMA_PIVOT: APP_CONFIG.MCR_ETAX + 'services/taxincomeServices/getSchemaPivot',
        PIVOT_PAGING: APP_CONFIG.MCR_ETAX + 'services/taxincomeServices/pivotPaging',
        PIVOT_COUNT: APP_CONFIG.MCR_ETAX + 'services/taxincomeServices/pivotCount',
        GET_LIST_BUSINESS_UNIT_ACTIVE_FOR_USER: APP_CONFIG.MCR_ETAX + 'services/taxincomeServices/getListBusinessUnitActiveForUser',
        GET_LIST_PATTERN: APP_CONFIG.MCR_ETAX + 'services/taxincomeServices/getListPattern',
        GET_LIST_SERIAL: APP_CONFIG.MCR_ETAX + 'services/taxincomeServices/getListSerial',
        GET_BY_AGGID: APP_CONFIG.MCR_ETAX + 'services/taxincomeServices/getByAggId',
        CREATE: APP_CONFIG.MCR_ETAX + 'services/taxincomeServices/create',
        UPDATE: APP_CONFIG.MCR_ETAX + 'services/taxincomeServices/update',
        DELETE: APP_CONFIG.MCR_ETAX + 'services/taxincomeServices/delete',
        ISSUE: APP_CONFIG.MCR_ETAX + 'services/taxincomeServices/issue',
        DOWNLOAD_TAX_INCOME: APP_CONFIG.MCR_ETAX + 'api/file/downloadtaxincome?',
        DOWNLOAD_RESOURCE: APP_CONFIG.MCR_ETAX + 'api/file/downloadresource?',
        REVIEW_TAXINCOME: APP_CONFIG.MCR_ETAX + 'api/file/reviewtaxincome?',
        UPLOAD_TEMP: APP_CONFIG.MCR_ETAX + 'api/file/uploadTemp?',
        REPLACE: APP_CONFIG.MCR_ETAX + 'services/taxincomeServices/replace',
        CANCEL: APP_CONFIG.MCR_ETAX + 'services/taxincomeServices/cancel',
        PROCESS_IMPORT_TAXINCOME: APP_CONFIG.MCR_ETAX + 'services/taxincomeServices/processImportTaxincome?',
    };
}

