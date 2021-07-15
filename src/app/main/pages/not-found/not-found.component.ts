import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { APP_CONFIG } from '../../../app.config';
import { UtilComponent } from '../../shared/utils/UtilComponent';
import { UtilCommon } from '../../shared/utils/UtilCommon';
import { AppState } from '../../shared/utils/AppState';
import { Events } from '../../shared';

@Component({
    selector: 'not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss'],
    animations: fuseAnimations
})
export class NotFoundComponent implements OnInit {
    loginForm: FormGroup;
    version: string;
    loading: boolean;
    // confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _appState: AppState,
        private _router: Router,
        private _utilComponent: UtilComponent,
        private _events: Events,
        private _utils: UtilCommon
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
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

    }

}
