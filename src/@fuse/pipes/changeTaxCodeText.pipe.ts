import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'changeTaxCodeText',
})
export class ChangeTaxCodeText implements PipeTransform {
    transform(value: any): string {
        try {
            if(value){
                return value.split(":")[1];
            }
            return '';
        } catch (error) {
            return '';
        }
    }
}
