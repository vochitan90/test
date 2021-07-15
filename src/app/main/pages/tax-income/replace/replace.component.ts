import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ACTION } from 'app/main/shared/const/app.constant';
import { ITaxIncome } from '../models/taxIncome.interface';
import { TaxIncomeStore } from '../taxIncome.store';

@Component({
    selector: 'app-replace-tax-income',
    templateUrl: './replace.component.html',
    styleUrls: ['./replace.component.scss']
})
export class ReplaceTaxIncomeComponent implements OnInit {

    action = ACTION;
    taxincome: ITaxIncome = {
        empIsResident: 1,
    };
    constructor(
        public store: TaxIncomeStore,
        public matDialogRef: MatDialogRef<ReplaceTaxIncomeComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {

    }

    async ngOnInit(): Promise<void> {
        if (this._data) {
            this.store.isLoading = true;
            this.taxincome = await this.store.getByAggid(this._data.aggId);
            this.store.isLoading = false;
        }
    }

    updateComplete(event): void {
        if (event) {
            this.matDialogRef.close(true);
        }
    }

}
