import * as _ from 'lodash';
import * as moment from 'moment';
import {Moment} from 'moment';
import {MOMENT_DATE_FORMAT} from '../../../app.config';

function formatDate(value: number | string | Date | Moment, format: string): string {
    format = format || MOMENT_DATE_FORMAT.DATE;
    return moment(value).format(format);
}

function formatNumber(number: number): string {
    return number.toString();
}

function formatCurrency(number: number): string {
    return number.toString();
}

// export function getHeaderName(screenName: string, colDef: any): string {
//     colDef = colDef || {};
//     return _.defaultTo(screenName, '').toUpperCase() + '.' + (_.snakeCase(colDef.field ? colDef.field : colDef.colId)).toUpperCase();
// }

export function valueGetter(params: any): string {
    const field = params.colDef.field || params.colDef.colId;
    console.log('valueGetter: ' + field + '=' + params.data[field]);
    return params.data[field];
}

export function valueSetter(params: any): boolean {
    const field = params.colDef.field || params.colDef.colId;
    params.data[field] = params.newValue;
    console.log('valueSetter: ' + field + '=' + params.newValue);
    return true;
}

function dateFormatter(params: any): string {
    let formatted: string = params.value;
    if (_.isNumber(params.value)) {
        formatted = moment(params.value).format(MOMENT_DATE_FORMAT.DATE);
    }
    console.log('dateFormatter: value=' + params.value + ', formatted=' + formatted);
    return formatted;
}

function numericFormatter(params: any): string {
    let formatted: string = params.value;
    if (_.isNumber(params.value)) {
        formatted = params.value.toString();
    }
    console.log('numericFormatter: value=' + params.value + ', formatted=' + formatted);
    return formatted;
}

// export function valueFormatter(params: any): string {
//     const type: string = params.colDef.type || 'textColumn';
//     console.log('valueFormatter: ' + type + ', value=' + params.value + ', formatted=' + formatValue(type, params.value));
//     return formatValue(type, params.value);
// }

export function formatValue(type: string, value, ...args): string {
    switch (type) {
        case COLUMN_TYPE.DATE_COLUMN:
            return formatDate(value, args[0]);
        case COLUMN_TYPE.NUMERIC_COLUMN:
            return formatNumber(value);
        case COLUMN_TYPE.CURRENCY_COLUMN:
            return formatCurrency(value);
        default:
            return value ? value.toString() : '';
    }
}

export function parseStringToTimeStamp(value: string): number {
    const m = moment(value, MOMENT_DATE_FORMAT.DATE);
    console.log('parseStringToTimeStamp: ' + m.valueOf());
    return m.valueOf();
}

// export function parseDateToTimeStamp(value: number | Date): number {
//     const m = moment(value);
//     console.log('parseDateToTimeStamp: ' + m.valueOf());
//     return m.valueOf();
// }
//
// export function parseTimeStampToDate(value: number): Date {
//     const m = moment(value);
//     console.log('parseTimeStampToDate: ' + m.toDate());
//     return m.toDate();
// }

export const COLUMN_TYPE = {
    STRING_COLUMN: 'stringColumn',
    NUMERIC_COLUMN: 'numericColumn',
    CURRENCY_COLUMN: 'currencyColumn',
    DATE_COLUMN: 'dateColumn',
    MAP_ALL_COLUMN_TYPES: {
        'numericColumn': {
            enableValue: true,
            allowedAggFuncs: ['sum', 'avg', 'min', 'max'],
            columnType: 'numericColumn',
            filter: 'agNumberColumnFilter',
            filterParams: {
                applyButton: true,
                newRowsAction: 'keep'
            },
            valueGetter: valueGetter,
            // valueSetter: valueSetter,
            valueFormatter: numericFormatter,
            cellEditor: 'agTextCellEditor',
        },
        'currencyColumn': {
            enableValue: true,
            allowedAggFuncs: ['sum', 'avg', 'min', 'max'],
            columnType: 'currencyColumn',
            filter: 'agNumberColumnFilter',
            filterParams: {
                applyButton: true,
                newRowsAction: 'keep'
            },
            valueGetter: valueGetter,
            // valueSetter: valueSetter,
            valueFormatter: numericFormatter,
            cellEditor: 'agTextCellEditor',
        },
        'dateColumn': {
            enableValue: true,
            allowedAggFuncs: ['count', 'min', 'max'],
            columnType: 'dateColumn',
            filter: 'agDateColumnFilter',
            filterParams: {
                applyButton: true,
                newRowsAction: 'keep'
            },
            valueGetter: valueGetter,
            // valueSetter: valueSetter,
            valueFormatter: dateFormatter,
            cellEditor: 'datePickerEditor',
            // cellEditorParams: {
            //     useFormatter: true,
            //     parseValue: parseStringToTimeStamp,
            // },
        },
        'stringColumn': {
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            allowedAggFuncs: ['count'],
            columnType: 'stringColumn',
            filter: 'agTextColumnFilter',
            filterParams: {
                applyButton: true,
                newRowsAction: 'keep',
            },
            valueGetter: valueGetter,
            // valueSetter: valueSetter,
            // valueFormatter: valueFormatter,
            cellEditor: 'agTextCellEditor',
        }
    }
};

const MAP_DATA_TYPE_TO_COLUMN_TYPE = {
    'string': 'stringColumn',
    'numeric': 'numericColumn',
    'date': 'dateColumn',
};

export function buildColumnDefs(dataSchema: any): any[] {
    const entityName: string = dataSchema.entityName.toUpperCase();
    return _.map(dataSchema.properties, (value: any, key: any) => {
        return _.merge({},
            COLUMN_TYPE.MAP_ALL_COLUMN_TYPES[MAP_DATA_TYPE_TO_COLUMN_TYPE[value.type]],
            {
                field: value.name,
                entityName: entityName
            });
    });
}

export function headerNameGetter(params): string {
    if (!params.context.isGridReady) {
        return null;
    }
    if (_.isEmpty(params.colDef.children)) {
        return params.context.translateService.instant(params.colDef.entityName + '.' + _.snakeCase(params.colDef.field).toUpperCase());
    }
    if (params.colDef.headerName) {
        return params.colDef.entityName + '.' + _.snakeCase(params.colDef.headerName).toUpperCase();
    }
    return null;
}
