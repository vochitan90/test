import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { MOMENT_DATE_FORMAT, VALIDATION_CONSTANT } from '../const/app.constant';

@Injectable({
    providedIn: 'root'
})

export class UtilCommon {
    constructor(private router: Router) {
    }

    getAppState(): any {
        // return window.['APP_STATE'];
        return '';
    }

    getJwtToken(): string {
        return localStorage.getItem('tokenJWT');
    }

    generateUUID(): string {
        try {
            let d: number = new Date().getTime();
            const uuid: any = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
                function (c: any): string {
                    const r: any = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
            return uuid;
        } catch (e) {
            // console.log(e);
        }
    }

    avoidEventBubble(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
    }

    formatDate(value: any): string {
        if (value && typeof value === 'number') {
            const d: Date = new Date(value);
            const m: moment.Moment = moment(d);
            return m.format(MOMENT_DATE_FORMAT.DATE);
        }
    }

    formatDateFullTime(value: any): string {
        if (value && typeof value === 'number') {
            const d: Date = new Date(value);
            const m: moment.Moment = moment(d);
            return m.format(MOMENT_DATE_FORMAT.DATE_TIME);
        }
    }

    formatDateJsonSchemaForm(value: any): string {
        if (value && typeof value === 'number') {
            value = new Date(value);
            const date = (value.getDate() > 9) ? value.getDate() : '0' + value.getDate();
            const month = ((value.getMonth() + 1) > 9) ? (value.getMonth() + 1) : '0' + (value.getMonth() + 1);
            return `${value.getFullYear()}-${month}-${date}`;
        }
    }

    loadCSS(cssId: any, csstUrl: any): Promise<any> {

        return new Promise((resolve: any, reject: any) => {
            if (!document.getElementById(cssId)) {
                const head: any = document.getElementsByTagName('head')[0];
                const link: any = document.createElement('link');
                link.id = cssId;
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = csstUrl;
                link.media = 'all';
                link.onload = function (): void {
                    resolve(true);
                };
                link.onerror = function (): void {
                    resolve(undefined);
                };
                head.appendChild(link);
            } else {
                resolve(true);
            }
        });
    }

    async loadScriptAsync(objScript: any, scriptUrl: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const me: any = this;

            if (objScript) {
                resolve(me);
                return;
            }

            const script: any = document.createElement('script');
            script.type = 'text/javascript';
            script.src = scriptUrl;
            script.async = false;
            if (script.readyState) {  // IE
                script.onreadystatechange = function (): void {
                    if (script.readyState === 'loaded' ||
                        script.readyState === 'complete') {
                        script.onreadystatechange = undefined;
                        resolve(me);
                    }
                };
            } else {  // Others
                script.onload = function (): void {
                    resolve(me);
                };
            }
            document.head.appendChild(script);
        });

    }

    loadScript(objScript: any, scriptUrl: any, callback: any, typeAsync: boolean = false): void {
        const me: any = this;

        if (objScript) {
            callback(me);
            return;
        }

        const script: any = document.createElement('script');
        script.type = 'text/javascript';
        script.src = scriptUrl;
        script.async = typeAsync;
        if (script.readyState) {  // IE
            script.onreadystatechange = function (): void {
                if (script.readyState === 'loaded' ||
                    script.readyState === 'complete') {
                    script.onreadystatechange = undefined;
                    callback(me);
                }
            };
        } else {  // Others
            script.onload = function (): void {
                callback(me);
            };
        }
        document.head.appendChild(script);
    }

    remove_unicode(str: string): string {
        if (!str) {
            return str;
        }
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ầ|Ẩ|Ậ|Ă|Ằ|Ấ|Ă|Ẳ|Ẵ/g, 'A');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ẽ|Ể|Ễ/g, 'E');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ổ|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ|Ố/g, 'O');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/Ỷ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
        str = str.replace(/đ/g, 'd');
        str = str.replace(/Đ/g, 'D');
        return str;
    }

    getFilterModelString(filterModel: any, filter: string = ``): string {
        let filterString: string = filter;
        filterString = '';
        if (this.checkObjectIsEmpty(filterModel)) {
            return '';
        }
        const keys: any = Object.keys(filterModel);
        keys.forEach((key: any) => {
            const value: any = filterModel[key];
            if (filterModel[key] !== null) {
                if (filterString.length === 0) {
                    if (key === 'orderDate' || key === 'receiptDate' || key === 'makerDate') {
                        filterString = `{"field":"${key}","value":${filterModel[key]},"comparison":"on"}`;
                    } else if (key === 'hasTaxCode') {
                        filterString = `{"field":"${key}","value":${filterModel[key]}}`;
                    } else {
                        filterString = `{"field":"${key}","value":${JSON.stringify(value)}}`;
                    }
                } else {
                    if (key === 'orderDate' || key === 'receiptDate' || key === 'makerDate') {
                        filterString += `,{"field":"${key}","value":${value},"comparison":"on"}`;
                    } else if (key === 'hasTaxCode') {
                        filterString += `,{"field":"${key}","value":${value}`;
                    } else {
                        filterString += `,{"field":"${key}","value":${JSON.stringify(value)}}`;
                    }
                }
            }
        });
        return filterString;
    }

    getFilterModelSorts(filterModel: any, filter: string = ``): string {
        let filterString: string = filter;
        filterString = '';
        if (this.checkObjectIsEmpty(filterModel)) {
            return '';
        }
        const keys: any = Object.keys(filterModel);
        keys.forEach((key: any) => {
            if (filterModel[key] !== null) {
                if (filterString.length === 0) {
                    filterString = `{"field":"${key}","direction":"${filterModel[key]}"}`;
                } else {
                    filterString += `,{"field":"${key}","direction":"${filterModel[key]}"}`;
                }

            }
        });
        return filterString;
    }

    splitCharacterSpace(str: string): string {
        if (!str) {
            return '';
        }
        return str.replace(/\s/g, '');
    }

    checkISArray(data: any): boolean {
        if (!data) {
            return false;
        }
        if (Array.isArray(data) && data.length > 0) {
            return true;
        }
        return false;
    }

    // get data header from server
    getTokenFromLogin(resHeaders: any): void {
        if (resHeaders) {
            resHeaders.forEach((key: any, data: any) => {
                if (key.toString().toUpperCase() === 'X-AUTH-TOKEN') {
                    if (this.checkISArray(data)) {
                        data = data[0];
                    }
                    window['X-AUTH-TOKEN'] = data;
                    localStorage.setItem('X-AUTH-TOKEN', data);
                    localStorage.setItem('tokenJWT', data);
                } else if (key.toString().toUpperCase() === 'X-AUTH-MESSAGE') {
                    window['X-AUTH-MESSAGE'] = decodeURIComponent(data);
                }
            });
        }

    }

    getToken(): string {
        return localStorage.getItem('tokenJWT') || '';
    }

    routingPageChild(url: string, route: any = null, ...data: any[]): void {
        if (route) {
            this.router.navigate([url, ...data], { relativeTo: route });
        } else {
            this.router.navigate([url, ...data]);
        }
    }

    routingBackPage(url: string, callback: any = null): void {
        this.router.navigate([url]).then((action: any) => {
            if (callback) {
                callback.call();
            }
        });
    }

    handleUrl(href: string): string {
        let handleUrl: any = '', url: any;
        if (href.indexOf('#') > -1) {
            url = href.split('#');
            handleUrl = url[1].toString();
        }
        return handleUrl;
    }

    handleDataSubmitServer(dataHandle: any): any {
        if (dataHandle.code === -1) {
            return -1;
        }
        return dataHandle.code;
    }

    checkObjectIsEmpty(map: any): boolean {
        for (const key in map) {
            if (map.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }

    compareToDate(beforeDate: any, afterDate: any): number {
        const date1: any = moment(beforeDate);
        const date2: any = moment(afterDate);
        if (date1 < date2) {
            return 1;
        }
        if (date1 > date2) {
            return -1;
        }
        return 0;
    }

    validateEmail(email: string): boolean {
        const regex: any = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regex.test(email);
    }

    checkIsNumber(str: any): boolean {
        return !isNaN(str);
    }

    convertDateToIsoString(date: number): string {
        if (!date) {
            return new Date().toISOString();
        }
        return new Date(date).toISOString();
    }

    isDateType(date: any): boolean {
        return date && Object.prototype.toString.call(date) === '[object Date]';
    }

    isValidDate(date: any): boolean {
        return !isNaN(date);
    }

    readBlobAsText(blob: Blob): Promise<string> {
        if (!blob) {
            return Promise.resolve('');
        }
        return new Promise((resolve, reject) => {
            const reader: any = new FileReader();
            reader.addEventListener('loadend', () => {
                resolve(reader.result);
            });
            reader.addEventListener('error', (e) => {
                reader.abort();
                reject(e);
            });
            reader.readAsText(blob);
        });
    }

    downloadFile(fileName: string, blob: Blob): void {
        if (blob) {
            const anchorElement = document.createElement('a');
            anchorElement.download = fileName;
            anchorElement.href = window.URL.createObjectURL(blob);
            anchorElement.click();
        }
    }

    checkIsString(str: any): boolean {
        return typeof (str) === 'string' || str instanceof String;
    }

    toSnakeCase(str: string, separator = '.'): string {
        return _.map(_.split(str, separator), _.snakeCase).join(separator);
    }

    encodeUriEachField(dataObj: any): string {
        let filterString = '';
        if (this.checkObjectIsEmpty(dataObj)) {
            return filterString;
        }
        const keys: any = Object.keys(dataObj);
        let encodeText = '';
        keys.forEach((key: any) => {
            if (dataObj[key] !== null) {
                encodeText = encodeURI(dataObj[key]);
                filterString += `${key}=${encodeText}&`;
            }
        });
        if (filterString.lastIndexOf('&') > -1) {
            filterString = filterString.slice(0, -1);
        }
        return filterString;
    }

    setRootPage(page: string, callBack: any = null): void {
        this.router.navigate(['/' + page], { replaceUrl: true }).then(() => {
            if (callBack) {
                callBack.call();
            }
        });
    }

    getLinkDashboard(sanitizer: any, isToolbar: boolean): any {
        const versionDashboard = window['MULTIPLE_APP']['dashboard'] || new Date().getTime();
        let toolbar = '?v=' + versionDashboard;
        if (isToolbar) {
            toolbar += '&toolbar=true';
        }
        if (location.href.indexOf('gateway-dev') > -1) {
            return sanitizer.bypassSecurityTrustResourceUrl('https://gateway-dev.lcssoft.com.vn/crm/dashboard/index.html' + toolbar);
        } else if (location.href.indexOf('localhost') > -1) {
            return null;
        } else {
            return sanitizer.bypassSecurityTrustResourceUrl(window.location.origin + '/dashboard/index.html' + toolbar);
        }
    }

    checkUsernameValid(): boolean {
        if (!window['APP_STATE']) {
            return true;
        }
        const username: string = localStorage.getItem('username');
        const usernameTemp: string = window['APP_STATE'].username;
        if (!username || !usernameTemp) {
            return true;
        }
        if (username.toLowerCase().toString() !== usernameTemp.toLowerCase().toString()) {
            return false;
        }
        return true;
    }

    getValueFromForm(formControl, control): any {
        return formControl.get(control).value;
    }

    checkIsNotNull(data): boolean {
        if (data == null || data === undefined) {
            return false;
        }
        if (data === '') {
            return false;
        }
        return true;
    }

    getActionColumn(entityName: string): any {
        const action = {
            cellRenderer: 'actionCellRenderer',
            colId: 'action',
            maxWidth: 40,
            minWidth: 40,
            entityName: entityName,
            suppressMenu: true,
            suppressSorting: true,
            suppressFilter: true,
            lockVisible: true,
            resizable: true,
            enablePivot: true,
            pinned: 'right',
            toolPanelClass: ['column-panel-none'],
            lockPinned: true,
            cellStyle:  {padding: 0, margin: 0}
        };
        return action;
    }

    disableButton(buttonEle){
        buttonEle.setAttribute('disabled', 'disabled');
    }

    enabledButton(buttonEle){
        buttonEle.removeAttribute('disabled');
    }

    formatDatePattern(value: any, pattern: string = 'DD/MM/YYYY'): string {
        if (value && typeof value === 'number') {
          let d: Date = new Date(value);
          let m: moment.Moment = moment(d);
          return m.format(pattern);
        }
    }

     checkFileValid(files):  Promise<any>{
        const file:File = files[0];
        if(file.size < 10){
            return Promise.resolve(undefined);
        }
        return Promise.resolve(files);
    }

    getExtensionFileDoc(fileName: string): string{
        if(fileName.indexOf('.doc') > -1){
            return '.doc';
        }
        if(fileName.indexOf('.docx') > -1){
            return '.docx';
        }
        return '';
    }

    // checkValidationErrorSubmit(data){
    //     if(this.checkIsNotNull(data)){
    //         if(data.code === VALIDATION_CONSTANT.EXIST){
    //             // return VALIDATION_CONSTANT.EXIST;
    //             return 'Mã đã tồn tại';
    //         }
    //         if(data.code == VALIDATION_CONSTANT.JOBTITLE_CONFIG_ANOTHOR_WF){
    //             return VALIDATION_CONSTANT.JOBTITLE_CONFIG_ANOTHOR_WF;
    //         }
    //         if(data.code == VALIDATION_CONSTANT.VALID_EFFECTIVEDATE){
    //             return 'Ngày hiệu lực không hợp lệ';
    //         }
    //     }
    //     return '';
    // }
    
}

// generateUUID(): string {
//     try {
//         let d: number = new Date().getTime();
//         const uuid: any = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
//             function (c: any): string {
//                 const r: any = (d + Math.random() * 16) % 16 | 0;
//                 d = Math.floor(d / 16);
//                 return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
//             });
//         return uuid;
//     } catch (e) {
//         // console.log(e);
//     }
// }