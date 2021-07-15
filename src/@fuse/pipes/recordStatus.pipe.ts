import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'recordStatusFormat',
})
export class RecordStatusFormat implements PipeTransform {
    transform(value: any): string {
        try {
            if (value == 'O') {
                return 'Mở';
            }
            if (value == 'C') {
                return 'Đóng';
            }
            return '';
        } catch (error) {
            return '';
        }
    }
}
