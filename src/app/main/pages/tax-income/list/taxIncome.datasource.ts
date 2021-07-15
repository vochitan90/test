import { GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import { BaseDataSource } from 'app/main/shared/utils/BaseDataSource';
import { updateSecondaryColumns } from 'app/main/shared/utils/DatasourceUtil';
import { TAX_INCOME_CONSTANT } from '../taxIncome.constant';
import { TaxIncomeStore } from '../taxIncome.store';

export class TaxIncomeNewDataSource extends BaseDataSource {
    constructor(
        public store: TaxIncomeStore,
        public gridOptions: GridOptions) {
        super(store, gridOptions);
    }

    public getRows(params: IServerSideGetRowsParams): void {
        if (this.store.selectedBuIdNew !== -1) {
            params.request.filterModel.buId = {
                'type': 'equals',
                'filter': this.store.selectedBuIdNew,
                'filterType': 'number', 'includeNull': false
            };
        } else {
            delete params.request.filterModel.buId;
        }
        params.request.filterModel.status = {
            'type': 'in',
            'values': [TAX_INCOME_CONSTANT.STATUS.NEW, TAX_INCOME_CONSTANT.STATUS.REPLACE],
            'filterType': 'set', 'includeNull': false
        };
        this.store.pivotPaging(params.request).then((result: any) => {
            if (result) {
                if (result.data.length > 0) {
                    for (const data of result.data) {
                        data.action = data.id;
                    }
                }
                params.successCallback(result.data, result.lastRow);
                updateSecondaryColumns(params.request, result, this.gridOptions);
                this.gridOptions.columnApi.autoSizeAllColumns();
            } else {
                params.failCallback();
            }
        }).catch((error: any) => {
            params.failCallback();
        });
    }
}
