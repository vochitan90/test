import { Component, OnInit } from '@angular/core';
import { UtilCommon } from 'app/main/shared';
import { ACTION } from 'app/main/shared/const/app.constant';
import { TAX_INCOME_CONSTANT } from '../taxIncome.constant';

@Component({
    selector: 'app-create-tax-income',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class CreateTaxIncomeComponent implements OnInit {
    action = ACTION;
    constructor(
        private _utils: UtilCommon,
    ) {

    }

    ngOnInit(): void {
        try {
        } catch (err: any) {
        }
    }

    close(): void {
        this._utils.routingBackPage(TAX_INCOME_CONSTANT.LINK.LIST_NEW);
    }
}
