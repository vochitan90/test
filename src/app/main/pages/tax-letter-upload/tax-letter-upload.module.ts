import { NgModule } from '@angular/core';
import { CreateComponent } from './components/create/create.component';
import { RouterModule, Routes } from '@angular/router';
import { AppState, AuthGuard } from 'app/main/shared';
import { ListComponent } from './list/list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FuseSearchBarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AgGridModule } from 'ag-grid-angular';
import { SharedModule } from 'app/main/shared/components/shared.module';
import { MobxAngularModule } from 'mobx-angular';
import { TaxLetterUploadService } from './tax-letter-upload.service';
import { TaxLetterUploadStore } from './tax-letter-upload.store';
import { DateAdapter } from '@angular/material/core';
import { CustomDateAdapterFactory } from 'app/main/shared/utils/CustomDateAdapter';
import { TaxLetterUploadDetailDialogComponent } from './components/upload_dialog/upload-dialog.component';
import { ReleaseRegistrationService } from '../releaseRegistration/releaseRegistration.service';
import { TaxLetterDetailResultUploadDialogComponent } from './components/detail_dialog/detail-dialog.component';

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
		ListComponent,	
		CreateComponent,
		TaxLetterUploadDetailDialogComponent,
		TaxLetterDetailResultUploadDialogComponent,
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
	],
	providers: [
        {
            provide: DateAdapter,
            useFactory: CustomDateAdapterFactory,
            deps: [AppState, TranslateService],
        }, TaxLetterUploadStore, TaxLetterUploadService, ReleaseRegistrationService
    ],
    exports: [TaxLetterUploadDetailDialogComponent]
})
export class TaxLetterUploadModule { }
