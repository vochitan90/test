import DataType from './DataType';
import * as _ from 'lodash';
import Formatter from './Formatter';
import headerNameGetter from './headerNameGetter';

function valueGetter(params: any): string {
    const field = params.colDef.field || params.colDef.colId;
    return _.get(params.data, field);
}

function valueSetter(params: any): boolean {
    const field = params.colDef.field || params.colDef.colId;
    _.set(params.data, field, params.newValue);
    return true;
}

export default class ColumnDefFactory {
    private static MAP_DEFAULT_COLUMN_DEFS = {
        DEFAULT: {
            width: 120,
            headerValueGetter: headerNameGetter,
        },
        [DataType.STRING]: {
            dataType: DataType.STRING,
            resizable: true,
            allowedAggFuncs: ['count'],
            filter: 'agTextColumnFilter',
            filterParams: {
                applyButton: true,
                newRowsAction: 'keep',
                suppressAndOrCondition: true,
                caseSensitive:true,
            },
            valueGetter: valueGetter,
            valueSetter: valueSetter,
            cellEditor: 'inputEditor',
        },
        [DataType.NUMERIC]: {
            dataType: DataType.NUMERIC,
            allowedAggFuncs: ['sum', 'avg', 'min', 'max'],
            filter: 'agNumberColumnFilter',
            filterParams: {
                applyButton: true,
                newRowsAction: 'keep',
                suppressAndOrCondition: true,
            },
            valueGetter: valueGetter,
            valueSetter: valueSetter,
            valueFormatter: Formatter.numericFormatter,
            valueParser: (params) => {
                return Number(params.newValue);
            },
            cellEditor: 'agTextCellEditor',
        },
        [DataType.CURRENCY]: {
            dataType: DataType.CURRENCY,
            allowedAggFuncs: ['sum', 'avg', 'min', 'max'],
            filter: 'agNumberColumnFilter',
            filterParams: {
                applyButton: true,
                newRowsAction: 'keep',
                suppressAndOrCondition: true,
            },
            valueGetter: valueGetter,
            valueSetter: valueSetter,
            valueFormatter: Formatter.currencyFormatter,
            valueParser: (params) => {
                return Number(params.newValue);
            },
            cellEditor: 'agTextCellEditor',
        },
        [DataType.DATE]: {
            dataType: DataType.DATE,
            allowedAggFuncs: ['count', 'avg', 'min', 'max'],
            filter: 'agDateColumnFilter',
            filterParams: {
                applyButton: true,
                newRowsAction: 'keep',
                suppressAndOrCondition: true,
            },
            valueGetter: valueGetter,
            valueSetter: valueSetter,
            valueFormatter: Formatter.dateFormatter,
            cellEditor: 'datePickerEditor',
        },
        [DataType.DATE_TIME]: {
            dataType: DataType.DATE_TIME,
            allowedAggFuncs: ['count', 'avg', 'min', 'max'],
            filter: 'agDateColumnFilter',
            filterParams: {
                applyButton: true,
                newRowsAction: 'keep',
                suppressAndOrCondition: true,
            },
            valueGetter: valueGetter,
            valueSetter: valueSetter,
            valueFormatter: Formatter.dateTimeFormatter,
            cellEditor: 'datePickerEditor',
        },
    };

    private static MAP_DEFAULT_COLUMN_DEFS_CHECKBOX = {
        DEFAULT: {
            width: 120,
            headerValueGetter: headerNameGetter,
            headerCheckboxSelection: Formatter.isFirstColumn,
            checkboxSelection: Formatter.isFirstColumn,
        },
        [DataType.STRING]: {
            dataType: DataType.STRING,
            allowedAggFuncs: ['count'],
            filter: 'agTextColumnFilter',
            filterParams: {
                applyButton: true,
                newRowsAction: 'keep',
                suppressAndOrCondition: true,
                caseSensitive:true,
            },
            valueGetter: valueGetter,
            valueSetter: valueSetter,
            cellEditor: 'inputEditor',
        },
        [DataType.NUMERIC]: {
            dataType: DataType.NUMERIC,
            allowedAggFuncs: ['sum', 'avg', 'min', 'max'],
            filter: 'agNumberColumnFilter',
            filterParams: {
                applyButton: true,
                newRowsAction: 'keep',
                suppressAndOrCondition: true,
            },
            valueGetter: valueGetter,
            valueSetter: valueSetter,
            valueFormatter: Formatter.numericFormatter,
            valueParser: (params) => {
                return Number(params.newValue);
            },
            cellEditor: 'agTextCellEditor',
        },
        [DataType.CURRENCY]: {
            dataType: DataType.CURRENCY,
            allowedAggFuncs: ['sum', 'avg', 'min', 'max'],
            filter: 'agNumberColumnFilter',
            filterParams: {
                applyButton: true,
                newRowsAction: 'keep',
                suppressAndOrCondition: true,
            },
            valueGetter: valueGetter,
            valueSetter: valueSetter,
            valueFormatter: Formatter.currencyFormatter,
            valueParser: (params) => {
                return Number(params.newValue);
            },
            cellEditor: 'agTextCellEditor',
        },
        [DataType.DATE]: {
            dataType: DataType.DATE,
            allowedAggFuncs: ['count', 'avg', 'min', 'max'],
            filter: 'agDateColumnFilter',
            filterParams: {
                applyButton: true,
                newRowsAction: 'keep',
                suppressAndOrCondition: true,
            },
            valueGetter: valueGetter,
            valueSetter: valueSetter,
            valueFormatter: Formatter.dateFormatter,
            cellEditor: 'datePickerEditor',
        },
        [DataType.DATE_TIME]: {
            dataType: DataType.DATE_TIME,
            allowedAggFuncs: ['count', 'avg', 'min', 'max'],
            filter: 'agDateColumnFilter',
            filterParams: {
                applyButton: true,
                newRowsAction: 'keep',
                suppressAndOrCondition: true,
            },
            valueGetter: valueGetter,
            valueSetter: valueSetter,
            valueFormatter: Formatter.dateTimeFormatter,
            cellEditor: 'datePickerEditor',
        },
    };

    public static getDefaultColDef(dataType: string = 'DEFAULT'): any {
        return _.merge({}, ColumnDefFactory.MAP_DEFAULT_COLUMN_DEFS[dataType]);
    }

    public static getDefaultColDefCheckBox(dataType: string = 'DEFAULT'): any {
        return _.merge({}, ColumnDefFactory.MAP_DEFAULT_COLUMN_DEFS_CHECKBOX[dataType]);
    }

    private static createColDefFromSchema(entityName: string, propertySchema: any, customColDef: any = {}): any {
        const defaultColDef = _.merge(ColumnDefFactory.getDefaultColDef(customColDef.type || propertySchema.type),
            {
                field: propertySchema.name,
                entityName: entityName,
                editable: false, // propertySchema.editable,
                enableRowGroup: false, // propertySchema.groupable,
                enablePivot: false, // propertySchema.pivotable,
                enableValue: false, // propertySchema.allowAgg,
                suppressMenu: propertySchema.securedField,
                suppressSorting: propertySchema.securedField,
                suppressFilter: propertySchema.securedField,
                cellEditorParams: {
                    required: propertySchema.required,
                    validationExpr: propertySchema.validationExpr,
                },
                sortable: true,
                resizable: false,
                lockPosition: false
            });
        return _.merge(defaultColDef, customColDef || {});
    }

    public static createColumnDefsFromSchema(dataSchema: any, gridColsConfig: any = {}): any[] {
        const {addColDefs = [], editColDefs = {}, delCols = [], groupDefs = [], colsOrder = {}} = gridColsConfig;
        const entityName: string = dataSchema.entityName.toUpperCase();

        // build mapColDefs from schema, ignore cols in deleteColumns
        const mapColDefs = _.reduce(dataSchema.properties, (memo: any, propertySchema: any) => {
            const field = propertySchema.name;
            if (delCols.indexOf(field) >= 0) {
                return memo;
            }

            const colDef = _.find(editColDefs, (colDef, f) =>
                f === field || new RegExp(f).test(field)
            );
            memo[field] = ColumnDefFactory.createColDefFromSchema(entityName, propertySchema, colDef);
            return memo;
        }, {});

        // add colDefs into mapColDefs
        addColDefs.forEach((def) => {
            if (!_.isEmpty(def)) {
                const field = def.field;
                const colDef = _.merge(ColumnDefFactory.getDefaultColDef(def.type), def);
                colDef.entityName = entityName;
                mapColDefs[field] = colDef;
            }
        });

        return _.map(groupDefs, group => {
            const newGroup: any = _.merge({}, group);
            newGroup.entityName = entityName;
            newGroup.children = _.map(newGroup.children, field => {
                const colDef = mapColDefs[field];
                delete mapColDefs[field];
                return colDef;
            });
            return newGroup;
        }).concat(_.values(mapColDefs)).sort(
            (a, b) => ((colsOrder[a.field] || 99999) - (colsOrder[b.field] || 99999)) ||
                ((a.field || '').localeCompare(b.field))
        );
    }
}
