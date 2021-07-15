import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/timeout';
import { APP_CONFIG } from '../../../app.config';
import { Events } from './Events';
import { UtilCommon } from './UtilCommon';
import { UtilComponent } from './UtilComponent';

function getAttachFileName(response: HttpResponse<any>): string {
    const contentDisposition = response.headers.get('content-disposition') || '';
    const match = contentDisposition.match(/filename[^;=\n]*=(?:(\\?['"])(.*?)\1|(?:[^\s]+'.*?')?([^;\n]*))/i);
    if (match && match.length > 0) {
        return match[match.length - 1];
    }
    return undefined;
}

@Injectable({
    providedIn: 'root'
})
export class HttpHelper {
    searchSubscription: Subscription;

    private transform: any;

    constructor(public http: HttpClient, private utils: UtilCommon, private router: Router,
        private utilComponent: UtilComponent, private events: Events) {
        this.searchSubscription = new Subscription();
        this.transform = ((response: any) => response.json());

    }

    methodGetService(urlService: string, query_timeout: number = APP_CONFIG.QUERY_TIME_OUT): Promise<any> {
        const me: any = this;
        // const headers: HttpHeaders = new HttpHeaders({
        //   'Content-Type': this.APPLICATION_TYPE
        // });
        return new Promise((resolve: any, reject: any) => {
            me.http
                // .get(urlService, { headers: headers, responseType: 'json' })
                .get(urlService, { responseType: 'json' })
                .timeout(query_timeout)
                .subscribe(
                    (data: any) => {
                        me.resolveDataFromRequest(resolve, data);
                    },
                    (error: any) => {
                        reject(error);
                    },
                    () => {
                        return;
                    }
                );
        });
    }

    methodGetServiceObservable(urlService: string, query_timeout: number = APP_CONFIG.QUERY_TIME_OUT): Observable<any> {
        // const request: Observable<Response> = this.http.get<any>(urlService, { responseType: 'json' }).timeout(query_timeout);
        return this.http.get<any>(urlService, { responseType: 'json' }).timeout(query_timeout);
        // return request.pipe(
        //   catchError((error: any) => {
        //     return new Observable<any>((subscriber: Subscriber<any>) => {
        //       try {
        //         subscriber.error(error.error);
        //       } catch (err) {
        //         subscriber.error(err);
        //       }
        //     });
        //   }),
        //   map((res: any) => {
        //     if (res) {
        //       return res;
        //     }
        //     return null;
        //   }),
        // );
    }

    methodGetServiceObs(urlService: string, query_timeout: number = APP_CONFIG.QUERY_TIME_OUT): Observable<any> {
        const me: any = this;
        // const headers: HttpHeaders = new HttpHeaders({
        //   'Content-Type': this.APPLICATION_TYPE
        // });
        return this.http.get<any>(urlService, { responseType: 'json' })
            .timeout(query_timeout)
            // .map((res: any) => {
            //   return res;
            // })
            .catch(this.handleError.bind(this));
        // .pipe()
        // return new Promise((resolve: any, reject: any) => {
        //   me.http
        //     // .get(urlService, { headers: headers, responseType: 'json' })
        //     .get(urlService, { responseType: 'json' })
        //     .timeout(timeout)
        //     .subscribe(
        //       (data: any) => {
        //         me.resolveDataFromRequest(resolve, data);
        //       },
        //       (error: any) => {
        //         reject(error);
        //       },
        //       () => {
        //         return;
        //       }
        //     );
        // });
    }

    // Report, image
    methodGetBlobService(urlService: string, timeout: number = APP_CONFIG.COMMAND_TIME_OUT): Promise<any> {
        const me: any = this;
        return new Promise((resolve: any, reject: any) => {
            me.http
                .get(urlService, { responseType: 'blob' })
                .timeout(timeout)
                .subscribe(
                    (data: any) => {
                        resolve(data);
                    },
                    (error: any) => {
                        reject(error);
                    },
                    () => {
                        return;
                    }
                );
        });
    }

    //
    methodGetPdfService(urlService: string, _timeout: number = 30000, _responseType: string = 'blob'): Promise<any> {
        const me: any = this;
        return new Promise((resolve: any, reject: any) => {
            me.http
                .get(urlService, { responseType: _responseType })
                .timeout(_timeout)
                .subscribe(
                    (data: any) => {
                        data = new Blob([data], { type: 'application/pdf' });
                        resolve(data);
                    },
                    (error: any) => {
                        reject(error);
                    },
                    () => {
                        return;
                    }
                );
        });
    }

    // Report, image
    methodGetFileService(url: string, timeout: number = APP_CONFIG.COMMAND_TIME_OUT): Promise<any> {
        const me: any = this;
        return new Promise((resolve: any, reject: any) => {
            me.http
                .get(url, { responseType: 'blob', observe: 'response' })
                .timeout(timeout)
                .subscribe(
                    (response: HttpResponse<any>) => {
                        const result: any = {
                            blob: response.body,
                        };
                        const fileName = getAttachFileName(response);
                        if (fileName) {
                            result.fileName = fileName;
                        }
                        resolve(result);
                    },
                    (error: any) => {
                        reject(error);
                    }
                );
        });
    }

    methodPostFileService(url: string, params: any, param_timeout: number = APP_CONFIG.COMMAND_TIME_OUT): Promise<any> {
        const me: any = this;
        return new Promise((resolve: any, reject: any) => {
            me.http
                .post(url, params, { responseType: 'blob', observe: 'response' })
                .timeout(param_timeout)
                .subscribe(
                    (response: HttpResponse<any>) => {
                        const result: any = {
                            blob: response.body,
                        };
                        const fileName = getAttachFileName(response);
                        if (fileName) {
                            result.fileName = fileName;
                            result.url = response.url;
                        }
                        resolve(result);
                    },
                    (error: any) => {
                        reject(error);
                    }
                );
        });
    }

    methodDownLoadFileDocx(urlService: string, params: any,
        _timeout: number = APP_CONFIG.COMMAND_TIME_OUT): Promise<any> {
        const me: any = this;
        return new Promise((resolve: any, reject: any) => {
            me.http
                .post(urlService, params, { responseType: 'blob', observe: 'response' })
                .timeout(_timeout)
                .subscribe(
                    (data: any) => {
                        const file = new Blob([data.body], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                        resolve({ response: file, ext: data.headers.get('Content-Disposition') });
                    },
                    (error: any) => {
                        reject(error);
                    },
                    () => {
                        return;
                    }
                );
        });
    }

    methodDownloadService(urlService: string, params: any, timeout: number = APP_CONFIG.COMMAND_TIME_OUT): Promise<any> {
        const me: any = this;
        return new Promise((resolve: any, reject: any) => {
            me.http
                .post(urlService, params, { responseType: 'blob' })
                .timeout(timeout)
                .subscribe(
                    (data: any) => {
                        data = new Blob([data], { type: 'application/octet-stream' });
                        resolve(data);
                    },
                    (error: any) => {
                        reject(error);
                    },
                    () => {
                        return;
                    }
                );
        });
    }

    // Report, image
    methodPostBlob(url: string, params: any, timeout: number = APP_CONFIG.COMMAND_TIME_OUT): Promise<any> {
        const me: any = this;
        return new Promise((resolve: any, reject: any) => {
            me.http
                .post(url, params, { responseType: 'blob' })
                .timeout(timeout)
                .subscribe(
                    (response: HttpResponse<any>) => {
                        const result: any = {
                            blob: response.body,
                        };
                        const fileName = getAttachFileName(response);
                        if (fileName) {
                            result.fileName = fileName;
                        }
                        resolve(result);
                    },
                    (error: any) => {
                        reject(error);
                    }
                );
        });
    }

    formPost(urlService: string, params: any, timeout: number = APP_CONFIG.COMMAND_TIME_OUT): Promise<any> {
        const me: any = this;
        let headers: any = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded;charset:UTF-8',
        });
        const token: string = localStorage.getItem('tokenJWT');
        if (token) {
            headers = headers.append('authorization', APP_CONFIG.KEY_JWT + token);
        }

        return new Promise((resolve: any, reject: any) => {
            me.http
                .post(urlService, params, { headers: headers, responseType: 'json' })
                .timeout(timeout)
                .subscribe(
                    (data: any) => {
                        me.resolveDataFromRequest(resolve, data);
                    },
                    (error: any) => {
                        reject(error);
                    },
                    () => {
                        return;
                    }
                );
        });
    }
    methodPostServiceCall(urlService: string, params: any, timeout: number = APP_CONFIG.COMMAND_TIME_OUT): Promise<any> {
        const me: any = this;
        // let headers: any = new HttpHeaders();
        // headers = headers.append(this.CONTENT_TYPE_HEADER, this.APPLICATION_TYPE);

        // const headers: HttpHeaders = new HttpHeaders({
        //   'Content-Type': this.APPLICATION_TYPE
        // });

        return new Promise((resolve: any, reject: any) => {
            me.http
                .post(urlService, params, { responseType: 'json' })
                // .post(urlService, params, { headers: headers, responseType: 'json' })
                .timeout(timeout)
                .subscribe(
                    (data: any) => {
                        me.resolveDataFromRequestCall(resolve, data);
                    },
                    (error: any) => {
                        reject(error);
                    },
                    () => {
                        return;
                    }
                );
        });
    }

    methodPostServiceWithOptions(url: string, params: any, opts: Object = {}, timeout: number = APP_CONFIG.COMMAND_TIME_OUT): Promise<any> {
        const me: any = this;
        const options = Object.assign({
            responseType: 'json',
        }, opts);
        return new Promise((resolve: any, reject: any) => {
            me.http.post(url, params, options)
                .timeout(timeout)
                .subscribe(
                    (data: any) => {
                        me.resolveDataFromRequest(resolve, data);
                    },
                    (error: any) => {
                        reject(error);
                    },
                    () => {
                    }
                );
        });
    }

    methodPostService(urlService: string, params: any, timeout: number = APP_CONFIG.COMMAND_TIME_OUT): Promise<any> {
        const me: any = this;
        return new Promise((resolve: any, reject: any) => {
            me.http
                .post(urlService, params, { responseType: 'json' })
                .timeout(timeout)
                .subscribe(
                    (data: any) => {
                        me.resolveDataFromRequest(resolve, data);
                    },
                    (error: any) => {
                        reject(error);
                    },
                    () => {
                        return;
                    }
                );
        });
    }

    methodExportPostJsonService(urlService: string, params: any, timeout: number = APP_CONFIG.COMMAND_TIME_OUT): Promise<any> {
        const me: any = this,
            headers: HttpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
            });
        return new Promise((resolve: any, reject: any) => {
            me.http
                .post(urlService, params, { headers: headers, responseType: 'json' })
                .timeout(timeout)
                .subscribe(
                    (data: any) => {
                        me.resolveDataFromRequest(resolve, data);
                    },
                    (error: any) => {
                        reject(error);
                    },
                    () => {
                        return;
                    }
                );
        });
    }

    methodPostLoginServiceNew(urlService: string, params: any, _timeout: number): Promise<any> {
        const me: any = this,
            headers: HttpHeaders = new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded;charset:UTF-8',
                'isClient': 'true',
            });
        return new Promise((resolve: any, reject: any) => {
            me.http
                .post(urlService, params, { headers: headers, observe: 'response' })
                .timeout(_timeout)
                .subscribe(
                    (data: any) => {
                        if (data.headers) {
                            this.utils.getTokenFromLogin(data.headers);
                        }
                        if (data.body) {
                            return resolve(data.body);
                        }
                        return resolve(false);
                    },
                    (error: any) => {
                        reject(error);
                    }
                );
        });
    }

    methodPostJsonService(urlService: string, params: any, headers: any = {}, timeout: number = APP_CONFIG.COMMAND_TIME_OUT): Promise<any> {
        const me: any = this;
        const httpHeaders: HttpHeaders = new HttpHeaders(Object.assign({
            'Content-Type': 'application/json',
        }, headers));

        return new Promise((resolve: any, reject: any) => {
            me.http
                .post(urlService, params, { headers: httpHeaders, responseType: 'blob' })
                .timeout(timeout)
                .subscribe(
                    (data: any) => {
                        me.resolve(data);
                        // me.resolveDataFromRequest(resolve, data);
                    },
                    (error: any) => {
                        reject(error);
                    },
                    () => {
                        return;
                    }
                );
        });
    }

    methodPostJsonServiceNew(urlService: string, params: any, headers: any = {}, timeout: number = APP_CONFIG.COMMAND_TIME_OUT): Promise<any> {
        const me: any = this;
        const httpHeaders: HttpHeaders = new HttpHeaders(Object.assign({
            'Content-Type': 'application/json',
            'Authorization': APP_CONFIG.KEY_JWT + this.utils.getJwtToken(),
            'Accept': '*/*'
        }, headers));
        return new Promise((resolve: any, reject: any) => {
            me.http
                .post(urlService, params, { headers: httpHeaders, responseType: 'json' })
                .timeout(timeout)
                .subscribe(
                    (data: any) => {
                        resolve(data);
                        // me.resolveDataFromRequest(resolve, data);
                    },
                    (error: any) => {
                        reject(error);
                    },
                    () => {
                        return;
                    }
                );
        });
    }

    methodPostMultiPart(url: string, data: any, timeout: number = APP_CONFIG.QUERY_TIME_OUT): Promise<any> {
        const me: any = this,
            headers: any = new HttpHeaders({
                'enctype': 'multipart/form-data;',
            });
        return new Promise((resolve: any, reject: any) => {
            me.http
                .post(url, data, { headers })
                .timeout(timeout)
                .subscribe(
                    (data: any) => me.resolveDataFromRequest(resolve, data),
                    (error: any) => reject(error)
                );
        });
    }

    methodGetMultiPart(urlService: string, query_timeout: number = APP_CONFIG.QUERY_TIME_OUT): Promise<any> {
        const me: any = this;
        return new Promise((resolve: any, reject: any) => {
            me.http
                .get(urlService, { responseType: 'blob' })
                .timeout(query_timeout)
                .subscribe(
                    (data: any) => me.resolveDataFromRequest(resolve, data),
                    (error: any) => reject(error)
                );
        });
    }

    methodGetServiceWithSubscrption(urlService: string, timeout: number = APP_CONFIG.QUERY_TIME_OUT, type: string = ''): Promise<any> {
        const me: any = this,
            headers: HttpHeaders = new HttpHeaders();

        this.unSubscribeData(this.searchSubscription);

        // headers.append('X-AUTH-TOKEN', window['X-AUTH-TOKEN'] || localStorage.getItem('X-AUTH-TOKEN'));

        return new Promise((resolve: any, reject: any) => {
            this.searchSubscription = me.http
                .get(urlService, { headers: headers, responseType: 'json' })
                .timeout(timeout)
                .subscribe(
                    (data: any) => {
                        me.resolveDataFromRequest(resolve, data);
                    },
                    (error: any) => {
                        reject(error);
                    },
                    () => {
                        return;
                    }
                );
        });
    }

    actionLogOut(urlService: string, timeout: number = APP_CONFIG.COMMAND_TIME_OUT): Promise<any> {
        return new Promise((resovle: any, reject: any) => {
            this.http
                .get(urlService)
                .timeout(timeout)
                .subscribe(
                    (result: any) => {
                        resovle(true);
                    },
                    (error: any) => {
                        reject(error);
                    }
                );
        });
    }

    private unSubscribeData(fetchData: Subscription): void {
        if (fetchData) {
            if (!fetchData.closed) {
                fetchData.unsubscribe();
            }
        }
    }

    private extractData(res: any): void {
        const data: any = res.json();
        return data || '';
    }
    private resolveDataFromRequestCall(resolve: any, data: any): void {
        console.log('resolveDataFromRequestCall', data);
        return resolve(data);
    }
    private resolveDataFromRequest(resolve: any, data: any): void {
        if (data) {
            if (data.status === 0 || data.data) {
                return resolve(data.data);
            }
        }
        return resolve(data);
    }

    private resolveDataPostLogin(resolve: any, data: any): void {
        if (data) {
            const win: any = window;
            if (!win.firstLogin) {
                win.firstLogin = true;
                return resolve(data);
            }
            return resolve(data);
        }
        return resolve(null);
    }

    methodPostLoginService(urlService: string, params: any, timeout: number = APP_CONFIG.COMMAND_TIME_OUT): Promise<any> {
        const me: any = this,
            headers: HttpHeaders = new HttpHeaders({
                'Content-Type': 'application/json;charset:UTF-8',
            });
        return new Promise((resolve: any, reject: any) => {
            me.http
                .post(urlService, params, { headers: headers, responseType: 'json' })
                .timeout(timeout)
                .subscribe(
                    (data: any) => {
                        me.resolveDataPostLogin(resolve, data);
                    },
                    (error: any) => {
                        reject(error);
                    },
                    () => {
                        return;
                    }
                );
        });
    }

    handleError(error: any): void {
        console.log(error);
    }

    methodGetServiceMultiPart(urlService: string, query_timeout: number = APP_CONFIG.QUERY_TIME_OUT): Promise<any> {
        const me: any = this;
        return new Promise((resolve: any, reject: any) => {
            me.http
                // .get(urlService, { headers: headers, responseType: 'json' })
                .get(urlService, { responseType: 'blob' })
                .timeout(query_timeout)
                .subscribe(
                    (data: any) => {
                        me.resolveDataFromRequest(resolve, data);
                    },
                    (error: any) => {
                        reject(error);
                    },
                    () => {
                        return;
                    }
                );
        });
    }

    methodPostServiceMultiPart(urlService: string, params: any, query_timeout: number = APP_CONFIG.QUERY_TIME_OUT): Promise<any> {
        const me: any = this;
        return new Promise((resolve: any, reject: any) => {
            me.http
                // .get(urlService, { headers: headers, responseType: 'json' })
                .post(urlService, params, { responseType: 'blob' })
                .timeout(query_timeout)
                .subscribe(
                    (data: any) => {
                        me.resolveDataFromRequest(resolve, data);
                    },
                    (error: any) => {
                        reject(error);
                    },
                    () => {
                        return;
                    }
                );
        });
    }

}
