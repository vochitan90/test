import { GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import { BaseDataSource } from 'app/main/shared/utils/BaseDataSource';
import { updateSecondaryColumns } from 'app/main/shared/utils/DatasourceUtil';
import { TaxLetterUploadStore } from './tax-letter-upload.store';

export class TaxLetterUploadDataSource extends BaseDataSource {
    constructor(public store: TaxLetterUploadStore,
        public gridOptions: GridOptions) {
        super(store, gridOptions);
    }

    public getRows(params: IServerSideGetRowsParams): void {
        params.request.filterModel.functionKey = {
            "type": "equals",
            "filter": "TAXINCOME_LETTER",
            "filterType": "text",
            "includeNull": false
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
