import { FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Moment } from 'moment';
import { checkIsNotNull } from './GridService';

const DATE_FORMAT_IN_JSON = 'YYYY-MM-DD';
const REGEXR_DIGIT = /^\d+$/;

const createUtilFns = (ctxName: string, ctxData: any) => ({
    ctxData,
    ctxName,
    isCtxEmpty: () => _.isEmpty(ctxData),
    getV: (path: string, defaultValue = '') =>
        _.defaultTo(_.property(path)(ctxData), defaultValue),
    setV: (path: string, value, clone = true) => _.set(clone ? _.cloneDeep(ctxData) : ctxData, path, value),
    normalizeDate: (fields: string[], clone = true) => {
        const data = clone ? _.cloneDeep(ctxData) : ctxData;

        _.forEach(fields, f => {
            const v: undefined | null | number | string = _.get(data, f);
            if (_.isNil(v)) {
                return;
            }

            if (_.isString(v)) {
                let m: Moment;
                if (REGEXR_DIGIT.test(v)) {
                    m = moment(_.toNumber(v));
                } else {
                    m = moment(v, DATE_FORMAT_IN_JSON);
                }

                if (m.isValid()) {
                    _.set(data, f, m.format(DATE_FORMAT_IN_JSON));
                }

                return;
            }

            if (_.isNumber(v)) {
                _.set(data, f, moment(v).format(DATE_FORMAT_IN_JSON));
                return;
            }
        });

        return data;
    },
});

const defaultCtxName = 'ctx';
export const createFunction = (fnBody: string,
    ctxName: string = defaultCtxName,
    ...paramNames: string[]): Function => {
    const f = new Function('_', ctxName, ...paramNames, fnBody);
    return (ctxData: any, ...params: any[]) => {
        ctxData = ctxData || {};
        const lodash = Object.assign(Object.create(_), createUtilFns(ctxName, ctxData));
        return f(lodash, ctxData, ...params);
    };
};

export const makeTemplateFn = (defaultFn: Function, template?: string): Function =>
    !template ? defaultFn : createFunction(template);

export const mergeFormWithData = (data: any, formGroupAccountDetail: FormGroup): void => {
    if (checkIsNotNull(data) && checkIsNotNull(formGroupAccountDetail)) {
        for (const field in formGroupAccountDetail.controls) {
            const control = formGroupAccountDetail.get(field);
            if (checkIsNotNull(control) && data[field] != null) {
                control.setValue(data[field]);
            }
        }
    }
};