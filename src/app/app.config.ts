class NameConfig {
    public static get HOST_NAME(): string {
        return window['HOST_NAME'];
    }

    public static get HOST_NAME_LOGIN(): string {
        return window['HOST_NAME_LOGIN'];
    }

    public static get PATH_SERVICE(): string {
        return this.HOST_NAME + 'services/';
    }

    public static get PATH_SERVICE_LOGIN(): string {
        return this.HOST_NAME + 'api/';
    }
}

export const APP_CONFIG: any = {
    LIMIT_QUERY: 50,
    QUERY_TIME_OUT: 30000,
    COMMAND_TIME_OUT: 60000,
    MAX_ELEMENT_IN_LIST: 1000,
    VERSION: '1.0.0',
    VERSION_HELP: '1.0.',
    APP_CODE: 'ETAX',
    TENANT: 'LCSSOFT',
    COMPANY_CODE: 'ETAX',
    COMPANY_CODE_LCS: 'LCSSOFT',
    COMPANY_NAME: 'LCS SOFT',
    GROW_HEIGHT_40: 40,
    GROW_HEIGHT_44: 44,
    GROW_HEIGHT_50: 50,
    HOST_NAME: NameConfig.PATH_SERVICE,
    HOST_NAME_LOGIN: NameConfig.PATH_SERVICE_LOGIN,
    KEY_JWT: 'Bearer ',
    SERVICE_REST: 'services/',
    LOGIN_SERVICE: 'authenticate',
    // LOGIN_SERVICE: 'j_spring_security_check',
    LOGOUT_SERVICE: 'j_spring_security_logout',
    GET_MENU_TREE: 'menuByModule?module=home',
    // GET_MENU_TREE: 'services/restMenuService/getMenuTreeByMenuType?menuType=2',
    GET_USERINFO: 'profileInfo',
    // GET_USERINFO: 'services/identityServiceWrapper/getIdentityInfo',
    CHECK_LOGIN: 'identityServiceWrapper/checkLoggedIn',
    INPUT_TEXT_DEBOUNCE_TIME: 400,
    SCROLL_DEBOUNCE_TIME: 400,
    LANGUAGES: [{
        name: 'English', code: 'en', locale: 'en-US',
    }, {
        name: 'Vietnam', code: 'vi', locale: 'vi',
    }],
    LANGUAGE_LOCALE: {
        'en': 'en-US',
        'vi': 'vi',
    },
    DEFAULT_LANGUAGE: 'vi',
    ITEMS_PER_PAGE: [20, 50, 100, 200],
    ITEMS_FOR_SELECTION: 20,
    STATUS_NEW_L: 2048, // 2^11;
    STATUS_REPLACE_L: 4096, // 2^12;
    STATUS_DELETE_L: 8192, // 2^13;
    STATUS_MODIFY_L: 16384, // 2^14;
    STATUS_ADJUST_RECORD_L: 32768, // 2^15;
    STATUS_PRINT_TRANSFER_L: 1, // 2^0;
    STATUS_GENERATOR_XML_L: 2, // 2^1;
    I18N_SERVICE: NameConfig.HOST_NAME + 'i18n' + window['ENV'] + '/services/',
    MCRCUSTOMER_SERVICE: NameConfig.HOST_NAME + 'mcrcustomer/services/',
    EXCEL_API: NameConfig.HOST_NAME + 'mcrcustomer/api/excel/',
    MCRFORMIO_SERVICE: NameConfig.HOST_NAME + 'mcrformio/services/',
    DMS_SERVICE: NameConfig.HOST_NAME + 'dms/services/',
    DMS_RESOURCE: NameConfig.HOST_NAME + 'dms/',
    MCRNOTIFICATION: NameConfig.HOST_NAME + 'mcrnotification/services/notificationService/',
    MCRTICKET_SERVICE: NameConfig.HOST_NAME + 'mcrticket/services/',
    MCRTICKET_API: NameConfig.HOST_NAME + 'mcrticket/api/',
    MCRTICKET_EXCEL_API: NameConfig.HOST_NAME + 'mcrticket/api/excel/',
    SECMT_API_SERVICE: NameConfig.HOST_NAME + 'mcrsecmt/services/',
    MCR_EDOC: NameConfig.HOST_NAME + 'mcredoc/',
    MCR_EDOCWF: NameConfig.HOST_NAME + 'mcredocwf/',
    MCR_ETAX: NameConfig.HOST_NAME + 'mcretax/',
    MCR_ETAX_PORTAL: NameConfig.HOST_NAME + 'mcretaxportal/',
    MCR_REPORT: NameConfig.HOST_NAME + 'mcrreport' + window['ENV_REPORT'] + '/',
    EXPORT: NameConfig.HOST_NAME + 'export'
};

export const API_URL: any = {
    SECMT: {
        CHANGE_PASS: APP_CONFIG.SECMT_API_SERVICE + 'secmtRegisterApiService/changePass?',
        REGISTER: APP_CONFIG.SECMT_API_SERVICE + 'secmtRegisterApiService/register?',
        ASSIGN_NEW_PASS: APP_CONFIG.SECMT_API_SERVICE + 'secmtRegisterApiService/assignNewPass?',
        UPDATE_PROFILE: APP_CONFIG.SECMT_API_SERVICE + 'secmtRegisterApiService/updateProfile?',
    },
    LANGUAGE: {
        GET_LANGUAGE: APP_CONFIG.I18N_SERVICE + 'messages/get?',
        POST_LANGUAGE: APP_CONFIG.I18N_SERVICE + 'messages/post?',
    },
    ATTRIBUTE: {
        GET: APP_CONFIG.HOST_NAME_LOGIN + 'getAttributeValueOfUser',
        SET: APP_CONFIG.HOST_NAME_LOGIN + 'setAttributeValueForUser',
        GETLINK: APP_CONFIG.MCRFORMIO_SERVICE + 'documentationService/getDocUrl?',
    },
    NOTIFICATION: {
        COUNT_UNREAD: APP_CONFIG.MCRNOTIFICATION + 'countUnread',
        GET_PAGING_LIST_NOTIFICATION: APP_CONFIG.MCRNOTIFICATION + 'getPagingList?',
        UPDATE_READ: APP_CONFIG.MCRNOTIFICATION + 'updateRead?',
        READ_ALL: APP_CONFIG.MCRNOTIFICATION + 'readAll',
        DELETE_ALL: APP_CONFIG.MCRNOTIFICATION + 'deleteAll',
        DELETE: APP_CONFIG.MCRNOTIFICATION + 'delete',
    },
};
