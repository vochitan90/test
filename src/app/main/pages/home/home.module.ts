import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { SharedModule } from '../../shared/components/shared.module';
import { HomeComponent } from './home.component';

import { AuthGuard } from '../../shared';
import { LayoutModule } from '@angular/cdk/layout';
// import { ContactService } from '../contact/contact.service';
import { FuseWidgetModule } from '../../../../@fuse/components/widget/widget.module';

const routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [
        HomeComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule.forChild(),
        SharedModule,
        FuseSharedModule,
        LayoutModule,
        FuseWidgetModule
    ],
    exports: [
        HomeComponent,
    ],
    // providers: [ContactService]
})

export class HomeModule {
}
