import {Injectable} from '@angular/core';
import {HttpHelper} from './HttpHelper';
import {API_URL, APP_CONFIG} from '../../../app.config';
import * as _ from 'lodash';
import { AppState } from './AppState';

const separator = '.';

@Injectable({
    providedIn: 'root'
})
export class FormConfigService {
    constructor(private _httpHelper: HttpHelper, private _appState: AppState) {
    }

    static buildScreenId(path: string = ''): string {
        return _.map(path.split(separator), _.snakeCase).join(separator).toUpperCase();
    }

    setProperty(screenId: string, value: string, propertyName: string = 'form_config'): Promise<any> {
        const url: string = API_URL.FORM_SERVICE.SET_PROPERTY;
        const params = `appCode=GATEWAY&screenId=${APP_CONFIG.APP_CODE + separator + screenId}&propertyName=${propertyName}&value=${encodeURIComponent(value)}`;
        return this._httpHelper.methodPostService(url, params);
    }

    getPropertyByContext(screenId: string, propertyName: string = 'form_config'): Promise<any> {
        const url: string = API_URL.FORM_SERVICE.GET_PROPERTY_BY_CONTEXT + `?screenId=${APP_CONFIG.APP_CODE + separator + screenId}&propertyName=${propertyName}&getDefault=true`;
        return this._httpHelper.methodGetService(url);
    }

    updateJsonFormSchema(jsonFormSchema, entitySchema): void {
        if (entitySchema) {
            _.forEach(entitySchema.properties, (entityField: any) => {
                const jsonFieldPath = 'properties.' + entityField.name.replace('.', '.properties.');
                const jsonField = _.get(jsonFormSchema, jsonFieldPath);
                if (jsonField) {
                    jsonField.required = entityField.required;
                    jsonField.editable = entityField.editable;
                    jsonField.securedField = entityField.securedField;
                    if (entityField.securedField) {
                        jsonField.readonly = true;
                    } else {
                        jsonField.readonly = !entityField.editable;
                    }
                    jsonField.validationExpr = entityField.validationExpr || true;
                }
            });
        }
    }

    updateJsonFormSchemaCheckTenant(jsonFormSchema, entitySchema): void {
        if (this._appState.isLCSCA()) {
            return;
        }

        if (entitySchema) {
            _.forEach(entitySchema.properties, (entityField: any) => {
                const jsonFieldPath = 'properties.' + entityField.name.replace('.', '.properties.');
                const jsonField = _.get(jsonFormSchema, jsonFieldPath);
                if (jsonField) {
                    jsonField.required = entityField.required;
                    jsonField.editable = entityField.editable;
                    jsonField.securedField = entityField.securedField;
                    if (entityField.securedField) {
                        jsonField.readonly = true;
                    } else {
                        jsonField.readonly = !entityField.editable;
                    }
                    jsonField.validationExpr = entityField.validationExpr || true;
                }
            });
        }
    }
}
