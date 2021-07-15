import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import 'hammerjs';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import 'ag-grid-enterprise';
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule } from '@fuse/components';
import { fuseConfig } from './fuse-config';
import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './main/shared/components/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorService } from './main/shared/http/interceptors/http-interceptor-service';
import { AppRoutingModule } from './app-routing.module';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { AgGridModule } from 'ag-grid-angular';
import { TDSetFilterComponent } from './main/shared/components/component/ag-grid-select-filter/td-set-filter.component';
import { LayoutGapStyleBuilder } from '@angular/flex-layout';
import { CustomLayoutGapStyleBuilder } from './main/shared/utils/CustomLayoutGapStyleBuilder';
const appRoutes: Routes = [
    {
        path: '**',
        redirectTo: 'home'
    }
];

export function HttpLoaderFactory(http: HttpClient): any {
    return new TranslateHttpLoader(http, './assets/i18n/app/default/', '.json');
}

export function providers(): any {
    return [
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpInterceptorService,
            multi: true
        },
        { provide: LayoutGapStyleBuilder, useClass: CustomLayoutGapStyleBuilder },
    ];
}

@NgModule({
    declarations: [
        AppComponent, TDSetFilterComponent
    ],
    imports: [
        AgGridModule.withComponents([TDSetFilterComponent]),
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        AppRoutingModule,
        MatMomentDateModule,
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        SharedModule,
        MatProgressButtonsModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        LayoutModule,
    ],
    providers: providers(),
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
