import { GridOptions, IServerSideDatasource, IServerSideGetRowsParams, IServerSideGetRowsRequest } from 'ag-grid-community';
import { updateSecondaryColumns } from 'app/main/shared/utils/DatasourceUtil';

export class BaseDataSource implements IServerSideDatasource {
    constructor(public store: any,
        public gridOptions: GridOptions) {
    }

    public destroy(): void {
    }

    public getRows(params: IServerSideGetRowsParams): void {
        this.store.pivotPaging(params.request).then((result: any) => {
            if (result) {
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
