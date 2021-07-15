import { APP_CONFIG } from 'app/app.config';

export class LIST_OF_USAGE_CONSTANT {
    static readonly REPORT_LIST_OF_USAGE_ATTRIBUTE = 'REPORT_LIST_OF_USAGE_ATTRIBUTE';

    static readonly SCREEN = {
        REPORT_LIST: 'REPORT_LIST',
    };
    static readonly STATUS = {
        NEW: 0,
        ISSUE: 1,
        CANCEL: 2,
        REPLACE: 3,
        REPLACED: 4
    };
    static readonly LINK = {
        REVENUE: '/report-list-of-usage/revenue',
        LIST_NEW: '/report-list-of-usage',
    };

    static readonly COLUMN = {
        MAKER_DATE: 'makerDate',
        MOD: 'mod',
        REPORT_NAME: 'reportName',
        FILE_PATH: 'filePath',
        AUTH_STATUS: 'authStatus',
        DESCRIPTION: 'description',
        TENANT_CODE: 'tenantCode',
        APP_CODE: 'appCode',
        RECORD_STATUS: 'recordStatus',
        CHECKER_DATE: 'checkerDate',
        BUSINESS_UNITCODE: 'businessUnitCode',
        EXCEPTION_CONTENT: 'exceptionContent',
        CHECKER_ID: 'checkerId',
        ID: 'id',
        STATUS: 'status',
        MAKER_ID: 'makerId'
    };
    static readonly API = {
        GET_SCHEMA_PIVOT: APP_CONFIG.MCR_ETAX + 'services/reportRuntimeServices/getSchemaPivot',
        PIVOT_PAGING: APP_CONFIG.MCR_REPORT + 'services/ReportRuntimeService/pivotPaging',

        GET_LIST_BUSINESS_UNIT_ACTIVE_FOR_USER: APP_CONFIG.MCR_ETAX + 'services/taxincomeServices/getListBusinessUnitActiveForUser',
        GET_LIST_PATTERN: APP_CONFIG.MCR_ETAX + 'services/taxincomeServices/getListPattern',
        GET_LIST_SERIAL: APP_CONFIG.MCR_ETAX + 'services/taxincomeServices/getListSerial',

        CREATE_RUNTIME_WITH_EXPORT: APP_CONFIG.MCR_REPORT + 'report/createRuntimeWithExport',
        GET_REPORT_RUNTIME_BYID: APP_CONFIG.MCR_REPORT + 'services/ReportRuntimeService/getReportRuntimeById?',

        EXPORT: APP_CONFIG.EXPORT
    };
}

