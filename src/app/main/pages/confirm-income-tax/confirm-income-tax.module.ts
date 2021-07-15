import { DetailConfirmIncomeTaxDialogComponent } from './components/detail_dialog/detail-dialog.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateConfirmIncomeTaxComponent } from './components/create/create.component';
import { ListComponent } from './list/list.component';
import { RouterModule, Routes } from '@angular/router';
import { AppState, AuthGuard } from 'app/main/shared';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FuseSearchBarModule } from '@fuse/components';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from 'app/main/shared/components/shared.module';
import { SharedDirectiveModule } from 'app/main/shared/directives/directive.module';
import { MobxAngularModule } from 'mobx-angular';
import { DateAdapter } from '@angular/material/core';
import { CustomDateAdapterFactory } from 'app/main/shared/utils/CustomDateAdapter';
import { ConfirmIncomeTaxService } from './confirm-income-tax.service';
import { ConfirmIncomeTaxStore } from './confirm-income-tax.store';
import { IframeViewComponent } from './components/iframe-view/iframe-view.component';

const routes: Routes = [
    {
        path: '',
        component: ListComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'list',
        component: ListComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'create',
        component: CreateConfirmIncomeTaxComponent,
        canActivate: [AuthGuard],
    },
]

@NgModule({
    declarations: [
        CreateConfirmIncomeTaxComponent,
        ListComponent,
        DetailConfirmIncomeTaxDialogComponent,
        IframeViewComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule.forChild(),
        CommonModule,
        SharedModule,
        FuseSharedModule,
        MobxAngularModule,
        FlexLayoutModule,
        FuseSearchBarModule,
        FileUploadModule,
        AgGridModule.withComponents([]),
        SharedDirectiveModule,
        FusePipesModule
    ],providers: [
        {
            provide: DateAdapter,
            useFactory: CustomDateAdapterFactory,
            deps: [AppState, TranslateService],
        }, ConfirmIncomeTaxService , ConfirmIncomeTaxStore
    ],
})
export class ConfirmIncomeTaxModule { }
