import { NgModule } from '@angular/core';

import { KeysPipe } from './keys.pipe';
import { GetByIdPipe } from './getById.pipe';
import { HtmlToPlaintextPipe } from './htmlToPlaintext.pipe';
import { FilterPipe } from './filter.pipe';
import { CamelCaseToDashPipe } from './camelCaseToDash.pipe';
import { DateFormat } from './dateFormat.pipe';
import { AuthStatusFormat } from './authStatus.pipe';
import { RecordStatusFormat } from './recordStatus.pipe';
import { ChangeTaxCodeText } from './changeTaxCodeText.pipe';
@NgModule({
    declarations: [
        KeysPipe,
        GetByIdPipe,
        HtmlToPlaintextPipe,
        FilterPipe,
        CamelCaseToDashPipe,
        DateFormat,
        AuthStatusFormat,
        RecordStatusFormat,
        ChangeTaxCodeText
    ],
    imports: [],
    exports: [
        KeysPipe,
        GetByIdPipe,
        HtmlToPlaintextPipe,
        FilterPipe,
        CamelCaseToDashPipe,
        DateFormat,
        AuthStatusFormat,
        RecordStatusFormat,
        ChangeTaxCodeText
    ]
})
export class FusePipesModule {
}
