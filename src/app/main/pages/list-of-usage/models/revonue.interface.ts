export interface IRevonue {
    companyCode?: any;
    appCode?: any;
    reportName?: any;
    description?: any;
    status?: any;
    makerId?: any;
    runtimeValue?: IRevonueRuntimeValue;
}

export interface IRevonueRuntimeValue {
    companyCode?: any;
    appCode?: any;
    reportName?: any;
    exportFormat?: any;
    params?: IRuntimeValueParam;
}

export interface IRuntimeValueParam {
    PM_TENANT_CODE?: {
        type?: any;
        format?: any;
        value?: any;
    };
    PM_BU_CODE?: {
        type?: any;
        format?: any;
        value?: any;
    };
    PM_FROM_DATE?: {
        type?: any;
        format?: any;
        value?: any;
    };
    PM_TO_DATE?: {
        type?: any;
        format?: any;
        value?: any;
    };
    PM_PATTERN?: {
        type?: any;
        format?: any;
        value?: any;
    };
    PM_SERIAL?: {
        type?: any;
        format?: any;
        value?: any;
    };
    PM_TAX_PERIOD?: {
        type?: any;
        format?: any;
        value?: any;
    };
}

