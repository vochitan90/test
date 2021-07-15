import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi, GridOptions, PaginationChangedEvent, RowClickedEvent, RowDoubleClickedEvent, RowSelectedEvent } from 'ag-grid-community';
import { I18nService, UtilCommon, UtilComponent } from 'app/main/shared';
import ColumnDefFactory from 'app/main/shared/ag-grid/ColumnDefFactory';
import { getAgGridFrameworkComponents } from 'app/main/shared/components/component/ag-grid/AgGridFrameworkComponents';
import { BaseComponent } from 'app/main/shared/components/component/base-component/base.component';
import { TdDialogService } from 'app/main/shared/components/component/dialogs';
import { ACTION } from 'app/main/shared/const/app.constant';
import { LIST_OF_USAGE_CONSTANT } from '../list-of-usage.constant';
import { ListOfUsageStoreDataSource } from '../list-of-usage.datasource';
import { ListOfUsageStore } from '../list-of-usage.store';

@Component({
    selector: 'app-report-list-of-usage',
    templateUrl: './list-of-usage.component.html',
    styleUrls: ['./list-of-usage.component.scss']
})
export class ReportListOfUsageComponent extends BaseComponent {
    @ViewChild(AgGridAngular) agGrid: AgGridAngular;
    CONSTANT_BASE = LIST_OF_USAGE_CONSTANT;
    showColumnAction = false;
    screenID = LIST_OF_USAGE_CONSTANT.SCREEN.REPORT_LIST;
    constructor(
        public _changeDetectorRef: ChangeDetectorRef,
        public _dialogService: TdDialogService,
        public _route: ActivatedRoute,
        public _translateService: TranslateService,
        public _utils: UtilCommon,
        public _utilComponent: UtilComponent,
        public _i18nService: I18nService,
        public _matDialog: MatDialog,
        public store: ListOfUsageStore) {
        super(_changeDetectorRef, _dialogService, _translateService, _utils, _utilComponent, _i18nService, store);
    }

    buildGridOptions(): void {
        try {
            this.gridOptions = <GridOptions>{
                context: {
                    isGridReady: false,
                    translateService: this._translateService,
                    store: this.store,
                    parent: this,
                },
                serverSideFilteringAlwaysResets: true,
                serverSideSortingAlwaysResets: true,
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
                suppressRowClickSelection: true,
                rowMultiSelectWithClick: false,
                rowSelection: 'single',
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
                    return data[LIST_OF_USAGE_CONSTANT.COLUMN.ID];
                },
                onRowClicked: (event: RowClickedEvent) => {
                    this.store.isRowSelected = true;
                    // this._changeDetectorRef.detectChanges();
                },
                onSelectionChanged: (event: RowSelectedEvent) => {
                    this.gridOptions.api.refreshHeader();
                },
                onRowDoubleClicked: (event: RowDoubleClickedEvent) => {
                    this.viewDetail(ACTION.VIEW, event.data);
                },
                onPaginationChanged: (event: PaginationChangedEvent) => {
                    this.gridOptions.api.deselectAll();
                    this.gridOptions.api.refreshHeader();
                },
                onGridReady: () => {
                    this.gridOptions.context.isGridReady = true;
                    const gridApi: GridApi = this.gridOptions.api;
                    gridApi.closeToolPanel();
                    gridApi.refreshHeader();
                    this.store.isRowSelected = false;
                    gridApi.setServerSideDatasource(new ListOfUsageStoreDataSource(this.store, this.gridOptions));
                },
            };
        } catch (error) {
            console.log(error);
        }
    }

    add(): void {
        this._utils.routingPageChild(LIST_OF_USAGE_CONSTANT.LINK.REVENUE, this._route);
    }

    getRowSelectedLength(): number {
        const gridApi = this.gridOptions.api;
        if (gridApi) {
            return gridApi.getSelectedNodes().length;
        }
        return 0;
    }

    downloadFile(row: any): void {
        if (row.status !== 1 || !row.filePath) {
            this._utilComponent.openSnackBar('Hiện tại không thể tải báo cáo này. Vui lòng thử lại sau', 'error');
            return;
        }
        this.store.isLoading = true;
        let typePdf = 'pdf';
        if (row) {
            if (row.runtimeValue.exportFormat.toLowerCase() === 'xlsx' || row.runtimeValue.exportFormat.toLowerCase() === 'xls') {
                typePdf = row.runtimeValue.exportFormat.toLowerCase();
            }
        }
        this.store.downloadReportNew(row.filePath).then((report: any) => {
            if (report) {
                const fileURL: any = URL.createObjectURL(report);
                this.store.isLoading = false;
                if (typePdf !== 'pdf') {
                    const anchor: any = document.createElement('a');
                    anchor.href = fileURL;
                    anchor.download = row.reportName + '.' + typePdf;
                    anchor.click();
                    return;
                } else {
                    // setTimeout(() => {
                    //     const _iFrame: any = document.getElementById('dialog-frame');
                    //     _iFrame.setAttribute('src', fileURL + '#zoom=100');
                    // }, 300);
                    const anchor: any = document.createElement('a');
                    anchor.href = fileURL;
                    anchor.download = row.reportName + '.' + typePdf;
                    anchor.click();
                    return;
                }

            } else {
                this._utilComponent.showTranslateSnackbar('REPORT_LIST.EXPORT_FAIL', 'error');
            }
        }).catch(() => {
            this.store.isLoading = false;
            this._utilComponent.showTranslateSnackbar('REPORT_LIST.EXPORT_FAIL', 'error');
        });
    }
}
