import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { ContentComponent } from './content.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        ContentComponent
    ],
    imports: [
        RouterModule,
        FuseSharedModule,
        TranslateModule.forChild()
    ],
    exports: [
        ContentComponent
    ]
})
export class ContentModule {
}
