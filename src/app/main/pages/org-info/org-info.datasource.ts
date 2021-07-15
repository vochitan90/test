import { GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import { BaseDataSource } from 'app/main/shared/utils/BaseDataSource';
import { updateSecondaryColumns } from 'app/main/shared/utils/DatasourceUtil';
import { OrgInfoStore } from './org-info.store';

export class OrgInfoDataSource extends BaseDataSource {
    constructor(public store: OrgInfoStore,
        public gridOptions: GridOptions) {
            super(store, gridOptions);
    }

    public getRows(params: IServerSideGetRowsParams): void {
        this.store.pivotPaging(params.request).then((result: any) => {
            if (result) {
                if(result.data.length > 0){
                    for(const data of result.data){
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
