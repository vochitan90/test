import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';

import { LoginComponent } from './login.component';
import { SharedModule } from '../../shared/components/shared.module';
import { FuseProgressBarModule, FuseConfirmDialogModule } from '@fuse/components';

import { MatProgressButtonsModule } from 'mat-progress-buttons';

const routes = [
  {
    path: '',
    component: LoginComponent
  }
];

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    MatProgressButtonsModule,
    TranslateModule.forChild(),
    FuseSharedModule,
    SharedModule,
    FuseProgressBarModule,
    FuseConfirmDialogModule
  ],
  providers: [
  ]
})
export class LoginModule {
}
