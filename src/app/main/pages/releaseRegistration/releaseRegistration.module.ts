import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import { FuseSearchBarModule } from '@fuse/components';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { TranslateModule } from '@ngx-translate/core';
import { AgGridModule } from 'ag-grid-angular';
import { AuthGuard } from 'app/main/shared';
import { SharedModule } from 'app/main/shared/components/shared.module';
import { SharedDirectiveModule } from 'app/main/shared/directives/directive.module';
import { MobxAngularModule } from 'mobx-angular';
import { CreateReleaseRegistrationComponent } from './create/create.component';
import { DetailReleaseRegistrationDialogComponent } from './detail-dialog/detail-dialog.component';
import { IframeViewComponent } from './iframe-view/iframe-view.component';
import { ListReleaseRegistrationComponent } from './list/list.component';
import { ReleaseRegistrationService } from './releaseRegistration.service';
import { ReleaseRegistrationStore } from './releaseRegistration.store';
import { CancelUploadDialogComponent } from './upload_dialog/upload-dialog.component';
import { ListUsbTokenComponent } from './list-usb-token/list-usb-token.component';
import { PdfSignedInfoComponent } from './pdf-signed-info/pdf-signed-info.component';
import { LoginTokenPinComponent } from './login-token-pin/login-token-pin.component';

const routes: Routes = [
    {
        path: '',
        component: ListReleaseRegistrationComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'list',
        component: ListReleaseRegistrationComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'create',
        component: CreateReleaseRegistrationComponent,
        canActivate: [AuthGuard],
    },
];

@NgModule({
    declarations: [
        ListReleaseRegistrationComponent,
        CreateReleaseRegistrationComponent,
        DetailReleaseRegistrationDialogComponent,
        CancelUploadDialogComponent,
        IframeViewComponent,
        ListUsbTokenComponent,
        PdfSignedInfoComponent,
        LoginTokenPinComponent
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
        ReleaseRegistrationService,
        ReleaseRegistrationStore
    ],
    exports: []
})
export class ReleaseRegistrationModule { }
