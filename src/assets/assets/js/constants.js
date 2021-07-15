GROW_HEIGHT_40_AGGRID = 44;
window['ENV'] = '';
window['ENV_REPORT'] = '';
function GET_HOST_NAME() {
    if (window.location.origin.indexOf('app-dev') > -1 || window.location.origin.indexOf('localhost') > -1) {
        return 'https://app-dev.lcssoft.com.vn/gwetax/'
    }
    if (window.location.origin.indexOf('app-qc.lcssoft.com.vn') > -1) {
        return 'https://app-qc.lcssoft.com.vn/gwetax/';
    }
    if (window.location.origin.indexOf('ctt56.4si.vn') > -1) {
        return 'https://ctt56.4si.vn/';
    }
    return window.location.origin + '/gateway/';
}

function GET_HOST_NAME_LOGIN() {
    if (window.location.origin.indexOf('app-dev') > -1 || window.location.origin.indexOf('localhost') > -1) {
        return 'https://app-dev.lcssoft.com.vn/gwetax/';
    }

    if (window.location.origin.indexOf('app-qc.lcssoft.com.vn') > -1) {
        return 'https://app-qc.lcssoft.com.vn/gwetax/';
    }
    if (window.location.origin.indexOf('ctt56.4si.vn') > -1) {
        return 'https://ctt56.4si.vn/';
    }
    return window.location.origin + '/';
}
HOST_NAME = GET_HOST_NAME();
HOST_NAME_LOGIN = GET_HOST_NAME_LOGIN();
if (window.location.origin.indexOf('app-dev') > -1) {
    PROCESS_UPLOAD_TEMPLATE = 'https://app-dev.lcssoft.com.vn/gwetax/etax/assets/file/ETAX_CTKT-THUE-TNCN.xlsx';
    PROCESS_UPLOAD_TAX_TEMPLATE = 'https://app-dev.lcssoft.com.vn/gwetax/etax/assets/file/ETAX_THU-XAC-NHAN-TNCN.xlsx';
    USB_TOKEN_URL = 'ws://localhost:41802';
} else if (window.location.origin.indexOf('localhost') > -1) {
    PROCESS_UPLOAD_TEMPLATE = 'http://localhost:8000/assets/file/ETAX_CTKT-THUE-TNCN.xlsx';
    PROCESS_UPLOAD_TAX_TEMPLATE = 'http://localhost:8000/assets/file/ETAX_THU-XAC-NHAN-TNCN.xlsx';
    //USB_TOKEN_URL = 'ws://25.40.131.23:41802';
    USB_TOKEN_URL = 'ws://localhost:41802';
} else if (window.location.origin.indexOf('app-qc.lcssoft.com.vn') > -1) {
    PROCESS_UPLOAD_TEMPLATE = 'https://app-qc.lcssoft.com.vn/gwetax/etax/assets/file/ETAX_CTKT-THUE-TNCN.xlsx';
} else if (window.location.origin.indexOf('ctt56.4si.vn') > -1) {
    PROCESS_UPLOAD_TEMPLATE = 'https://ctt56.4si.vn/assets/file/ETAX_CTKT-THUE-TNCN.xlsx';
    USB_TOKEN_URL = 'ws://localhost:41802';
    window['ENV'] = 'etax';
    window['ENV_REPORT'] = 'v2';
}