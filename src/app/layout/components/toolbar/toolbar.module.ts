import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseSearchBarModule, FuseShortcutsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ToolbarComponent } from './toolbar.component';
import { SharedModule } from '../../../main/shared/components/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatBadgeModule} from '@angular/material/badge';
@NgModule({
    declarations: [
        ToolbarComponent
    ],
    imports: [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        SharedModule,
        FuseSharedModule,
        FuseSearchBarModule,
        FuseShortcutsModule,
        MatBadgeModule,
        TranslateModule.forChild(),
    ],
    providers: [],
    exports: [
        ToolbarComponent
    ]
})
export class ToolbarModule {
}
