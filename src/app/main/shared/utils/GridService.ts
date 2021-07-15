import * as _ from 'lodash';
import { CONSTANT } from '../const/app.constant';

export const transformRequestBeforeQuery = (request: any, type: string = CONSTANT.REQUEST): any => {
    const mapChangeCols = {};
    if (!_.isEmpty(mapChangeCols)) {
        request = _.cloneDeep(request);
        const { filterModel, sortModel } = request;
        _.forEach(mapChangeCols, (toCol, fromCol) => {
            if (filterModel[fromCol]) {
                filterModel[toCol] = filterModel[fromCol];
                delete filterModel[fromCol];
            }
            const sortCol = _.find(sortModel, m => m.colId === fromCol);
            if (sortCol) {
                sortCol.colId = toCol;
            }
        });
    }
    return request;
}


export const transformRequestCountBeforeQuery = (request: any): any => {
    const mapChangeCols = {};
    request = _.cloneDeep(request);
    if (!_.isEmpty(mapChangeCols)) {
        
        const { filterModel, sortModel } = request;

        _.forEach(mapChangeCols, (toCol, fromCol) => {
            if (filterModel[fromCol]) {
                filterModel[toCol] = filterModel[fromCol];
                delete filterModel[fromCol];
            }

            const sortCol = _.find(sortModel, m => m.colId === fromCol);
            if (sortCol) {
                sortCol.colId = toCol;
            }
        });
    }
    return request;
}


export const checkIsNotNull = (data: any): boolean => {
    if (data == null || data == undefined) {
        return false;
    }
    if (data == '') {
        return false;
    }
    return true;
}

export const generateUUID = (): string =>{
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


export const encodeRequestParams = (data, type: string = 'JSON'): string =>{
    try {
        if(type === 'JSON'){
            return encodeURIComponent(JSON.stringify(data));
        }
        return data;
    } catch (e) {
        // console.log(e);
    }
}

export const GRID_ATTRIBUTES = ['fullText', 'searchMode', 'lastRequest', 'normalFilterModel', 'columnState'];
