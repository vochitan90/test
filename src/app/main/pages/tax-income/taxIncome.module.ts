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
import { AppState, AuthGuard } from 'app/main/shared';
import { SharedModule } from 'app/main/shared/components/shared.module';
import { SharedDirectiveModule } from 'app/main/shared/directives/directive.module';
import { CustomDateAdapterFactory } from 'app/main/shared/utils/CustomDateAdapter';
import { MobxAngularModule } from 'mobx-angular';
import { CreateTaxIncomeComponent } from './create/create.component';
import { DeleteTaxIncomeComponent } from './delete/delete.component';
import { DetailTaxIncomeComponent } from './detail/detail.component';
import { ListTaxIncomeCancelComponent } from './list-cancel/list-cancel.component';
import { ListTaxIncomeIssueComponent } from './list-issue/list-issue.component';
import { ListTaxIncomeNewComponent } from './list/list.component';
import { PreviewFilePrintComponent } from './preview-file-print/preview-file-print.component';
import { ReplaceTaxIncomeComponent } from './replace/replace.component';
import { TaxIncomeViewComponent } from './tax-income-view/tax-income-view.component';
import { TaxIncomeService } from './taxIncome.service';
import { TaxIncomeStore } from './taxIncome.store';
import { UpdateTaxIncomeComponent } from './update/update.component';
import { PeriodUploadDetailDialogComponent } from './upload/components/upload_dialog/upload-dialog.component';
import { PeriodDetailResultUploadDialogComponent } from './upload/detail_dialog/detail-dialog.component';
import { ListTaxIncomeUploadComponent } from './upload/list/list.component';
import { UploadPeriodService } from './upload/period-upload.service';
import { PeriodUploadStore } from './upload/period-upload.store';

const routes: Routes = [
    {
        path: '',
        component: ListTaxIncomeNewComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'issue',
        component: ListTaxIncomeIssueComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'cancel',
        component: ListTaxIncomeCancelComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'new',
        component: ListTaxIncomeNewComponent,
        canActivate: [AuthGuard],
    },

    {
        path: 'create',
        component: CreateTaxIncomeComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'upload',
        component: ListTaxIncomeUploadComponent,
        canActivate: [AuthGuard],
    },
];

@NgModule({
    declarations: [
        ListTaxIncomeNewComponent,
        ListTaxIncomeIssueComponent,
        ListTaxIncomeCancelComponent,
        ListTaxIncomeUploadComponent,
        TaxIncomeViewComponent,
        UpdateTaxIncomeComponent,
        CreateTaxIncomeComponent,
        DetailTaxIncomeComponent,
        DeleteTaxIncomeComponent,
        ReplaceTaxIncomeComponent,
        PreviewFilePrintComponent,
        PeriodUploadDetailDialogComponent,
        PeriodDetailResultUploadDialogComponent,
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
        TaxIncomeService,
        TaxIncomeStore,
        UploadPeriodService,
        PeriodUploadStore
    ],
    exports: []
})
export class TaxIncomeModule { }
