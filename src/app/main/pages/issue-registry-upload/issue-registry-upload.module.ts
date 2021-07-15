import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { AppState, AuthGuard } from 'app/main/shared';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from 'app/main/shared/components/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FuseSearchBarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { AgGridModule } from 'ag-grid-angular';
import { MobxAngularModule } from 'mobx-angular';
import { DateAdapter } from '@angular/material/core';
import { CustomDateAdapterFactory } from 'app/main/shared/utils/CustomDateAdapter';
import { IssueRegistryUploadStore } from './issue-registry-upload.store';
import { IssueRegistryUploadService } from './issue-registry-upload.service';
import { IssueRegistryUploadDetailDialogComponent } from './components/upload_dialog/upload-dialog.component';
import { IssueRegistryDetailResultUploadDialogComponent } from './components/detail_dialog/detail-dialog.component';
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
];

@NgModule({
	declarations: [
		ListComponent,
		IssueRegistryUploadDetailDialogComponent,
		IssueRegistryDetailResultUploadDialogComponent,
		IframeViewComponent
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
	], providers: [
		{
			provide: DateAdapter,
			useFactory: CustomDateAdapterFactory,
			deps: [AppState, TranslateService],
		}, IssueRegistryUploadStore, IssueRegistryUploadService
	],
	exports: [IssueRegistryUploadDetailDialogComponent]
})
export class IssueRegistryUploadModule { }
