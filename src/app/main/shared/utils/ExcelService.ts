import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {TranslateService} from '@ngx-translate/core';

import {API_URL} from '../../../app.config';
import {HttpHelper} from './HttpHelper';
import {UtilCommon} from './UtilCommon';

const MIME_EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const EXCEL_EXT = '.xlsx';

function transformFieldName(fieldName: string): string {
    const separator = '.';
    return _.map(fieldName.split(separator), _.snakeCase).join(separator).toUpperCase();
}

@Injectable({
    providedIn: 'root'
})
export class ExcelService {
    constructor(private _httpHelper: HttpHelper,
                private _utilCommon: UtilCommon,
                private _translateService: TranslateService) {
    }

    private _createColumns(screenName: string, cols: string[]): any[] {
        return cols.map(c => ({
            name: c,
            title: this._translateService.instant(`${screenName}.${transformFieldName(c)}`),
        }));
    }

    private _processResponse(response: any, fileName = '', screenName = ''): Promise<any> {
        if (response.blob.type.indexOf('text') >= 0) {
            return this._utilCommon.readBlobAsText(response.blob)
                .then(text => {
                    try {
                        const json = JSON.parse(text);
                        if (!json) {
                            return json;
                        } else {
                            return json.data || json;
                        }
                    } catch (e) {
                        return text;
                    }
                });
        } else {
            this._utilCommon.downloadFile(
                fileName || response.fileName || (screenName + EXCEL_EXT).toLowerCase(),
                response.blob);
            return Promise.resolve(false);
        }
    }

    export({cols = [], filterModel = {}, screenName = '', sortModel = []}: any = {},
           fileName: string = ''): Promise<any> {
        const params: any = {
            filterModel,
            sortModel,
            columns: this._createColumns(screenName, cols)
        };
        return this._httpHelper.methodPostBlob(
            API_URL.EXCEL_SERVICE[screenName],
            JSON.stringify(params)
        ).then((response: any) => this._processResponse(response, fileName, screenName));
    }

    downloadExportedFile(jobExecutionId: string, fileName: string = ''): Promise<any> {
        const url = `${API_URL.EXCEL_SERVICE.DOWNLOAD_EXPORTED_FILE}?jobExecutionId=${jobExecutionId}`;
        return this._httpHelper.methodGetFileService(url)
            .then((response: any) => this._processResponse(response, fileName, jobExecutionId));
    }

    exportWithColumns({columns = [], filterModel = {}, screenName = '', sortModel = []}: any = {},
           fileName: string = ''): Promise<any> {
        const params: any = {
            filterModel,
            sortModel,
            columns
        };
        return this._httpHelper.methodPostBlob(
            API_URL.EXCEL_SERVICE[screenName],
            JSON.stringify(params)
        ).then((response: any) => this._processResponse(response, fileName, screenName));
    }
}
