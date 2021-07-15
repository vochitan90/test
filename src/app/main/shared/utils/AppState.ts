import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { action, computed, observable } from 'mobx';
import * as moment from 'moment';
import { API_URL, APP_CONFIG } from '../../../app.config';
import { Events } from './Events';
import { HttpHelper } from './HttpHelper';
import { UtilCommon } from './UtilCommon';

@Injectable({
    providedIn: 'root'
})
export class AppState {
    appState: any = undefined;
    pageSize = 0;
    @observable menuData: any[] = [];
    @observable openMenu: boolean;
    @observable scrollTopMenu: number;
    @observable userAttributeValues: any;
    @observable userInfo;
    unitInfo;
    public supporterTicketDefCode: string;
    public supporterServiceRootAggid: string;
    public supporterTicketClassId: string;
    public supporterTicketParentServiceCode: string;
    private dashboardEvent: string;
    private dashboardEventParams: any;

    private configNumberDirective = {
        decimal: true,
        decimalLength: 3,
        decimalSeparator: ',',
        groupSeparator: '.'
    };

    constructor(private httpHelper: HttpHelper, private translateService: TranslateService,
        private events: Events, private utils: UtilCommon) {
        this.menuData = [];
        this.pageSize = APP_CONFIG.LIMIT_QUERY;
        let appState: any = localStorage.getItem('appState');
        if (appState) {
            appState = JSON.parse(appState);
            this.setAppState(appState);
        }
        this.openMenu = true;
        this.scrollTopMenu = 0;
        this.userInfo = null;

    }

    setAppState(appState: any): void {
        this.appState = appState;
        if (appState) {
            this.setUserInfo(appState);
            this.events.publish('action:loadUserInfo', appState);
            const language: string = localStorage.getItem('language') || 'vi';
            this.translateService.use(language);
            localStorage.setItem('appState', JSON.stringify(appState));
            moment.locale(language);
        }
        (<any>window).APP_STATE = appState;
    }
    getUrlCurrent(): string {
        return localStorage.getItem('urlCurrent');
    }
    setUrlCurrent(value): void {
        // const _current = this.getUrlCurrent();
        // if (!_current) {
        localStorage.setItem('urlCurrent', value.toString().replace('#', ''));
        // }
    }
    getAppState(): any {
        return this.appState;
    }

    getAppStateUsername(): string {
        return localStorage.getItem('username');
    }

    setAppStateUsername(username: any): void {
        localStorage.setItem('username', username);
    }

    getLanguage(): string {
        // if (this.getAppState()) {
        //     return this.getAppState().langKey;
        // }
        return localStorage.getItem('language') || 'vi';
    }

    setLanguage(language: string): void {
        if (this.getAppState()) {
            this.getAppState().langKey = language;
        }
        localStorage.setItem('language', language);
    }

    changeLang(language: string): void {
        this.translateService.use(language);
        this.setLanguage(language);
        this.translateService.getTranslation(language);
        moment.locale(language);
    }

    isLoggedIn(): boolean {
        return this.getAppState() ? true : false;
    }

    clearLogout(): void {
        const version: string = localStorage.getItem('version');
        localStorage.clear();
        localStorage.setItem('version', version);
        this.menuData = [];
        this.openMenu = true;
        this.scrollTopMenu = 0;
        this.setAppState(null);
        // this.customerStore.clearStore();
        // this.itemStore.clearStore();

    }
    // Lưu user atribute ở đây
    getPageSizeOptions(): any[] {
        return [20, 50, 100, 200];
    }

    getPageSize(): number {
        return this.pageSize;
    }
    getPageDefault() {
        let pageFirst = '/welcome';
        if (!this.appState) {
            return pageFirst;
        }
        if (!this.getScreen) {
            return pageFirst;
        }
        const pages: any = this.getScreen;
        let checkpageFirst = false;

        let checkMytask = false;
        if (pages) {
            for (const page of pages) {
                for (const ch of page.children) {
                    for (const item of ch.children) {
                        if (!checkpageFirst) {
                            checkpageFirst = true;
                            pageFirst = item.url;
                        }
                        if (item.url === '/mytask') {
                            checkMytask = true;
                        }

                    }
                }
            }

        }
        if (checkMytask) {
            return '/mytask';
        }
        return pageFirst;
    }
    // Kiểm tra xem bạn được quyền truy cập vap page nao
    accessPage(accessLink: string): boolean {
        if (!this.appState) {
            return true;
        }
        if (!this.getScreen) {
            return true;
        }
        const pages: any = this.getScreen;
        if (pages) {
            for (const page of pages) {
                for (const ch of page.children) {
                    for (const item of ch.children) {
                        if (accessLink.indexOf(item.url) > -1) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        // Hien tai bo qua ham nay cho scren hien thi
        return true;
    }

    // Kiêm tra xem bạn được quyền sử dụng những function nào
    accessFunction(accessLink: string, functionName: string): boolean {
        if (!this.appState) {
            return true;
        }
        const pages: any = this.getScreen;
        let functions: any = null;

        for (const page of pages) {

            if (!page.route) {
                continue;
            }
            if (accessLink.indexOf(page.route) > -1) {
                functions = page.func;
                if (functions) {
                    return functions[functionName];
                } else {
                    return false;
                }
            }
        }
        return true;
    }

    // Kiêm tra xem bạn được quyền sử dụng những function nào
    hasPermission(functionName: string): boolean {
        if (!this.appState) {
            return false;
        }
        if (this.appState.permissions) {
            for (const per of this.appState.permissions) {
                if (per.target === functionName) {
                    return true;
                }
            }
        }
        return false;
    }

    @action setUserInfo(userInfo: any): void {
        this.userInfo = userInfo;
    }

    @action setMenuState(menuData: any): void {
        this.menuData = menuData;
    }

    @action setAttributeValues(atributeValues: any): void {
        this.userAttributeValues = atributeValues;
    }

    @action setScreen(menuData: any): void {
        this.appState.screen = menuData;
    }

    @computed get getMenuState(): any {
        return this.menuData;
    }

    @computed get getScreen(): any {
        return this.appState.screen;
    }

    @computed get getUserinfo(): any {
        return this.appState;
    }

    @computed get getCompanyCode(): any {
        let userInfo: any = this.getUserinfo;
        if (!userInfo) {
            return '';
        }
        userInfo = userInfo.moreInfo;
        if (!userInfo) {
            return '';
        }
        return userInfo.tenantCode;
    }

    @computed get getAppCode(): any {
        let userInfo: any = this.getUserinfo;
        if (!userInfo) {
            return '';
        }
        userInfo = userInfo.moreInfo;
        if (!userInfo) {
            return '';
        }
        return userInfo.appCode;
    }

    @computed get getUserId(): number {
        let userInfo: any = this.getUserinfo;
        if (!userInfo) {
            return -1;
        }
        userInfo = userInfo.moreInfo;
        if (!userInfo) {
            return -1;
        }
        return userInfo.userId;
    }

    @computed get getAttributeValues(): any {
        return this.userAttributeValues || {};
    }

    getMenuTree(): Promise<any> {
        const urlGetMenuTree: string = APP_CONFIG.HOST_NAME_LOGIN + APP_CONFIG.GET_MENU_TREE;
        return this.httpHelper.methodGetService(urlGetMenuTree);
    }

    logout(username: string): Promise<any> {

        const urlLogout: string = APP_CONFIG.HOST_NAME_LOGIN + APP_CONFIG.LOGOUT_SERVICE,
            params: string = 'username=' + username;
        return this.httpHelper.actionLogOut(urlLogout, APP_CONFIG.COMMAND_TIME_OUT);
    }

    mapScreen(appState: any): any {
        if (!appState) {
            return;
        }
        const screen: any = [];
        let route = '';
        const pages: any = appState.permissions;
        let func: any = null;
        const functions: any = {};
        screen.push({ route: 'home', historyToken: 'home', access: true, func: {} });

        for (const funcs of pages) {
            if (funcs.action === '32') {
                functions[funcs.target] = true;
            }
        }
        for (const page of pages) {
            if (page.action === '1') {
                route = '';
                switch (page.target) {
                    case 'tax_code:':
                        route = '/list-tax-id';
                        func = {
                            'CODE_TAX_CREATE': functions.CODE_TAX_CREATE,
                            'CODE_TAX_UPDATE': functions.CODE_TAX_UPDATE,
                            'CODE_TAX_UNIT_BUSINESS_DELETE': functions.CODE_TAX_UNIT_BUSINESS_DELETE,
                            'CODE_TAX_UNIT_BUSINESS_UPDATE': functions.CODE_TAX_UNIT_BUSINESS_UPDATE,
                            'SIGNATURE_CODE_TAX_UPDATE': functions.SIGNATURE_CODE_TAX_UPDATE,
                        };
                        break;
                    case 'tax_period:':
                        route = '/list-period-declare-tax';
                        func = {
                            'PERIOD_TAX_CONFIG_CREATE': functions.PERIOD_TAX_CONFIG_CREATE,
                            'STATUS_RECORD_PERIOD_TAX_CONFIG_UPDATE': functions.STATUS_RECORD_PERIOD_TAX_CONFIG_UPDATE,
                            'PERIOD_TAX_CONFIG_UPDATE': functions.PERIOD_TAX_CONFIG_UPDATE,
                            'STATUS_RECORD_CODE_TAX_UPDATE': functions.STATUS_RECORD_CODE_TAX_UPDATE,
                            'CODE_TAX_UNIT_BUSINESS_UPDATE': functions.CODE_TAX_UNIT_BUSINESS_UPDATE,
                            'TAX_DECLARE_PERIOD_LIST': functions.TAX_DECLARE_PERIOD_LIST,
                            'PERIOD_TAX_CONFIG_UNIT_BUSINESS_UPDATE': functions.PERIOD_TAX_CONFIG_UNIT_BUSINESS_UPDATE,
                        };
                        break;
                    case 'unit:':
                        route = '/list-unit';
                        func = {
                            'UNIT_BUSINESS_CREATE': functions.UNIT_BUSINESS_CREATE,
                            'UNIT_BUSINESS_UPDATE': functions.UNIT_BUSINESS_UPDATE,
                        };
                        break;
                    case 'logout:':
                        route = '/login';
                        func = {};
                        break;
                    case 'customer:':
                        route = '/customer-list';
                        func = {};
                        break;
                    case 'transaction:':
                        route = '/transaction-list';
                        func = {};
                        break;
                    case 'setting:':
                        route = '/settings';
                        func = {};
                        break;
                    case 'invoice_template:':
                        route = '/invoice-templates';
                        func = {
                            TEMPLATE_INVOICE_COPY: functions.TEMPLATE_INVOICE_COPY,
                            TEMPLATE_INVOICE_CREATE: functions.TEMPLATE_INVOICE_CREATE,
                            STATUS_RECORD_TEMPLATE_INVOICE_UPDATE: functions.STATUS_RECORD_TEMPLATE_INVOICE_UPDATE,
                            TEMPLATE_INVOICE_VERSION_CREATE: functions.TEMPLATE_INVOICE_VERSION_CREATE,
                            STATUS_TEMPLATE_INVOICE_UPDATE: functions.STATUS_TEMPLATE_INVOICE_UPDATE,
                        };
                        break;
                    case 'invoice:':
                        route = '/invoices';
                        func = {
                            RECORD_ADJUST: functions.RECORD_ADJUST,
                            INVOICE_CREATE: functions.INVOICE_CREATE,
                            INVOICE_MODIFY: functions.INVOICE_MODIFY,
                            INVOICE_CLOSE: functions.INVOICE_CLOSE,
                            INVOICE_TRANSFER_PRINT: functions.INVOICE_TRANSFER_PRINT,
                            INVOICE_REPLACE: functions.INVOICE_REPLACE,
                        };
                        break;
                    case 'create_invoice:':
                        route = '/invoices/create/0';
                        func = {};
                        break;
                    case 'pending_invoice:':
                        route = '/pending-invoices';
                        func = {
                            INVOICE_APPROVE: functions.INVOICE_APPROVE,
                            INVOICE_REJECT: functions.INVOICE_REJECT,
                        };
                        break;
                    case 'list_items:':
                        route = '/item-list';
                        func = {};
                        break;
                    case 'issue_invoice:':
                        route = '/publish-order';
                        func = {};
                        break;
                    default: break;
                }
                if (route.length > 0) {
                    screen.push({ route: route, historyToken: page.target, access: true, func: func });
                }
            }
        }
        return screen;
    }

    getUserInfoService(): Promise<any> {
        const urlUserInfo: string = APP_CONFIG.HOST_NAME_LOGIN + APP_CONFIG.GET_USERINFO;
        return this.httpHelper.methodGetService(urlUserInfo);
    }

    setAttributeValue(attributeName: string, atributeValue: string): Promise<any> {
        const url: string = API_URL.ATTRIBUTE.SET;
        const params = `attribute=${encodeURIComponent(attributeName)}&attrValue=${encodeURIComponent(atributeValue)}`;
        return this.httpHelper.methodPostService(url, params, APP_CONFIG.QUERY_TIME_OUT);
    }
    getlink(accessLink): Promise<any> {
        const url: string = API_URL.ATTRIBUTE.GETLINK + `version=${APP_CONFIG.VERSION_HELP}&accessLink=${accessLink}`;
        return this.httpHelper.methodGetService(url, APP_CONFIG.QUERY_TIME_OUT);
    }
    getAttributeValue(attributeName: string): Promise<any> {
        const url: string = API_URL.ATTRIBUTE.GET + `?attribute=${encodeURIComponent(attributeName)}`;
        return this.httpHelper.methodGetService(url, APP_CONFIG.QUERY_TIME_OUT);
    }

    getUserCode(): string {
        const userInfo: any = this.appState;
        if (!userInfo) {
            return '';
        }
        return userInfo.userCode;
    }

    changePass(password: string, new_password: string): Promise<any> {
        const url: string = API_URL.SECMT.CHANGE_PASS;
        const params = `clientId=${this.getAppStateUsername()}&oldPass=${password}&newPasss=${new_password}`;
        return this.httpHelper.formPost(url, params, APP_CONFIG.QUERY_TIME_OUT);
    }

    updateProfileInfo(fullName: string, phone: number, contactEmail: string, description: string = ''): Promise<any> {
        const url: string = API_URL.SECMT.UPDATE_PROFILE;
        const params: string = this.utils.encodeUriEachField({
            clientId: this.getAppStateUsername(),
            fullName: fullName,
            phone: phone,
            contactEmail: contactEmail,
            description: description
        });
        return this.httpHelper.formPost(url, params, APP_CONFIG.QUERY_TIME_OUT);
    }

    getCAUnitInfo(unitId: string): Promise<any> {
        const url: string = APP_CONFIG.GET_CA_UNIT_INFO;
        const params = `?id=${unitId}`;
        return this.httpHelper.methodGetService(url + params);
    }

    getUnitCode(): string {
        return _.get(this.appState, 'moreInfo.unitCode', '');
    }

    changeConfigNumberDirective(language: string) {
        this.configNumberDirective = {
            decimal: true,
            decimalLength: 3,
            decimalSeparator: ',',
            groupSeparator: '.'
        };
        if (language === 'en') {
            this.configNumberDirective = {
                decimal: true,
                decimalLength: 3,
                decimalSeparator: '.',
                groupSeparator: ','
            };
        }
    }

    getConfigNumberDirective() {
        return this.configNumberDirective;
    }

    setCAUnitInfo(unitInfo: any): void {
        if (unitInfo) {
            this.unitInfo = unitInfo;
            this.events.publish('action:loadCAUnitInfo', unitInfo);
        }
    }

    isLCSCA(): boolean {
        const tenantCode: string = this.getCompanyCode;
        if (tenantCode === 'LCSCA') {
            return true;
        }
        return false;
    }

    setDashboardEvent(dashboardEvent: any): void {
        this.dashboardEvent = dashboardEvent;
    }

    getDashboardEvent(): string {
        return this.dashboardEvent;
    }

    setDashboardEventParams(dashboardEventParams: any): void {
        this.dashboardEventParams = dashboardEventParams;
    }

    getDashboardEventParams(): any {
        return this.dashboardEventParams;
    }
}

export const TYPE_FUNCTION: any = {
    ADD: 'ADD',
    EDIT: 'EDIT',
    DELETE: 'DELETE',
};
