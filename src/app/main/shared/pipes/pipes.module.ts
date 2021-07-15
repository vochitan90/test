import { NgModule } from '@angular/core';
import { KeepHtmlPipe } from './keepHtmlPipe.pipe';
import { AsBlobPipe } from './asBlob.pipe';

@NgModule({
    declarations: [
        KeepHtmlPipe,
        AsBlobPipe,
    ],
    imports: [],
    exports: [
        KeepHtmlPipe,
        AsBlobPipe
    ]
})
export class PipesModule {


}
