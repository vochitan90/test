import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'authStatusFormat',
})
export class AuthStatusFormat implements PipeTransform {
    transform(value: any): string {
        try {
            if (value == 'M') {
                return 'Tạo mới';
            }
            if (value == 'P') {
                return 'Chờ duyệt';
            }
            if (value == 'A') {
                return 'Đã duyệt';
            }
            if (value == 'R') {
                return 'Từ chối';
            }
            return '';
        } catch (error) {
            return '';
        }
    }
}
