import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import IMask from 'imask';
import * as moment from 'moment';
import {TranslateService} from '@ngx-translate/core';
import { DATE_FORMAT_IN_JSON, DATE_TIME_FORMAT_IN_JSON, TIME_FORMAT_IN_JSON } from '../const/app.constant';

const BLOCKS = {
    'DATE_TIME': {
        YYYY: {
            mask: IMask.MaskedRange,
            from: 0,
            to: 9999
        },
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12
        },
        DD: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 31
        },
        HH: {
            mask: IMask.MaskedRange,
            from: 0,
            to: 23
        },
        mm: {
            mask: IMask.MaskedRange,
            from: 0,
            to: 59
        },
        ss: {
            mask: IMask.MaskedRange,
            from: 0,
            to: 59
        }
    }
};

const MAP_DEFAULT_MASK = {
    'idno': {
        mask: [{
            mask: '000.000.000',
        }, {
            mask: '0000.0000.0000',
        }],
    },
    'taxcode': {
        mask: [{
            mask: '0000000000',
        }, {
            mask: '0000000000-000',
        }],
    },
    'email': {
        mask: /^\S*@?\S*$/
    },
    'cell-phone': {
        mask: '000.000.00000',
        lazy: false,
    },
    'home-phone': {
        mask: '000.000.00000',
        lazy: false,
    },
    'number': {
        mask: Number,
        thousandsSeparator: ',',
        radix: '.',
    },
    'number@vi': {
        mask: Number,
        thousandsSeparator: '.',
        radix: ',',
    },
    'date': {
        mask: DATE_FORMAT_IN_JSON,
        lazy: false,
        blocks: BLOCKS.DATE_TIME,
    },
    'date-time': {
        mask: DATE_TIME_FORMAT_IN_JSON,
        lazy: false,
        blocks: BLOCKS.DATE_TIME,
    },
    'time': {
        mask: TIME_FORMAT_IN_JSON,
        lazy: false,
        blocks: BLOCKS.DATE_TIME,
    },
};

@Injectable({
    providedIn: 'root'
})
export class IMaskService {
    constructor(private _translateService: TranslateService) {
    }

    getDefaultIMask(type: string): any {
        if (_.isEmpty(type)) {
            return null;
        }
        const defaultMask = MAP_DEFAULT_MASK[type + '@' + this._translateService.currentLang]
            || MAP_DEFAULT_MASK[type];
        if (type === 'date') {
            defaultMask.mask = moment().localeData().longDateFormat('L');
        }
        return defaultMask;
    }

    createIMask(config): any {
        const defaultIMask = this.getDefaultIMask(config.type);
        const configIgnoreType = _.omit(config, ['type']);
        if (defaultIMask) {
            return _.extend({}, defaultIMask, configIgnoreType);
        }
        if (config.type === 'regexp') {
            configIgnoreType.mask = new RegExp(configIgnoreType.mask);
        } else if (config.type === 'range') {
            configIgnoreType.mask = IMask.MaskedRange;
        } else if (config.type === 'enum') {
            configIgnoreType.mask = IMask.MaskedEnum;
        } else if (config.type === 'dynamic' || _.isArray(configIgnoreType.mask)) {
            configIgnoreType.mask = _.map(
                configIgnoreType.mask, (configIMask) => this.createIMask(configIMask)
            );
        }
        return configIgnoreType;
    }
}
