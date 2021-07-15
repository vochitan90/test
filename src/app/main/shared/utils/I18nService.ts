import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { API_URL, APP_CONFIG } from '../../../app.config';
import { AppState } from './AppState';
import { HttpHelper } from './HttpHelper';

const separator = '.';

@Injectable({
    providedIn: 'root'
})
export class I18nService {
    constructor(private _httpHelper: HttpHelper, private _appState: AppState,
        private _translateService: TranslateService) {
    }

    getMessages(group: string, language: string = this._appState.getLanguage()): Promise<any> {
        const tenant = APP_CONFIG.TENANT;
        const app = APP_CONFIG.APP_CODE;
        group = group.toUpperCase();

        const url = encodeURI(`group=${app + separator + group}&language=${language}&tenant=${tenant}&app=${app}`);
        // const url = encodeURI(`group=${app + this._separator + group}&language=${language}&tenant=${tenant}&app=${app}`);
        return this._httpHelper.methodGetService(API_URL.LANGUAGE.GET_LANGUAGE + url).then(data => {
            this._translateService.setTranslation(language, { [group]: data }, true);
        });
    }

    postMessages(group: string, language: string, translations: any = {}): Promise<any> {
        const cmd: any = {
            group: APP_CONFIG.APP_CODE + separator + group.toUpperCase(),
            language,
            tenant: APP_CONFIG.TENANT,
            app: APP_CONFIG.APP_CODE,
            translations,
        };
        return this._httpHelper.methodPostService(API_URL.LANGUAGE.POST_LANGUAGE,
            'cmd=' + encodeURIComponent(JSON.stringify(cmd)));
    }

    getMessagesWithOutTranslate(group: string, language: string = this._appState.getLanguage()): Promise<any> {
        const tenant = APP_CONFIG.TENANT;
        const app = APP_CONFIG.APP_CODE;
        group = group.toUpperCase();

        const url = encodeURI(`group=${app + separator + group}&language=${language}&tenant=${tenant}&app=${app}`);
        // const url = encodeURI(`group=${app + this._separator + group}&language=${language}&tenant=${tenant}&app=${app}`);
        return this._httpHelper.methodGetService(API_URL.LANGUAGE.GET_LANGUAGE + url);
    }

    getMessagesTenant(group: string, language: string = this._appState.getLanguage()): Promise<any> {

        const tenantCode: string = this._appState.getCompanyCode;

        // let tenant = tenantCode;
        const tenant = APP_CONFIG.TENANT;
        // if (this._appState.isLCSCA()) {
        //     tenant = tenantCode;
        // }
        const app = APP_CONFIG.APP_CODE;
        group = group.toUpperCase();

        const url = encodeURI(`group=${app + separator + group}&language=${language}&tenant=${tenant}&app=${app}`);
        // const url = encodeURI(`group=${app + this._separator + group}&language=${language}&tenant=${tenant}&app=${app}`);
        return this._httpHelper.methodGetService(API_URL.LANGUAGE.GET_LANGUAGE + url).then(data => {
            this._translateService.setTranslation(language, { [group]: data }, true);
        });
    }

    getMessagesWithOutTranslateTenant(group: string, language: string = this._appState.getLanguage()): Promise<any> {
        const tenant: string = this._appState.getCompanyCode;
        const app = APP_CONFIG.APP_CODE;
        group = group.toUpperCase();

        const url = encodeURI(`group=${app + separator + group}&language=${language}&tenant=${tenant}&app=${app}`);
        // const url = encodeURI(`group=${app + this._separator + group}&language=${language}&tenant=${tenant}&app=${app}`);
        return this._httpHelper.methodGetService(API_URL.LANGUAGE.GET_LANGUAGE + url);
    }

    getMessagesTranslateTenant(group: string, language: string = this._appState.getLanguage()): Promise<any> {
        const tenant: string = this._appState.getCompanyCode;
        const app = APP_CONFIG.APP_CODE;
        group = group.toUpperCase();

        const url = encodeURI(`group=${app + separator + group}&language=${language}&tenant=${tenant}&app=${app}`);
        // const url = encodeURI(`group=${app + this._separator + group}&language=${language}&tenant=${tenant}&app=${app}`);
        return this._httpHelper.methodGetService(API_URL.LANGUAGE.GET_LANGUAGE + url).then(data => {
            this._translateService.setTranslation(language, { [group]: data }, true);
        });
    }
}
