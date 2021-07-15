import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { SharedModule } from '../../shared/components/shared.module';
import { AuthGuard } from '../../shared';

import { DashboadComponent } from './dashboard.component';

const routes = [
    {
        path: '',
        component: DashboadComponent,
        canActivate: [AuthGuard]
    },
    // {
    //     path: '',
    //     redirectTo: 'main-board',
    //     pathMatch: 'full'
    // },
    // {
    //     path: 'main-board',
    //     component: BoardComponent
    // },
    // {
    //     path: 'detail',
    //     component: DetailComponent,
    //     // runGuardsAndResolvers: 'always'
    // },
];

@NgModule({
    declarations: [
        DashboadComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule.forChild(),
        SharedModule,
        FuseSharedModule
    ],
    exports: [
        DashboadComponent
    ]
})

export class DashboardModule {
}
