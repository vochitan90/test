import * as moment from 'moment';
import {Moment} from 'moment';
import { MOMENT_DATE_FORMAT } from '../const/app.constant';
import DataType from './DataType';

export default class Formatter {
    public static formatDate(value: number | string | Date | Moment, format: string = MOMENT_DATE_FORMAT.DATE): string {
        if (value !== null && value !== undefined) {
            return moment(value).format(format || MOMENT_DATE_FORMAT.DATE);
        }
    }

    public static formatNumber(value: number): string {
        if (value !== null && value !== undefined) {
            return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        }
        return '';
    }

    public static formatCurrency(value: number): string {
        return Formatter.formatNumber(value);
    }

    public static dateFormatter(params: any): string {
        const formattedValue: string = Formatter.formatDate(params.value);
        // console.log('dateFormatter: value=' + params.value + ', formatted=' + formattedValue);
        return formattedValue;
    }

    public static dateTimeFormatter(params: any): string {
        const formattedValue: string = Formatter.formatDate(params.value, MOMENT_DATE_FORMAT.DATE_TIME);
        // console.log('dateFormatter: value=' + params.value + ', formatted=' + formattedValue);
        return formattedValue;
    }

    public static numericFormatter(params: any): string {
        const formattedValue: string = Formatter.formatNumber(params.value);
        // console.log('numericFormatter: value=' + params.value + ', formatted=' + formattedValue);
        return formattedValue;
    }

    public static currencyFormatter(params: any): string {
        const formattedValue: string = Formatter.formatCurrency(params.value);
        // console.log('currencyFormatter: value=' + params.value + ', formatted=' + formattedValue);
        return formattedValue;
    }

    public static formatValue(dataType: string, value, ...args): string {
        switch (dataType) {
            case DataType.DATE:
                return Formatter.formatDate(value, args[0]);
            case DataType.NUMERIC:
                return Formatter.formatNumber(value);
            case DataType.CURRENCY:
                return Formatter.formatCurrency(value);
            default:
                return value ? value.toString() : '';
        }
    }

    public static isFirstColumn(params: any):boolean {
        let displayedColumns = params.columnApi.getAllDisplayedColumns();
        let thisIsFirstColumn = displayedColumns[0] === params.column;
        return thisIsFirstColumn;
    }
}
