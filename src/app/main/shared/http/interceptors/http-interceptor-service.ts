import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/operator/do';
import { Events } from '../..';
import { APP_CONFIG } from '../../../../app.config';
import { UtilCommon } from '../../utils/UtilCommon';
import { UtilComponent } from '../../utils/UtilComponent';
const getJwtToken = (req: HttpRequest<any>): string => {
  let jwt_token: string = localStorage.getItem('tokenJWT');
  return jwt_token;
};

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  isRefreshingToken = false;

  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  APPLICATION_TYPE = 'application/x-www-form-urlencoded;charset:UTF-8';

  constructor(private injector: Injector, private events: Events,
    private utils: UtilCommon, private utilsCmp: UtilComponent) { }

  addToken(req: HttpRequest<any>): HttpRequest<any> {
    let jwt_token: string = getJwtToken(req);
    if (!this.validUserNameSession()) {
      return null;
    }
    if (!req.headers.has('Authorization') && jwt_token) {
      req = req.clone({ setHeaders: { 'Authorization': APP_CONFIG.KEY_JWT + jwt_token, 'Accept': '*/*', 'isClient': 'true', } });
    }

    // use FormData (Content-Type: 'multipart/form-data'), don't set Content-Type in headers
    if (req.body instanceof FormData) {
      return req;
    }

    // Login sử dụng application/json ta phải truyền thêm vào 'Content-Type'
    // trường hợp khác sử dụng form submit
    // Chi bat post
    if (!req.headers.has('Content-Type') && req.method !== 'get') {
    //   req.headers.set('Content-Type', this.APPLICATION_TYPE);
    //   req.headers.set('isClient', 'true');
      // req = req.clone({ headers: req.headers.set('Content-Type', this.APPLICATION_TYPE) });
      req = req.clone({ setHeaders: { 'Content-Type': this.APPLICATION_TYPE, 'Accept': '*/*', 'isClient': 'true' } });
    }

    return req.clone();
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(this.addToken(request))
      .pipe(
        catchError((error, ca) => {
          if (error instanceof HttpErrorResponse) {
            switch ((<HttpErrorResponse>error).status) {
              case 400:
                return this.handle400Error(request, next);
              case 401:
                return this.handle401Error(request, next);
              case 500:
                return this.handle500Error(request, next);
              default:
                return throwError(error);
            }
          } else {
            return throwError(error);
          }
        })
      );
  }

  handle500Error(req: HttpRequest<any>, next: HttpHandler): any {
    return next.handle(req);
  }
  handle400Error(req: HttpRequest<any>, next: HttpHandler): any {
    return next.handle(req);
  }
  handle401Error(req: HttpRequest<any>, next: HttpHandler): any {
    this.events.publish('main:logout');
    return next.handle(req);

  }

  private validUserNameSession(): boolean {
    if (!this.utils.checkUsernameValid()) {
      const username: string = window['APP_STATE'].username;
      this.utilsCmp.generateDialogAlertWithCallBack(() => {
        this.events.publish('main:logout');
        window['APP_STATE'] = null;
      }, `Tài khoản ${username} đã bị đăng xuất khỏi hệ thống.	Vui lòng đăng nhập lại.`, 'Thông báo');
      return false;
    }
    return true;
  }

}
