import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import {
//     MatButtonModule, MatCheckboxModule, MatDialogModule,
//     MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatSelectModule, MatToolbarModule
// } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { SharedModule } from '../../shared/components/shared.module';
import { NotificationService } from './notification.service';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationListItemComponent } from './notification-list/notification-list-item/notification-list-item.component';
import { NotificationDetailsComponent } from './notification-details/notification-details.component';
import { NotificationComponent } from './notification.component';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
import { InfiniteScrollModule, InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { AuthGuard } from 'app/main/shared/auth/AuthGuard';
// import {  } from 'ngx-infinite-scroll';

// import { MailService } from 'app/main/apps/mail/mail.service';
// import { MailComponent } from 'app/main/apps/mail/mail.component';
// import { MailListComponent } from 'app/main/apps/mail/mail-list/mail-list.component';
// import { MailListItemComponent } from 'app/main/apps/mail/mail-list/mail-list-item/mail-list-item.component';
// import { MailDetailsComponent } from 'app/main/apps/mail/mail-details/mail-details.component';
// import { MailMainSidebarComponent } from 'app/main/apps/mail/sidebars/main/main-sidebar.component';
// import { MailComposeDialogComponent } from 'app/main/apps/mail/dialogs/compose/compose.component';


const routes: Routes = [
    {
        path: 'label/:labelHandle',
        component: NotificationComponent,
        canActivate: [AuthGuard],
        // resolve: {
        //     mail: NotificationService
        // }
    },
    {
        path: 'label/:labelHandle/:mailId',
        component: NotificationComponent,
        canActivate: [AuthGuard],
        // resolve: {
        //     mail: NotificationService
        // }
    },
    {
        path: 'filter/:filterHandle',
        component: NotificationComponent,
        canActivate: [AuthGuard],
        // resolve: {
        //     mail: NotificationService
        // }
    },
    {
        path: 'filter/:filterHandle/:mailId',
        component: NotificationComponent,
        canActivate: [AuthGuard],
        // resolve: {
        //     mail: NotificationService
        // }
    },
    {
        path: ':folderHandle',
        component: NotificationComponent,
        canActivate: [AuthGuard],
        // resolve: {
        //     mail: NotificationService
        // }
    },
    {
        path: ':folderHandle/:mailId',
        component: NotificationComponent,
        canActivate: [AuthGuard],
        // resolve: {
        //     mail: NotificationService
        // }
    },
    {
        path: '**',
        redirectTo: 'notification'
    }
];

@NgModule({
    declarations: [
        NotificationListComponent,
        NotificationListItemComponent,
        NotificationDetailsComponent,
        NotificationComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        FusePipesModule,
        // MatButtonModule,
        // MatCheckboxModule,
        // MatDialogModule,
        // MatFormFieldModule,
        // MatIconModule,
        // MatInputModule,
        // MatMenuModule,
        // MatRippleModule,
        // MatSelectModule,
        // MatToolbarModule,
        InfiniteScrollModule,
        // InfiniteScrollDirective,
        SharedModule,
        TranslateModule,
        FuseSharedModule,
        FuseSidebarModule
    ],
    providers: [
        NotificationService
    ],
    entryComponents: [
        // MailComposeDialogComponent
    ]
})
export class NotificationModule {
}
