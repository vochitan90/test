import { GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import { BaseDataSource } from 'app/main/shared/utils/BaseDataSource';
import { updateSecondaryColumns } from 'app/main/shared/utils/DatasourceUtil';
import { IssueRegistryUploadStore } from './issue-registry-upload.store';

export class IssueRegistryUploadDataSource extends BaseDataSource {
    constructor(public store: IssueRegistryUploadStore,
        public gridOptions: GridOptions) {
        super(store, gridOptions);
    }

    public getRows(params: IServerSideGetRowsParams): void {
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
