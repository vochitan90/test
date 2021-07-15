import { Injectable } from '@angular/core';
import { UtilCommon } from './UtilCommon';

@Injectable({
    providedIn: 'root'
})
export class BuildMenuTree {
    constructor(private utils: UtilCommon) {

    }
    async convertMenuTree(dataMenu: any): Promise<any> {
        if (!dataMenu || !Array.isArray(dataMenu)) {
            return;
        }
        const menuParent: any = [{
            'id': '1',
            'translate': 'NAV.APPLICATIONS',
            'type': 'group',
            'children': []
        }];
        // let lastIndex = 0;
        let language: any = localStorage.getItem('language') || 'vi';
        await this.utils.loadScriptAsync(window['language_' + language], 'assets/i18n/menu/' + this.buildUrlLoadMenu() + '/' + language + '.js?v=' + new Date().getTime());
        language = window['language_' + language];
        const languageNAV = language.data.NAV;
        const menuFinal = [];
        for (const menu of dataMenu) {
            if (menu.menuName) {
                menu.title = languageNAV[menu.menuCode];
            }
            menu.id = menu.id.toString();
            menu.icon = 'dashboard';
            const children: any[] = menu.children;
            if (this.utils.checkISArray(children)) {
                menu.type = 'collapsable';
                let child = null;
                for (let index = 0; index < children.length; index++) {
                    child = children[index];
                    let childrenLv2 = null;
                    for (let childT of children[index].children) {
                        childT = this.defineMenuChild(childT, languageNAV);
                        childrenLv2 = childT.children;
                        for (let childT2 of childrenLv2) {
                            childT2 = this.defineMenuChild(childT2, languageNAV);
                        }
                    }
                    children[index] = {
                        title: languageNAV[child.menuCode],
                        id: child.id.toString(),
                        type: 'collapsable',
                        icon: 'dashboard',
                        children: children[index].children,
                        menuCode: children[index].menuCode
                    };
                }
            } else {
                menu.type = 'item';
                menu.url = menu.historyToken;
                menu.menuCode = menu.menuCode;
                menu.title = languageNAV[menu.menuCode];
            }
            menuFinal.push({
                'id': menu.menuCode,
                'title': languageNAV[menu.menuCode],
                'type': 'group',
                'icon': 'apps', 'children': menu.children,
                'menuCode': menu.menuCode
            });
        }
        menuParent[0].children = dataMenu;
        sessionStorage.setItem('menuFinal', JSON.stringify(menuFinal));
        localStorage.setItem('menuFinal', JSON.stringify(language));
        return menuFinal;
    }

    async convertLanguageMenu(dataMenu: any): Promise<any> {
        let language: any = localStorage.getItem('language') || 'vi';
        await this.utils.loadScriptAsync(window['language_' + language], 'assets/i18n/menu/' + this.buildUrlLoadMenu() + '/' + language + '.js?v=' + new Date().getTime());
        language = window['language_' + language];
        const languageNAV = language.data.NAV;
        for (const menu of dataMenu) {
            menu.title = languageNAV[menu.menuCode];
            const children = menu.children;
            for (const child of children) {
                child.title = languageNAV[child.menuCode];
                for (const c of child.children) {
                    c.title = languageNAV[c.menuCode];
                }
            }
        }
        sessionStorage.setItem('menuFinal', JSON.stringify(dataMenu));
        localStorage.setItem('menuFinal', JSON.stringify(language));
        return dataMenu;
    }

    buildUrlLoadMenu(): string {
        const appState = (<any>window).APP_STATE;
        if (appState) {
            if (appState.moreInfo) {
                const tenantCode: string = appState.moreInfo.tenantCode;
                if (tenantCode === 'LCSCA') {
                    return 'ca';
                }
                return 'default';
            }
        }
        return 'default';
    }

    private defineMenuChild(childT: any, languageNAV: any): any {
        let url = '';
        switch (childT.historyToken) {
            // QUẢN LÝ ĐƠN VỊ PHÁT HÀNH CHỨNG TỪ
            case 'business_unit':
                url = '/org-info/list';
                break;
            // QUẢN LÝ ĐĂNG KÝ PHÁT HÀNH
            case 'issue_registry':
                // url = '/issue-registry';
                url = '/issue-registry';
                break;
            // QUẢN LÝ CHỨNG TỪ KHẤU TRỪ
            case 'taxincome_create':
                url = '/tax-income/create';
                break;
            case 'taxincome_new':
                url = '/tax-income/new';
                break;
            case 'taxincome_issue':
                url = '/tax-income/issue';
                break;
            case 'taxincome_cancel':
                url = '/tax-income/cancel';
                break;
            case 'taxincome_upload':
                url = '/tax-income/upload';
                break;
            // QUẢN LÝ THƯ XÁC NHẬN THU NHẬP
            case 'taxincome_letter_create':
                url = '/confirm-income-tax/create';
                break;
            case 'taxincome_letter':
                url = '/confirm-income-tax/list';
                break;
            case 'taxincome_letter_upload':
                url = '/tax-letter-upload/list';
                break;
            // BÁO CÁO
            case 'report_list':
                url = '/report-list-of-usage';
                break;
            case 'list_of_usage':
                url = '/report-list-of-usage/revenue';
                break;
            // NỘP ĐĂNG KÝ PHÁT HÀNH
            case 'submit_issue_registry':
                url = '/issue-registry-upload/list';
                break;
            default:
        }
        if (this.utils.checkISArray(childT.children)) {
            childT.type = 'collapsable';
        } else {
            childT.type = 'item';
            childT.url = url;
            childT.exactMatch = true;
        }
        childT.title = languageNAV[childT.menuCode];
        childT.menuCode = childT.menuCode;
        return childT;
    }
}
