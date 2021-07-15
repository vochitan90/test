import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
    CellClickedEvent,
    FilterChangedEvent,
    GridApi,
    GridOptions, PaginationChangedEvent,
    RowClickedEvent,
    RowDoubleClickedEvent,
    RowEditingStoppedEvent,
    RowSelectedEvent,
    SortChangedEvent
} from 'ag-grid-community';
import { I18nService, UtilCommon, UtilComponent } from 'app/main/shared';
import ColumnDefFactory from 'app/main/shared/ag-grid/ColumnDefFactory';
import { getAgGridFrameworkComponents } from 'app/main/shared/components/component/ag-grid/AgGridFrameworkComponents';
import { BaseComponent } from 'app/main/shared/components/component/base-component/base.component';
import { TdDialogService } from 'app/main/shared/components/component/dialogs';
import { ACTION, AG_GRID_CONSTANT } from 'app/main/shared/const/app.constant';
import { PeriodUploadDetailDialogComponent } from '../components/upload_dialog/upload-dialog.component';
import { PeriodDetailResultUploadDialogComponent } from '../detail_dialog/detail-dialog.component';
import { IProcessUpload } from '../models/processUpload.interface';
import { UPLOAD_PERIOD_CONSTANT } from '../period-upload.constant';
import { PeriodUploadDataSource } from '../period-upload.datasource';
import { PeriodUploadStore } from '../period-upload.store';

@Component({
    selector: 'app-period-upload-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListTaxIncomeUploadComponent extends BaseComponent {
    private _uploadDialogRef: MatDialogRef<PeriodUploadDetailDialogComponent>;
    private _detailDialogRef: MatDialogRef<PeriodDetailResultUploadDialogComponent>;
    @ViewChild(AgGridAngular) agGrid: AgGridAngular;
    CONSTANT_BASE = UPLOAD_PERIOD_CONSTANT;
    showColumnAction = true;
    screenID = UPLOAD_PERIOD_CONSTANT.SCREEN.PROCESS_UPLOAD;
    constructor(
        public _changeDetectorRef: ChangeDetectorRef,
        public _dialogService: TdDialogService,
        public _route: ActivatedRoute,
        public _translateService: TranslateService,
        public _utils: UtilCommon,
        public _utilComponent: UtilComponent,
        public _i18nService: I18nService,
        public _matDialog: MatDialog,
        public store: PeriodUploadStore) {
        super(_changeDetectorRef, _dialogService, _translateService,
            _utils, _utilComponent, _i18nService, store);
    }

    buildColumnDefs(dataSchema: any): void {
        this.store._entitySchema = dataSchema;
        this.store._columnDefs = ColumnDefFactory.createColumnDefsFromSchema(dataSchema, this.store.gridConfigs);
        this.store.cellRenderer();
        if (this._utils.checkIsNotNull(this.gridOptions.api)) {
            this.gridOptions.api.setColumnDefs(this.store._columnDefs);
        }
    }


    buildGridOptions(): void {
        try {
            this.gridOptions = <GridOptions>{
                context: {
                    isGridReady: false,
                    translateService: this._translateService,
                    store: this.store,
                    parent: this,
                    // actions: [
                    //     { action: UPLOAD_PERIOD_CONSTANT.ACTIONS.EDIT, icon: 'edit', name: 'Chỉnh sửa' },
                    //     { action: UPLOAD_PERIOD_CONSTANT.ACTIONS.ASSIGN_ROLE, icon: 'settings', name: 'Cài dặt' },
                    //     { action: UPLOAD_PERIOD_CONSTANT.ACTIONS.DISABLE, icon: 'lock', name: 'DISABLE' },
                    //     { action: UPLOAD_PERIOD_CONSTANT.ACTIONS.ENABLE, icon: 'lock_open', name: 'ENABLE' }
                    // ],
                },
                serverSideFilteringAlwaysResets: true,
                serverSideSortingAlwaysResets: true,
                rowMultiSelectWithClick: true,
                rowHeight: window['GROW_HEIGHT_40_AGGRID'],
                editType: 'fullRow',
                rowModelType: 'serverSide',
                serverSideStoreType: 'partial',
                sideBar: {
                    toolPanels: [
                        {
                            id: 'columns',
                            labelDefault: 'Columns',
                            labelKey: 'columns',
                            iconKey: 'columns',
                            toolPanel: 'agColumnsToolPanel',
                            toolPanelParams: {
                                suppressRowGroups: true,
                                suppressValues: true,
                                suppressPivots: true,
                                suppressPivotMode: true,
                            }
                        },
                        {
                            id: 'filters',
                            labelDefault: 'Filters',
                            labelKey: 'filters',
                            iconKey: 'filters',
                            toolPanel: 'agFiltersToolPanel',
                        }
                    ],
                    defaultToolPanel: 'columns'
                },
                suppressAggFuncInHeader: true,
                suppressRowClickSelection: false,
                rowSelection: AG_GRID_CONSTANT.ROW_SELECTION_SINGLE,
                animateRows: false,
                // START setting paging
                pagination: true,
                paginationPageSize: 30,
                maxBlocksInCache: 2,
                cacheBlockSize: 30,
                cacheOverflowSize: 30,
                infiniteInitialRowCount: 30,
                // END setting paging
                suppressClickEdit: true,
                blockLoadDebounceMillis: 300,
                maxConcurrentDatasourceRequests: 2,
                rowBuffer: 0,
                suppressCellSelection: true,
                defaultColDef: ColumnDefFactory.getDefaultColDef(),
                columnDefs: this.store._columnDefs,
                frameworkComponents: getAgGridFrameworkComponents(),
                getRowNodeId: data => {
                    return data[UPLOAD_PERIOD_CONSTANT.COLUMN.ID];
                },
                onRowClicked: (event: RowClickedEvent) => {
                    // console.log('onRowClicked', event);
                },
                onSelectionChanged: (event: RowSelectedEvent) => {
                    this.gridOptions.api.refreshHeader();
                },
                onRowDoubleClicked: (event: RowDoubleClickedEvent) => {
                    this.viewDetail(event.data, ACTION.VIEW);
                },
                onSortChanged: (event: SortChangedEvent) => {
                    // console.log('onSortChanged', event.api.getSortModel());
                },
                onFilterChanged: (event: FilterChangedEvent) => {
                    // console.log('onFilterChanged', event.api.getFilterModel());
                },
                onPaginationChanged: (event: PaginationChangedEvent) => {
                    this.gridOptions.api.deselectAll();
                    this.gridOptions.api.refreshHeader();
                },
                onRowEditingStopped: (event: RowEditingStoppedEvent) => {
                    // console.log('onRowEditingStopped', event.data);
                },
                onCellClicked: (async (event: CellClickedEvent) => {
                    const row = event.data as IProcessUpload;
                    const colId = event.column[AG_GRID_CONSTANT.COLD_ID];
                    if (colId === UPLOAD_PERIOD_CONSTANT.COLUMN.FILE_NAME && row.id) {
                        await this.store.downloadFile(row.id, row.fileName);
                    }
                }),
                onGridReady: () => {
                    this.gridOptions.context.isGridReady = true;
                    const gridApi: GridApi = this.gridOptions.api;
                    gridApi.closeToolPanel();
                    gridApi.refreshHeader();
                    gridApi.setServerSideDatasource(new PeriodUploadDataSource(this.store, this.gridOptions));
                },
            };
        } catch (error) {
            console.log(error);
        }
    }

    public actionCellClick(action: string, row: any): void {
        alert(action);
    }


    openFilter(): void {

    }

    upload(): void {
        this._uploadDialogRef = this._matDialog.open(PeriodUploadDetailDialogComponent, {
            panelClass: 'tax-income-upload-dialog',
            data: {
                entitySchema: this.store._entitySchema,
            },
            id: 'periodUploadDetaiDialog',
            disableClose: true,
            autoFocus: false
        });
        this._uploadDialogRef.afterClosed().subscribe((isSuccess: boolean) => {
            if (isSuccess) {
                this.refresh();
            }
        });
    }

    viewDetail(row, action): void {
        this._detailDialogRef = this._matDialog.open(PeriodDetailResultUploadDialogComponent, {
            panelClass: 'custom-dialog',
            data: {
                entitySchema: this.store._entitySchema,
                data: row,
                action: action
            },
            id: 'resultUpload',
            disableClose: true,
            autoFocus: false
        });
        this._detailDialogRef.afterClosed().subscribe((isSuccess: boolean) => {
            if (isSuccess) {
                this.refresh();
            }
        });
    }
}
