import { API_URL, APP_CONFIG } from 'app/app.config';
import { AppState, HttpHelper } from '../../shared';

export class BaseRequestService {
    permissions: any;
    BASE_REQUEST_CONSTANT: any;
    constructor(public httpHelper: HttpHelper, public _appState: AppState) {
    }

    getSchemaPivot(): Promise<any> {
        return this.httpHelper.methodGetService(this.BASE_REQUEST_CONSTANT.API.GET_SCHEMA_PIVOT);
    }

    pivotPaging(request: any): Promise<any> {
        const params = `request=${encodeURIComponent(JSON.stringify(request))}`;
        return this.httpHelper.methodPostService(this.BASE_REQUEST_CONSTANT.API.PIVOT_PAGING, params);
    }

    pivotCount(request: any): Promise<any> {
        const params = `request=${encodeURIComponent(JSON.stringify(request))}`;
        return this.httpHelper.methodPostService(this.BASE_REQUEST_CONSTANT.API.PIVOT_COUNT, params);
    }

    getLanguageForm(screen: string): Promise<any> {
        const language = this._appState.appState.langKey,
            tenant = APP_CONFIG.TENANT,
            app = APP_CONFIG.APP_CODE;
        const params = encodeURI(`group=${screen}&language=${language}&tenant=${tenant}&app=${app}`);
        return this.httpHelper.methodGetService(API_URL.LANGUAGE.GET_LANGUAGE + params);
    }

}
