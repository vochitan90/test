export const APP_CONSTANT = {
    SUCCESS: 'SUCCESS',
    RECORD_STATUS_O: 'O',
    RECORD_STATUS_C: 'C',
};

export const COMPONENT_CONSTANT = {
    SNACK_BAR_ERROR: 'error',
    SNACK_BAR_SUCCESS: 'success'
};

export const HTTP_CONSTANT = {
    CMD: 'cmd',
    CMD_EQUAL: 'cmd=',
    REQUEST: 'request',
    REQUEST_EQUAL: 'request='
};

export const AUTH_STATUS_CONSTANT = {
    M: 'M',
    A: 'A',
    R: 'R',
    P: 'P',

    // M - > tạo mới, P - > chờ duyệt, A -> approveR -> reject
    // A P không được update
};

export const AG_GRID_CONSTANT = {
    ACTIONS: {
        DOWNLOAD: 'DOWNLOAD',
        UPDATE: 'UPDATE', ACTIVE: 'ACTIVE', DE_ACTIVE: 'DE_ACTIVE',
        SEE_ALL_OLD_VERSION: 'seeAllOldVersion',
        APPROVE: 'APPROVE',
        REJECT: 'REJECT',
        ACTION: 'action',
        ENABLE: 'enable',
        DISABLE: 'disable',

    },
    COLD_ID: 'colId',
    ROW_SELECTION_SINGLE: 'single',
    ROW_SELECTION_MULTIPLE: 'multiple',
    PARAMS_PAGING: { 'startRow': 0, 'endRow': 50, 'rowGroupCols': [], 'valueCols': [], 'pivotCols': [], 'pivotMode': false, 'groupKeys': [], 'filterModel': {}, 'sortModel': [] },
    PARAMS_COUNT: { 'rowGroupCols': [], 'valueCols': [], 'pivotCols': [], 'pivotMode': false, 'groupKeys': [], 'filterModel': {}, 'sortModel': [] },
};

export const FILE_CONSTANT = {
    XLSX: 'xlsx',
    MAX_SIZE_XLSX: 10000,
    MAX_SIZE_OTHER: 1000000
};

export const VALIDATION_CONSTANT = {
    EXIST: 'VALIDATION.EXISTS',
    JOBTITLE_CONFIG_ANOTHOR_WF: 'VALIDATION.JOBTITLE_CONFIG_ANOTHOR_WF',
    VALID_EFFECTIVEDATE: 'VALIDATION.VALID_EFFECTIVEDATE',
    DUPLICATE: 'VALIDATION.DUPLICATE',
    NOT_FOUND: 'VALIDATION.NOT_FOUND',
    REQUIRE: 'VALIDATION.REQUIRE'
};


export const VALIDATION_CONSTANT_MESSAGE = {
    // 'VALIDATION.EXISTS': 'Đã tồn tại',
    // 'VALIDATION.JOBTITLE_CONFIG_ANOTHOR_WF': 'Lỗi',
    // 'VALIDATION.VALID_EFFECTIVEDATE': 'Ngày hiệu lực không hợp lệ',
    // 'VALIDATION.DUPLICATE': 'Trùng',
    // 'VALIDATION.NOT_FOUND': 'Không tìm thấy',
    // 'VALIDATION.REQUIRE': 'chưa có'

    'VALIDATION.EXISTS': 'Đã tồn tại',
    'VALIDATION.JOBTITLE_CONFIG_ANOTHOR_WF': 'Lỗi',
    'VALIDATION.VALID_EFFECTIVEDATE': 'Ngày hiệu lực không hợp lệ',
    'VALIDATION.DUPLICATE': 'Trùng',
    'VALIDATION.NOT_FOUND': 'Không tìm thấy',
    'VALIDATION.VALID_REQUIRE': 'chưa có'
};

export const SCREEN_CONSTANT = {
    CASE: 'CASE',
    WORK_FLOW: 'WORK_FLOW',
    WORK_FLOW_CONFIG: 'WORK_FLOW_CONFIG',
    TEMPLATE: 'TEMPLATE'
};

export const CONSTANT: any = {
    REQUEST: 'REQUEST',
    REFRESH: 'REFRESH',
    DISABLED: 'DISABLED'
};

export const ACTION = {
    CREATE: 'CREATE',
    READ: 'READ',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    REFRESH: 'REFRESH',
    VIEW: 'VIEW',
    ISSUE: 'ISSUE',
    REPLACE: 'REPLACE'
};

export const DATE_FORMAT_IN_JSON = 'YYYY-MM-DD';
export const DATE_TIME_FORMAT_IN_JSON = 'YYYY-MM-DD HH:mm:ss';
export const TIME_FORMAT_IN_JSON = 'HH:mm:ss';

export const MAT_MOMENT_DATE_FORMATS: any = {
    parse: {
        dateInput: 'L',
    },
    display: {
        dateInput: 'L',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

export const MAT_MOMENT_DATE_FORMATS_IN_JSON: any = {
    parse: {
        dateInput: DATE_FORMAT_IN_JSON,
    },
    display: {
        dateInput: DATE_FORMAT_IN_JSON,
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: DATE_FORMAT_IN_JSON,
        monthYearA11yLabel: 'MMMM YYYY',
    },
};


export const MOMENT_DATE_FORMAT: any = {
    // day of month (2 digits), month (2 digits) and year (4 digits).
    DATE: 'L',
    // short day of month, short month and year (4 digits).
    SHORT_DATE: 'l',

    // hour and minute.
    TIME: 'LT',
    // hour, minute and second.
    TIME_WITH_SECOND: 'LTS',

    // day of month (2 digits), month (2 digits) and year (4 digits).
    DATE_TIME: 'L LTS',
    // short day of month, short month and year (4 digits).
    SHORT_DATE_TIME: 'l LTS',

    // day of month (2 digits), month name and year (4 digits).
    DATE_WITH_MONTH_NAME: 'LL',
    // short day of month, short month name and year (4 digits).
    SHORT_DATE_WITH_MONTH_NAME: 'll',

    // day of month, month name, year (4 digits) and time. September 4, 1986
    DATE_TIME_WITH_MONTH_NAME: 'LLL',
    // short day of month, short month name, year (4 digits) and time. Sep 4, 1986
    SHORT_DATE_TIME_WITH_MONTH_NAME: 'lll',

    // day of week, day of month, month name, year (4 digits) and time. Thursday, September 4, 1986 8:30 PM
    DATE_TIME_WITH_MONTH_NAME_AND_DAY_OF_WEEK: 'LLLL',
    // short day of week, short day of month, short month name, year (4 digits) and time. Thu, Sep 4, 1986 8:30 PM
    SHORT_DATE_TIME_WITH_MONTH_NAME_AND_DAY_OF_WEEK: 'llll',
};
