import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilCommon } from 'app/main/shared';
import { TAX_INCOME_CONSTANT } from '../taxIncome.constant';
import { TaxIncomeStore } from '../taxIncome.store';

@Component({
    selector: 'app-preview-file-print',
    templateUrl: './preview-file-print.component.html',
    styleUrls: ['./preview-file-print.component.scss']
})
export class PreviewFilePrintComponent implements OnInit {
    _previewUrl: any = '';
    constructor(
        public matDialogRef: MatDialogRef<PreviewFilePrintComponent>,
        private sanitizer: DomSanitizer,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private store: TaxIncomeStore,
        private utils: UtilCommon
    ) {

    }

    async ngOnInit(): Promise<void> {
        if (this._data) {
            const url = TAX_INCOME_CONSTANT.API.REVIEW_TAXINCOME + 'aggId=' + this._data.aggId;
            // const url = 'http://docs.google.com/gview?url=http://infolab.stanford.edu/pub/papers/google.pdf&embedded=true';
            this._previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }
    }

    print(): void {
        const myIframe = document.getElementById('viewfile')['contentWindow'];
        myIframe.focus();
        myIframe.print();
    }

    download(): void {
        this.store.downloadTaxIncome(this._data.aggId).then((data: any) => {
            if (data && data.blob.size > 0) {
                this.utils.downloadFile(data.fileName, data.blob);
            }
        }).catch((error: any) => {
            console.error('print!', error);
        });
    }
}
