import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ACTION } from 'app/main/shared/const/app.constant';
import { ITaxIncome } from '../models/taxIncome.interface';
import { TaxIncomeStore } from '../taxIncome.store';

@Component({
    selector: 'app-detail-tax-income',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailTaxIncomeComponent implements OnInit, OnDestroy {
    action = ACTION;
    taxincome: ITaxIncome = {
        empIsResident: 1,
    };
    constructor(
        public store: TaxIncomeStore,
        public matDialogRef: MatDialogRef<DetailTaxIncomeComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any
    ) {

    }

    async ngOnInit(): Promise<void> {
        if (this._data) {
            this.store.isLoading = true;
            this.taxincome = await this.store.getByAggid(this._data.aggId);
            if (this.taxincome) {
                this.store.isLoading = false;
            }
        }
    }

    updateComplete(event): void {
        if (event) {
            this.matDialogRef.close(true);
        }
    }

    ngOnDestroy(): void {
        this.store.isLoading = false;
    }
}
