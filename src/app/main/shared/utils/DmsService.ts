import {Injectable} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import * as _ from 'lodash';
import {HttpHelper} from './HttpHelper';
import {blobToDataURL, dataURLToBlob} from 'blob-util';
import {saveAs} from 'file-saver';

import {API_URL, APP_CONFIG} from '../../../app.config';

const removeBase64Header = (data: string) => {
    if (!data) {
        return data;
    }
    const base64Header = 'base64,';
    const index = data.indexOf(base64Header);
    return index > -1 ? data.substring(index + base64Header.length) : data;
};

const addImageBase64Header = (data: string) => 'data:image/jpeg;base64,' + data;

const asFileArray = (files: FileList): File[] => {
    if (!files) {
        return [];
    }

    const result: File[] = [];
    for (let i = 0; i < files.length; i++) {
        result.push(files[i]);
    }
    return result;
};

const checkFileSize = (files: File[], maxFileSize: number) => {
    return !_.find(files, file => file.size > maxFileSize);
};

const readDataBase64 = (file: File) => {
    return new Promise<any>((resolve: any, reject: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            resolve({
                name: file.name,
                size: file.size,
                type: file.type,
                data: reader.result.toString(),
            });
        };
        reader.onerror = () => {
            reject({
                name: file.name,
                size: file.size,
                type: file.type,
                message: '',
            });
        };
    });
};

const readFiles = (files: File[]) => {
    return Promise.all(_.map(files, readDataBase64));
};

const getFileExt = (filename: string): string => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

@Injectable({
    providedIn: 'root'
})
export class DmsService {
    constructor(private _httpHelper: HttpHelper, private _sanitizer: DomSanitizer) {
    }

    uploadBase64(fileName: string, base64: string): Promise<any> {
        const params = `data=${encodeURIComponent(removeBase64Header(base64))}&fileName=${encodeURIComponent(fileName)}`;
        return this._httpHelper.methodPostService(API_URL.DMS_SERVICES.UPLOAD, params, undefined);
    }

    getMultiPartContent(identifier, responseType: 'blob' | 'url' | 'safeUrl' = 'blob'): Promise<any> {
        const params = `identifer=${encodeURIComponent(identifier)}`;
        return this._httpHelper.methodGetMultiPart(API_URL.DMS_SERVICES.GET_MULTIPART_CONTENT + '?' + params)
            .then(resData => {
                if (resData && resData.errorcode) {
                    return undefined;
                }
                const blob = resData;
                if (responseType === 'blob') {
                    return blob;
                }

                return blobToDataURL(blob).then(dataUrl => {
                    if (responseType === 'safeUrl') {
                        return this._sanitizer.bypassSecurityTrustUrl(dataUrl);
                    }
                    return dataUrl;
                });
            });
    }

    postMultiPartContent(formData: FormData, fileName: string = '') {
        formData.append('fileName', fileName);
        formData.append('extension', getFileExt(fileName));
        return this._httpHelper.methodPostMultiPart(API_URL.DMS_SERVICES.POST_MULTIPART_CONTENT, formData);
    }

    searchPaging(offset: number, limit: number = APP_CONFIG.ITEMS_FOR_SELECTION): Promise<any> {
        const params = `loadCfg=${JSON.stringify({offset, limit})}`;
        return this._httpHelper.methodPostService(API_URL.DMS_SERVICES.SEARCH_PAGING, params);
    }

    getBase64Content(identifier: string): Promise<string | undefined> {
        const params = `identifier=${encodeURIComponent(identifier)}`;
        return this._httpHelper.methodGetService(
            API_URL.DMS_SERVICES.GET_BASE64_CONTENT + '?' + params, undefined)
            .then(resData => {
                if (resData && resData.errorcode) {
                    return undefined;
                }
                return resData;
            });
    }

    saveAsBlob(blob, fileName: string): void {
        if (blob && !_.isEmpty(fileName)) {
            saveAs(blob, fileName);
        }
    }

    saveAsFromBase64(base64: string, fileName: string): void {
        if (!_.isEmpty(base64) && !_.isEmpty(fileName)) {
            const blob = dataURLToBlob(base64);
            saveAs(blob, fileName);
        }
    }

    delete(identifier: string): Promise<any> {
        const params = `identifier=${encodeURIComponent(identifier)}`;
        return this._httpHelper.methodPostService(API_URL.DMS_SERVICES.DELETE, params);
    }

    selectFile(accept: string = '*', maxFileSize: number = 3 * 1048576, multiple: boolean = false): Promise<any> {
        const id = _.uniqueId();
        const inputFile = document.createElement('input');
        inputFile.accept = accept;
        inputFile.multiple = multiple;
        inputFile.type = 'file';
        inputFile.name = id;
        inputFile.id = id;
        inputFile.setAttribute('style', 'display:none');
        const promise = new Promise<any>((resolve: any, reject: any) => {
            inputFile.onclick = () => {
                const eventName = 'mouseover';
                const useCapture = true;
                const onMouseover = () => {
                    document.body.removeEventListener(eventName, onMouseover, useCapture);
                    setTimeout(() => {
                        const files: File[] = asFileArray(inputFile.files);
                        if (!checkFileSize(files, maxFileSize)) {
                            return reject({
                                files: [],
                                message: 'ERROR_MAX_FILE_SIZE',
                            });
                        }
                        return resolve({
                            files,
                            message: null,
                        });
                    }, 100);
                };
                document.body.addEventListener(eventName, onMouseover, useCapture);
            };
            inputFile.click();
        });
        return promise;
    }

    selectAndUploadBase64Files(accept: string = '*', maxFileSize: number = 3 * 1048576, multiple: boolean = false): Promise<any> {
        return this.selectFile(accept, maxFileSize, multiple)
            .then(({files}) => readFiles(files))
            .then(objArray => {
                if (objArray.length > 0) {
                    const arrayPromises = _.map(objArray, (o) => {
                        return this.uploadBase64(o.name, o.data).then(data => {
                            if (data && data.errorcode) {
                                throw {
                                    message: data.message || 'SYSTEM_ERROR',
                                };
                            }
                            return data;
                        });
                    });
                    return Promise.all(arrayPromises);
                } else {
                    return [];
                }
            });
    }

    selectAndUploadMultipartFiles(accept: string = '*', maxFileSize: number = 3 * 1048576, multiple: boolean = false): Promise<any> {
        return this.selectFile(accept, maxFileSize, multiple)
            .then(({files}) => {
                if (files.length > 0) {
                    const arrayPromises = _.map(files, (file) => {
                        const formData: FormData = new FormData();
                        formData.append('file', file, file.name);

                        return this.postMultiPartContent(formData, file.name).then(data => {
                            if (data && data.errorcode) {
                                throw {
                                    message: data.message || 'SYSTEM_ERROR',
                                };
                            }
                            return data;
                        });
                    });
                    return Promise.all(arrayPromises);
                } else {
                    return [];
                }
            });
    }

    getResources(refCodes: Array<string>): Promise<any> {
        const params = 'refCodes=' + JSON.stringify(refCodes);
        return this._httpHelper.methodPostService(API_URL.DMS_SERVICES.GET_RESOURCES, params, APP_CONFIG.QUERY_TIMEOUT);
    }
}
