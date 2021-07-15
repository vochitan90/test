import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DateAdapter } from '@angular/material/core';
import { RouterModule, Routes } from '@angular/router';
import { FuseSearchBarModule } from '@fuse/components';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AgGridModule } from 'ag-grid-angular';
import { SharedDirectiveModule } from 'app/main/shared/directives/directive.module';
import { CustomDateAdapterFactory } from 'app/main/shared/utils/CustomDateAdapter';
import { MobxAngularModule } from 'mobx-angular';
import { AppState, AuthGuard } from '../../shared';
import { SharedModule } from '../../shared/components/shared.module';
import { ListOfUsageService } from './list-of-usage.service';
import { ListOfUsageStore } from './list-of-usage.store';
import { ReportListOfUsageComponent } from './report-list/list-of-usage.component';
import { RevonueComponent } from './revonue/revonue.component';
const routes: Routes = [
    {
        path: '',
        component: ReportListOfUsageComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'revenue',
        component: RevonueComponent,
        canActivate: [AuthGuard],
    },

];

@NgModule({
    declarations: [
        ReportListOfUsageComponent,
        RevonueComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule.forChild(),
        SharedModule,
        FuseSharedModule,
        MobxAngularModule,
        FlexLayoutModule,
        FuseSearchBarModule,
        FileUploadModule,
        AgGridModule.withComponents([]),
        SharedDirectiveModule,
        FusePipesModule
    ],
    providers: [
        {
            provide: DateAdapter,
            useFactory: CustomDateAdapterFactory,
            deps: [AppState, TranslateService],
        },
        ListOfUsageService,
        ListOfUsageStore
    ],
    exports: []
})
export class ListOfUsageModule { }
