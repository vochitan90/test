import { Component, OnInit } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { locale as en } from './i18n/en';
import { locale as vi } from './i18n/vi';
import { fuseAnimations } from '@fuse/animations';
import { HttpHelper, Events, AppState, I18nService, FormConfigService, UtilCommon } from '../../shared';
@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    animations: fuseAnimations
})
export class HomeComponent implements OnInit {
    showIframe: boolean;
    _previewUrl: any;

    constructor(private _appState: AppState,
        private _i18nService: I18nService,
        private _utils: UtilCommon,
        private sanitizer: DomSanitizer,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService) {
        
        setTimeout(() => {
            this._fuseTranslationLoaderService.loadTranslations(en, vi);
        }, 0);
        // window.addEventListener('message', (evt: any) => {
        //     const key: string = evt.message ? 'message' : 'data';
        //     let dataTemp: any = evt[key];
        //     if (!dataTemp || !this._utils.checkIsString(dataTemp)) {
        //         return;
        //     }
        //     dataTemp = JSON.parse(dataTemp);

        //     if (dataTemp.action === 'openIframeComplete') {
        //         // this.isLoadIframeComplete = dataTemp.isLoadComplete;
        //         // setTimeout(() => {
        //             // this.loadIframe = true;
        //             // me.isLoadIframeComplete = true;
        //             // me.loadIframe = true;
        //         // }, 300);
        //         //   this.loadIframeContinue = true;

        //     } else if (dataTemp.action === 'gadget-detail') {
        //         if (dataTemp.evt === 'CA_H1'
        //             || dataTemp.evt === 'CA_H2'
        //             || dataTemp.evt === 'CA_H3'
        //             || dataTemp.evt === 'CA_H4') {
        //             if (dataTemp.evt === 'CA_H4') {
        //                 this._utils.routingPageChild('ca-ticket/document');
        //             } else {
        //                 this._utils.routingPageChild('ca-ticket');
        //             }
        //             this._appState.setDashboardEvent(dataTemp.evt);
        //             this._appState.setDashboardEventParams(dataTemp.params);
        //         }
        //     }
        // });
    }

    ngOnInit(): void {
        const me = this;

        // setTimeout(() => {
        //     this.showIframe = true;
        // }, 300);

        // setTimeout(() => {
        //     this.showIframe = true;
        //     this._previewUrl = this._utils.getLinkDashboard(this.sanitizer, true);
        // }, 600);
    }

}
