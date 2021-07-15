import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { BuildMenuTree } from 'app/main/shared/utils/BuildMenuTree';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { APP_CONFIG } from '../../../app.config';
import { Events, UtilCommon } from '../../shared';
import { AppState } from '../../shared/utils/AppState';
import { UtilComponent } from '../../shared/utils/UtilComponent';
import { LoginService } from './login.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: fuseAnimations
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {

    loginForm: FormGroup;
    version: string;
    loading: boolean;
    spinnerButtonOptions: MatProgressButtonOptions;
    DEFAULT_HOME_PAGE: any;
    isQTSC: boolean;
    isCA: boolean;
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _loginService: LoginService,
        private _appState: AppState,
        private _router: Router,
        private _utilComponent: UtilComponent,
        private _utils: UtilCommon,
        private _events: Events,
        private _menuTree: BuildMenuTree,
        private _translateService: TranslateService,
    ) {
        // Configure the layout


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
        this.version = APP_CONFIG.VERSION;
        this.spinnerButtonOptions = this._utilComponent.generateProgressButton(
            this._translateService.instant('LOGIN.SIGN_IN')
        );

    }

    ngOnInit(): void {
        // if (window.location.href.indexOf('localhost') > -1) {
        //     this.loginForm = this._formBuilder.group({
        //         email: ['truc.lt@fecredit.com.vn', [Validators.required]],
        //         password: ['DcGMT=6c', Validators.required]
        //     });
        // } else {
        //     this.loginForm = this._formBuilder.group({
        //         email: ['', [Validators.required]],
        //         password: ['', Validators.required]
        //     });
        // }
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required]],
            password: ['', Validators.required]
        });
        this.loading = false;
    }

    ngAfterViewInit(): void {

    }

    async loadMenuTree(dataMenuTree: any): Promise<any> {
        dataMenuTree = await this._menuTree.convertMenuTree(dataMenuTree);
        this._appState.setScreen(dataMenuTree);
        this._events.publish('load:menuTree', dataMenuTree);
    }
    login(): void {
        const loginForm:
            any = this.loginForm;
        if (!this._utilComponent.checkValidateFormWithSpecificForm(loginForm)) {
            return;
        }
        const email = loginForm.get('email').value,
            password = loginForm.get('password').value;
        this.loading = true;
        this.spinnerButtonOptions.active = true;

        this._loginService.login(email, password).then((dataLogin: any) => {
            if (dataLogin) {
                if (dataLogin.id_token) {
                    localStorage.setItem('tokenJWT', dataLogin.id_token);
                    this._appState.setAppStateUsername(email);
                    return this._loginService.getUserInfo();
                }
            }
            return null;
        }).then((userInfo: any) => {
            if (userInfo) {
                window['APP_STATE'] = userInfo;
                sessionStorage.setItem('APP_STATE', JSON.stringify(userInfo));
                this._appState.setAppState(userInfo);
                return this._appState.getMenuTree();
                // return true;
            }
            return null;
        }).then((dataMenuTree: any) => {
            this.loading = false;
            this.spinnerButtonOptions.active = false;
            if (dataMenuTree) {
                localStorage.setItem('username', email);
                this.loadMenuTree(dataMenuTree);
                this._router.navigate(['/org-info/list']);
                return;
            }
            this._utilComponent.showTranslateSnackbar('LOGIN.ACTION_FAILURE', 'error');
        }).catch((err: any) => {
            this.loading = false;
            this._utilComponent.showTranslateSnackbar('LOGIN.ACTION_FAILURE', 'error');
            this.spinnerButtonOptions.active = false;
        });
    }

    checkFormValid(): boolean {
        if (!this.loginForm) {
            return true;
        }
        if (this.loading) {
            return true;
        }
        return false;
    }

    ngOnDestroy(): void {
        // if (this._socket) {
        //     this._socket.unsubscribe();
        // }
    }

    loginEinvoice(): void {
        // this._loginService.login(email, password).then((dataLogin: any) => {
        //     if (dataLogin) {
        //         if (dataLogin.authenticationSuccess) {
        //             this._appState.setAppStateUsername(email);
        //             return this._loginService.getUserInfo();
        //         }
        //     }
        //     return null;
        // }).then((userInfo: any) => {
        //     if (userInfo) {
        //         window['APP_STATE'] = userInfo;
        //         sessionStorage.setItem('APP_STATE', JSON.stringify(userInfo));
        //         this._appState.setAppState(userInfo);
        //         return this._loginService.getMenuTree();
        //     }
        //     return null;
        // }).then((dataMenuTree: any) => {
        //     this.loading = false;
        //     this.spinnerButtonOptions.active = false;
        //     if (dataMenuTree) {
        //         localStorage.setItem('username', email);
        //         this.loadMenuTree(dataMenuTree);
        //         this._router.navigate(['/home']);
        //         return;
        //     }
        //     this._utilComponent.showTranslateSnackbar('LOGIN.ACTION_FAILURE', 'error');
        // }).catch((err: any) => {
        //     this.loading = false;
        //     this._utilComponent.showTranslateSnackbar('LOGIN.ACTION_FAILURE', 'error');
        //     this.spinnerButtonOptions.active = false;
        // });
    }
}
