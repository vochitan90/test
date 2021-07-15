import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from 'app/main/shared/components/shared.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { MobxAngularModule } from 'mobx-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FuseSearchBarModule } from '@fuse/components';
import { AgGridModule } from 'ag-grid-angular';
import { AuthGuard } from 'app/main/shared/auth/AuthGuard';
import { DateAdapter } from '@angular/material/core';
import { CustomDateAdapterFactory } from 'app/main/shared/utils/CustomDateAdapter';
import { AppState } from 'app/main/shared';
import { ReleaseRegistrationService } from './invoice-letter.service';
import { ListComponent } from './list/list.component';
import { ReleaseRegistrationStore } from './invoice-letter.store';

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
		// path: 'create',
		// component: PeriodUploadCreateComponent,
		// canActivate: [AuthGuard],
	},
];

@NgModule({
	declarations: [
		ListComponent
	],
	imports: [
		RouterModule.forChild(routes),
		TranslateModule.forChild(),
		SharedModule,
		FuseSharedModule,
		MobxAngularModule,
		FlexLayoutModule,
		FuseSearchBarModule,
		AgGridModule.withComponents([]),
	],
	providers: [
		{
			provide: DateAdapter,
			useFactory: CustomDateAdapterFactory,
			deps: [AppState, TranslateService],
		}, ReleaseRegistrationService, ReleaseRegistrationStore
	],
})
export class InvoiceLetterModule { }
