import * as _ from 'lodash';

function transformFieldName(fieldName: string): string {
    const separator = '.';
    return _.map(fieldName.split(separator), _.snakeCase).join(separator).toUpperCase();
}

export default function (params): string {
    if (!params.context.isGridReady) {
        return '';
    }
    if (params.colDef.field) {
        return params.context.translateService.instant(params.colDef.entityName + '.' + transformFieldName(params.colDef.field));
    }
    if (params.colDef.headerName) {
        let headerName = params.colDef.headerName.toUpperCase();
        if (!_.isEmpty(params.colDef.entityName)) {
            headerName = params.colDef.entityName + '.' + params.colDef.headerName.toUpperCase();
        }
        return params.context.translateService.instant(headerName);
    }
    return '';
}
