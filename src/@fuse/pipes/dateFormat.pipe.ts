import { Pipe, PipeTransform } from '@angular/core';
import { MOMENT_DATE_FORMAT } from 'app/main/shared/const/app.constant';
import * as moment from "moment";

@Pipe({
  name: 'dateFormat',
})
export class DateFormat implements PipeTransform {
  public static findFormat(format: string): string {
    if (format) {
      let lowerCaseFormat: string = format.toLowerCase();
      for (let key in MOMENT_DATE_FORMAT) {
        if (lowerCaseFormat === key.toLowerCase()) {
          return MOMENT_DATE_FORMAT[key];
        }
      }
      return format;
    }
    return MOMENT_DATE_FORMAT.DATE_TIME;
  }

  transform(value: any, format: string, locale: string = undefined): string {
    try {
      format = DateFormat.findFormat(format);
      if (value && typeof value === 'number') {
        let d: Date = new Date(value);
        let m: moment.Moment = moment(d);
        if (locale) {
          return m.locale(locale).format(format);
        }
        return m.format(format);
      }
      return '';
    } catch (error) {
      return '';
    }
  }
}
