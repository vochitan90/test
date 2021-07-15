import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppState, Events, UtilCommon, BuildMenuTree } from '../../../main/shared';
@Component({
    selector: 'content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ContentComponent implements OnInit, OnDestroy {
    public routes: any[] = [];
    DEFAULT_HOME_PAGE: any;
    isCA: boolean;
    constructor(
        private _router: Router,
        private _appState: AppState,
        private _translate: TranslateService,
        private _events: Events,
        private _utils: UtilCommon,
        private _menuTree: BuildMenuTree) {

        this._events.subscribe('main:logout', (data1: any, data2: any) => {
            this.logout();
        });

    }

    ngOnInit(): void {
        const username = this._appState.getAppStateUsername();
        if (!username) {
            this._router.navigate(['/login']);
        } else {
            this._appState.getUserInfoService().then((userInfo: any) => {
                if (userInfo) {
                    window['APP_STATE'] = userInfo;
                    sessionStorage.setItem('APP_STATE', JSON.stringify(userInfo));
                    return this._appState.getMenuTree();
                    // return true;
                }
                this._router.navigate(['/login']);
                return null;
            }).then((dataMenuTree: any) => {
                if (dataMenuTree) {
                    this.loadMenuTree(dataMenuTree);
                    this.firstInitPage();
                }
            }).catch((err: any) => {
                localStorage.clear();
                this._router.navigate(['/login']);
            });
        }
    }

    async loadMenuTree(dataMenuTree: any): Promise<any> {
        dataMenuTree = await this._menuTree.convertMenuTree(dataMenuTree);
        this._events.publish('load:menuTree', dataMenuTree);
        this._appState.setScreen(dataMenuTree);
    }

    ngOnDestroy(): void {
        this._events.unsubscribe('clickNotification');
    }

    logout(): void {
        if (window['APP_STATE']) {
            this._router.navigate(['/login']);
            this._appState.clearLogout();
        }
    }

    private firstInitPage(): void {
        const handleUrl: string = this._utils.handleUrl(window.location.href);
        // Sau chúng ta cần list màn hình ở đây, dể check navigate tời màn hình cần thiết.
        if (handleUrl === 'login' || handleUrl === '/login') {
            this._router.navigate(['/home']);
            return;
        }
        if (handleUrl === '/home') {
            return;
        }
        if (handleUrl.length > 3) {
            this._router.navigate([handleUrl]);
        } else {
            this._router.navigate(['/home']);
            // this._router.navigate([this.DEFAULT_HOME_PAGE.value]);
            // this.getUserAttribute().then(data => {
            //     if (data) {
            //         this._router.navigate([this.DEFAULT_HOME_PAGE.value]).then(() => {
            //         });
            //     }
            //     else {
            //         this._router.navigate(['/mytask']).then(() => {
            //         });
            //     }
            // }).catch(error => {
            //     console.error('getAccountUserAttribute', error);
            //     this._router.navigate(['/mytask']).then(() => {
            //     });
            // });
        }
    }
}
