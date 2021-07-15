import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { AppState } from '../utils/AppState';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UtilComponent } from '../utils/UtilComponent';
import { TranslateService } from '@ngx-translate/core';
import { FuseConfigService } from '@fuse/services/config.service';

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate, CanLoad {

    constructor(private appState: AppState, private router: Router, private utilsComp: UtilComponent,
        private translateService: TranslateService,
        private _fuseConfigService: FuseConfigService,
        private _router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const urlCurrent = location.hash;
        let isLoggedIn: boolean = this.appState.isLoggedIn();
        // Thong bao o day, check permission
        if (!isLoggedIn) {
            this.appState.setUrlCurrent(urlCurrent);
            this._fuseConfigService.config = {
                layout: {
                    navbar: {
                        hidden: true
                    },
                    toolbar: {
                        hidden: true
                    },
                    footer: {
                        hidden: true
                    },
                    sidepanel: {
                        hidden: true
                    }
                }
            };
            if (this.router.url.indexOf('login') > -1) {
                return isLoggedIn;
            }
            this.router.navigate(['/login']);
            return isLoggedIn;
        }
        const url: string = state.url;
        // Check xem user co the truy cap page hay khong
        isLoggedIn = this.appState.accessPage(url);
        if (window.location.href.indexOf('localhost') > -1) {
            return true;
        }
        //// bo check page
        if (url.indexOf('welcome') > -1 || url.indexOf('login') > -1 || url.indexOf('notification') > -1) {
            isLoggedIn = true;
        }
        if (!isLoggedIn) {
            this.translateService.get('MESSAGE_ERROR.ACCESS_DENY_PAGE').subscribe((value: any) => {
                this.utilsComp.generateDialogAlertWithCallBack(() => {
                    const pageDefault: string = this.appState.getPageDefault();
                    this.router.navigate([pageDefault]).then(() => {
                    });
          
                }, value);
            });
            // this.utilsComp.generateDialogAlert('Bạn không có quyền truy cập chức năng này !');
            return isLoggedIn;
        }
        return isLoggedIn;
    }

    canLoad(): boolean {
        if (localStorage.getItem('username')) {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}
