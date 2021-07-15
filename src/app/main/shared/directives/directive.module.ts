import { NgModule } from '@angular/core';
import { DateInputDirective } from './date-input.directive';
import { InumberDirective } from './inumber.directive';
import { NullDefaultValueDirective } from './nullInputValue.directive';
@NgModule({
    declarations: [InumberDirective, DateInputDirective, NullDefaultValueDirective],
    imports: [],
    exports: [InumberDirective, DateInputDirective, NullDefaultValueDirective],
})
export class SharedDirectiveModule { }
