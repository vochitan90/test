import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from './i18n/en';
import { locale as vi } from './i18n/vi';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { HttpHelper } from '../../shared';
// import { TranslateService } from '@ngx-translate/core';
// import {
//     animate,
//     keyframes,
//     query,
//     stagger,
//     state,
//     style,
//     transition,
//     trigger
// } from '@angular/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { UtilCommon } from '../../shared/utils/UtilCommon';
import { AppState } from '../../shared/utils/AppState';

// export const speedDialFabAnimations = [
//     trigger('fabToggler', [
//         state('inactive', style({
//             transform: 'rotate(0deg)'
//         })),
//         state('active', style({
//             transform: 'rotate(225deg)'
//         })),
//         transition('* <=> *', animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
//     ]),
//     trigger('speedDialStagger', [
//         transition('* => *', [

//             query(':enter', style({ opacity: 0 }), { optional: true }),

//             query(':enter', stagger('40ms',
//                 [
//                     animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
//                         keyframes(
//                             [
//                                 style({ opacity: 0, transform: 'translateY(10px)' }),
//                                 style({ opacity: 1, transform: 'translateY(0)' }),
//                             ]
//                         )
//                     )
//                 ]
//             ), { optional: true }),

//             query(':leave',
//                 animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
//                     keyframes([
//                         style({ opacity: 1 }),
//                         style({ opacity: 0 }),
//                     ])
//                 ), { optional: true }
//             )

//         ])
//     ])
// ];

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    // animations: speedDialFabAnimations
})
export class DashboadComponent implements OnInit, AfterViewInit {

    fabButtons = [
        {
            icon: 'timeline',
            tooltip: 'Create Dashboard'
        },
        {
            icon: 'view_headline',
            tooltip: 'Create gadgets'
        },
        {
            icon: 'room',
            tooltip: 'Change layout'
        },
        {
            icon: 'lightbulb_outline',
            tooltip: 'Change layout'
        },
        {
            icon: 'lock',
            tooltip: 'Change layout'
        }
    ];
    buttons = [];
    fabTogglerState = 'inactive';
    _previewUrl: any = '';
    showIframe: boolean;
    isLoadIframeComplete: boolean;
    constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _utils: UtilCommon,
        private sanitizer: DomSanitizer, private _fuseConfigService: FuseConfigService,
        private _appState: AppState) {
        setTimeout(() => {
            this._fuseTranslationLoaderService.loadTranslations(english, vi);
        }, 0);
        // let me = this;
        // this._previewUrl = 'https://gateway-dev.lcssoft.com.vn/crm/dashboard/index.html';
        // this._previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.listUnitStores.printThongTinPhatHanh(lstIdSelected,
        //     this.utils.formatDate(new Date(kq.date).getTime()), kq.companyTax, kq.accountLegal));
        // this._previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://gateway-dev.lcssoft.com.vn/crm/dashboard/#/main-board?token=' + localStorage.getItem('tokenJWT'));
        // this.loadIframe = false;
        // this.isLoadIframeComplete = false;
        window.addEventListener('message', (evt: any) => {
            const key: string = evt.message ? 'message' : 'data';
            let dataTemp: any = evt[key];
            if (!dataTemp || !this._utils.checkIsString(dataTemp)) {
                return;
            }
            dataTemp = JSON.parse(dataTemp);

            if (dataTemp.action === 'openIframeComplete') {
                // this.isLoadIframeComplete = dataTemp.isLoadComplete;
                // setTimeout(() => {
                    // this.loadIframe = true;
                    // me.isLoadIframeComplete = true;
                    // me.loadIframe = true;
                // }, 300);
                //   this.loadIframeContinue = true;

            } else if (dataTemp.action === 'gadget-detail') {
                if (dataTemp.evt === 'CA_H1'
                    || dataTemp.evt === 'CA_H2'
                    || dataTemp.evt === 'CA_H3'
                    || dataTemp.evt === 'CA_H4') {
                    if (dataTemp.evt === 'CA_H4') {
                        this._utils.routingPageChild('ca-ticket/document');
                    } else {
                        this._utils.routingPageChild('ca-ticket');
                    }
                    this._appState.setDashboardEvent(dataTemp.evt);
                    this._appState.setDashboardEventParams(dataTemp.params);
                }
            }
        });
    }

    ngOnInit(): void {
        // let me = this;
        // this._previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://gateway-dev.lcssoft.com.vn/crm/dashboard/index.html');
        // this.showIframe = false;
        // this.isLoadIframeComplete = false;
        // setTimeout(() => {
        //     this.isLoadIframeComplete = true;
        // }, 3000);
        // window.addEventListener('message', (evt: any) => {
        //     const key: string = evt.message ? 'message' : 'data';
        //     let dataTemp: any = evt[key];
        //     if (!dataTemp || !this._utils.checkIsString(dataTemp)) {
        //         return;
        //     }
        //     dataTemp = JSON.parse(dataTemp);
        //     me.isLoadIframeComplete = true;
        //     if (dataTemp.action === 'openIframeComplete') {
        //         // this.isLoadIframeComplete = dataTemp.isLoadComplete;
        //         setTimeout(() => {
        //             // this.loadIframe = true;
        //             me.isLoadIframeComplete = true;
        //             me.loadIframe = true;
        //         }, 300);
        //         //   this.loadIframeContinue = true;
        //     }
        // });

        setTimeout(() => {
            this.showIframe = true;
        }, 300);

        setTimeout(() => {
            this.showIframe = true;
            // const urlDashboard: string = window['urlDashboard'] || 'https://demo.lcssoft.com.vn/einvoice/app/dashboard/index.html';
            // this._previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://gateway-dev.lcssoft.com.vn/crm/dashboard/index.html');
            // if (location.href.indexOf('qms.lcssoft.com.vn') > -1) {
            //     this._previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://qms.lcssoft.com.vn/dashboard/index.html');
            // } else if (location.href.indexOf('callcenter') > -1) {
            //     this._previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://callcenter.qtsc.com.vn/dashboard/index.html');
            // } else {
            //     this._previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://gateway-dev.lcssoft.com.vn/crm/dashboard/index.html');
            // }
            this._previewUrl = this._utils.getLinkDashboard(this.sanitizer, false);

            // this._previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(urlDashboard);
        }, 600);
    }

    ngAfterViewInit(): void {
        // setTimeout(() => {
        //     this.loadIframe = true;
        // }, 300);
    }


    showItems(): void {
        this.fabTogglerState = 'active';
        this.buttons = this.fabButtons;
    }

    hideItems(): void {
        this.fabTogglerState = 'inactive';
        this.buttons = [];
    }

    onToggleFab(): void {
        this.buttons.length ? this.hideItems() : this.showItems();
    }

    previewUrl(): SafeResourceUrl {
        console.log(' previewUrl ');

        return this.sanitizer.bypassSecurityTrustResourceUrl(this._previewUrl);
    }

}
