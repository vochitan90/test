import { Injectable, } from '@angular/core';
import { HttpHelper } from '../../shared/utils/HttpHelper';
import { APP_CONFIG } from '../../../app.config';
import { Observable, Subscriber } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    constructor(private httpHelper: HttpHelper) {

    }

    login(username: string, password: string, remember: boolean = false, recaptcha: string = '12345678'): Promise<any> {
        const urlLogin: string = APP_CONFIG.HOST_NAME_LOGIN + APP_CONFIG.LOGIN_SERVICE;
        const loginObject: any = {
            'password': password,
            'rememberMe': remember,
            'username': username
        };
        if (recaptcha === '12345678') {
            recaptcha = '';
        }
        // let loginParams: string = 'j_username=' + username + '&j_password=' + encodeURIComponent(password) + '&j_captcha=' + recaptcha;
        // return this.httpHelper.methodPostLoginServiceNew(urlLogin, loginParams, APP_CONFIG.COMMAND_TIME_OUT);
        return this.httpHelper.methodPostLoginService(urlLogin, loginObject, APP_CONFIG.COMMAND_TIME_OUT);
    }

    
    loginCapcha(username: string, password: string, recaptcha: string): Promise<any> {
        if (recaptcha === '12345678') {
            recaptcha = '';
        }
        let urlLogin: string = APP_CONFIG.HOST_NAME_LOGIN + APP_CONFIG.LOGIN_SERVICE;
        const loginParams: string = 'j_username=' + username + '&j_password=' + encodeURIComponent(password) + '&j_captcha=' + recaptcha;
        return this.httpHelper.methodPostLoginService(urlLogin, loginParams, APP_CONFIG.COMMAND_TIME_OUT);
    }

    getUserInfo(): Promise<any> {
        const urlUserInfo: string = APP_CONFIG.HOST_NAME_LOGIN + APP_CONFIG.GET_USERINFO;
        return this.httpHelper.methodGetService(urlUserInfo);
    }

    getUserInfoObs(): Observable<any> {
        const urlUserInfo: string = APP_CONFIG.HOST_NAME_LOGIN + APP_CONFIG.GET_USERINFO;
        return this.httpHelper.methodGetServiceObservable(urlUserInfo)
            .pipe(
                catchError((err: any) => {
                    return new Observable((subscriber: Subscriber<any>) => {
                        subscriber.next(err);
                    });
                }),
            );
    }
    logout(username: string): Promise<any> {
        const urlLogout: string = APP_CONFIG.HOST_NAME_LOGIN + APP_CONFIG.LOGOUT_SERVICE,
            params: string = 'username=' + username;
        return this.httpHelper.actionLogOut(urlLogout, APP_CONFIG.COMMAND_TIME_OUT);
    }

    // getCAUnitInfo(unitId: string): Promise<any> {
    //     const url: string = APP_CONFIG.GET_CA_UNIT_INFO;
    //     const params = `?id=${unitId}`;
    //     return this.httpHelper.methodGetService(url + params);
    // }

}
