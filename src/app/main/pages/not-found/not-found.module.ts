import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatProgressBarModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../shared/components/shared.module';
import { FuseProgressBarModule, FuseConfirmDialogModule } from '@fuse/components';
import { NotFoundComponent } from './not-found.component';
const routes = [
  {
    path: '',
    component: NotFoundComponent
  }
];

@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    FuseSharedModule,
    SharedModule,
    FuseProgressBarModule,
    FuseConfirmDialogModule
  ]
})
export class NotFoundModule {
}
