import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './main/shared';
const appRoutes: Routes = [
    {
        path: 'login',
        loadChildren: () => import('./main/pages/login/login.module').then(m => m.LoginModule),
    }, {
        path: 'home',
        loadChildren: () => import('./main/pages/home/home.module').then(m => m.HomeModule),
        canLoad: [AuthGuard]
    }
    // , {
    //     path: 'dashboard',
    //     loadChildren: () => import('./main/pages/dashboard/dashboard.module').then(m => m.DashboardModule),
    //     canLoad: [AuthGuard]
    // }
    , {
        path: 'notification',
        loadChildren: () => import('./main/pages/notification/notification.module').then(m => m.NotificationModule),
        canLoad: [AuthGuard]
    }
    , {
        path: 'issue-registry',
        loadChildren: () => import('./main/pages/releaseRegistration/releaseRegistration.module').then(m => m.ReleaseRegistrationModule),
        canLoad: [AuthGuard]
    }, {
        path: 'confirm-income-tax',
        loadChildren: () => import('./main/pages/confirm-income-tax/confirm-income-tax.module').then(m => m.ConfirmIncomeTaxModule),
        canLoad: [AuthGuard]
    }, {
        path: 'org-info',
        loadChildren: () => import('./main/pages/org-info/org-info.module').then(m => m.OrgInfoModule),
        canLoad: [AuthGuard]
    },
    {
        path: 'tax-income',
        loadChildren: () => import('./main/pages/tax-income/taxIncome.module').then(m => m.TaxIncomeModule),
        canLoad: [AuthGuard]
    },
    {
        path: 'report-list-of-usage',
        loadChildren: () => import('./main/pages/list-of-usage/list-of-usage.module').then(m => m.ListOfUsageModule),
    },
    {
        path: 'tax-letter-upload',
        loadChildren: () => import('./main/pages/tax-letter-upload/tax-letter-upload.module').then(m => m.TaxLetterUploadModule),
        canLoad: [AuthGuard]
    },
    {
        path: 'issue-registry-upload',
        loadChildren: () => import('./main/pages/issue-registry-upload/issue-registry-upload.module').then(m => m.IssueRegistryUploadModule),
        canLoad: [AuthGuard]
    },
    {
        path: 'invoice-letter',
        loadChildren: () => import('./main/pages/invoice-letter/invoice-letter.module').then(m => m.InvoiceLetterModule),
        canLoad: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: 'org-info',
        // redirectTo: 'home',

    }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {
        scrollPositionRestoration: 'enabled'
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
