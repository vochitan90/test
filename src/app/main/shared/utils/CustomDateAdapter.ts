import { NativeDateAdapter } from '@angular/material/core';
import * as moment from 'moment';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AppState } from './AppState';
import { Platform } from '@angular/cdk/platform';
import { MOMENT_DATE_FORMAT } from '../const/app.constant';
import { APP_CONFIG } from 'app/app.config';

const DEFAULT_MONTH_NAMES: any = {
    'en-US': {
        'long': [
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
            'October', 'November', 'December',
        ],
        'short': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        'narrow': ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    },
    'vi': {
        'long': [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9',
            'Tháng 10', 'Tháng 11', 'Tháng 12',
        ],
        'short': ['Th01', 'Th02', 'Th03', 'Th04', 'Th05', 'Th06', 'Th07', 'Th08', 'Th09', 'Th10', 'Th11', 'Th12'],
        'narrow': ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
    },
};
const DEFAULT_DAY_OF_WEEK_NAMES: any = {
    'en-US': {
        'long': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'short': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        'narrow': ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    },
    'vi': {
        'long': ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
        'short': ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
        'narrow': ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    },
};

// extend NativeDateAdapter's format method to specify the date format.
export class CustomDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat: Object): string {
        return moment(date).format(MOMENT_DATE_FORMAT.DATE);
    }

    getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
        return DEFAULT_MONTH_NAMES[this.locale][style];
    }

    getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
        return DEFAULT_DAY_OF_WEEK_NAMES[this.locale][style];
    }
}

let _cacheCustomDateAdapter: CustomDateAdapter = null;

export function CustomDateAdapterFactory(appState: AppState,
    translateService: TranslateService, platform: Platform): CustomDateAdapter {
    if (!_cacheCustomDateAdapter) {
        _cacheCustomDateAdapter = new CustomDateAdapter(APP_CONFIG.LANGUAGE_LOCALE[appState.getLanguage()], new Platform(null));
        translateService.onLangChange.subscribe((value: LangChangeEvent) => {
            _cacheCustomDateAdapter.setLocale(APP_CONFIG.LANGUAGE_LOCALE[value.lang]);
        });
    }
    return _cacheCustomDateAdapter;
}
