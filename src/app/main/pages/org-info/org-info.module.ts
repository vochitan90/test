import { CreateOrgInfoComponent } from './components/create/create.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { AppState, AuthGuard } from 'app/main/shared';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from 'app/main/shared/components/shared.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { MobxAngularModule } from 'mobx-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FuseSearchBarModule } from '@fuse/components/search-bar/search-bar.module';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { AgGridModule } from 'ag-grid-angular';
import { SharedDirectiveModule } from 'app/main/shared/directives/directive.module';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
import { DateAdapter } from '@angular/material/core';
import { CustomDateAdapterFactory } from 'app/main/shared/utils/CustomDateAdapter';
import { OrgInfoStore } from './org-info.store';
import { OrgInfoService } from './org-info.service';
import { DetailOrgInfoDialogComponent } from './components/detail_dialog/detail-dialog.component';

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
        component: CreateOrgInfoComponent,
        //canActivate: [AuthGuard],
    },
];

@NgModule({
	declarations: [
		ListComponent, CreateOrgInfoComponent, DetailOrgInfoDialogComponent
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
        }, OrgInfoService, OrgInfoStore
    ],exports: []
})
export class OrgInfoModule { }
