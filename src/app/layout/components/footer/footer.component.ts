import { Component } from '@angular/core';
import { APP_CONFIG } from '../../../app.config';
@Component({
    selector: 'footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    companyName: string;
    version: string;
    /**
     * Constructor
     */
    constructor() {
        this.companyName = APP_CONFIG.COMPANY_NAME;
        this.version = APP_CONFIG.VERSION;
    }
}
