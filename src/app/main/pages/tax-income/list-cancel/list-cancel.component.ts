import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
    CellClickedEvent, FilterChangedEvent, GridApi, GridOptions,
    PaginationChangedEvent, RowClickedEvent, RowDoubleClickedEvent, RowEditingStoppedEvent,
    RowSelectedEvent, SortChangedEvent
} from 'ag-grid-community';
import { FormConfigService, I18nService, UtilCommon, UtilComponent } from 'app/main/shared';
import ColumnDefFactory from 'app/main/shared/ag-grid/ColumnDefFactory';
import { getAgGridFrameworkComponents } from 'app/main/shared/components/component/ag-grid/AgGridFrameworkComponents';
import { BaseComponent } from 'app/main/shared/components/component/base-component/base.component';
import { ACTION } from 'app/main/shared/const/app.constant';
import { TdDialogService } from '../../../shared/components/component/dialogs';
import { DetailTaxIncomeComponent } from '../detail/detail.component';
import { ITaxIncome } from '../models/taxIncome.interface';
import { TAX_INCOME_CONSTANT } from '../taxIncome.constant';
import { TaxIncomeStore } from '../taxIncome.store';
import { TaxIncomeCancelDataSource } from './taxIncome-cancel.datasource';

@Component({
    selector: 'app-list-tax-income-cancel',
    templateUrl: './list-cancel.component.html',
    styleUrls: ['./list-cancel.component.scss']
})
export class ListTaxIncomeCancelComponent extends BaseComponent implements OnInit {

    private _detailDialogRef: MatDialogRef<DetailTaxIncomeComponent>;

    @ViewChild(AgGridAngular) agGrid: AgGridAngular;
    CONSTANT_BASE = TAX_INCOME_CONSTANT;
    showColumnAction = false;
    screenID = TAX_INCOME_CONSTANT.SCREEN.TAXINCOME;
    listBU = [];
    constructor(
        public _changeDetectorRef: ChangeDetectorRef,
        public _dialogService: TdDialogService,
        public _route: ActivatedRoute,
        public _translateService: TranslateService,
        public _utils: UtilCommon,
        public _utilComponent: UtilComponent,
        public _i18nService: I18nService,
        public _matDialog: MatDialog,
        public store: TaxIncomeStore) {
        super(_changeDetectorRef, _dialogService, _translateService, _utils, _utilComponent, _i18nService, store);
    }

    // START Override
    ngOnInit(): void {
        this.store.initPemision();
        this.buildGridOptions();
        Promise.all([
            this.store.getSchemaPivot(),
            this.store.getAccountUserAttribute(TAX_INCOME_CONSTANT.TAXINCOME_DELETE_ATTRIBUTE).catch(() => undefined),
            this._i18nService.getMessagesTenant(FormConfigService.buildScreenId(this.screenID)).catch(() => undefined),
            this.store.getListBusinessUnitActiveForUser().catch(() => undefined)
        ]).then(array => {
            this.initGridUI(array[0]);
            this.listBU = array[3];
            if (this.listBU.length === 1) {
                this.store.selectedBuIdCancel = this.listBU[0].id;
            }
        }).catch(error => {
            console.error('getSchema & getAccountUserAttribute', error);
        });
        this.store._unsubscribableArray.push(this._translateService.onLangChange.subscribe((e: LangChangeEvent) => {
            this._i18nService.getMessagesTenant(FormConfigService.buildScreenId(this.screenID)).then(data => {
                if (this.gridOptions.context.isGridReady && this.gridOptions.api) {
                    this.gridOptions.api.setColumnDefs(this.store._columnDefs);
                    this.setUserAttributesToGrid();
                    this.autoSizeAll(false);
                }
            }).catch(error => {
                console.error('getMessagesTenant', error);
            });
        }),
        );
    }

    async actionChangeColumn(columnState): Promise<void> {
        if (this.store.isFirstEnterSreen) {
            const countValue = await this.store.pivotCountOnTitle().catch(() => undefined);
            if (this._utils.checkIsNotNull(countValue)) {
                this.setPivotCountOnTitle(countValue);
            }
            this.store.isFirstEnterSreen = false;
            return;
        }
        await this.store.saveAccountUserAttribute({ columnState }, true, TAX_INCOME_CONSTANT.TAXINCOME_DELETE_ATTRIBUTE);
    }

    public buildColumnDefs(dataSchema: any): void {
        this.store._entitySchema = dataSchema;
        this.store.gridConfigs.delCols = this.store.delCols();
        this.store._columnDefs = ColumnDefFactory.createColumnDefsFromSchema(dataSchema, this.store.gridConfigs);
        if (this._utils.checkIsNotNull(this.gridOptions.api)) {
            this.gridOptions.api.setColumnDefs(this.store._columnDefs);
        }
    }
    // END Override

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
                rowMultiSelectWithClick: false,
                rowSelection: 'single',
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
                    return data[TAX_INCOME_CONSTANT.COLUMN.ID];
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
                    // const row = event.data as IReleaseRegistration;
                    // const colId = event.column[AG_GRID_CONSTANT.COLD_ID];
                    // if(colId === TAX_INCOME_CONSTANT.COLUMN.DOWNLOAD && row.id){
                    //     await this.store.downloadFile(row.id, row.name);
                    // }else if(colId === TAX_INCOME_CONSTANT.COLUMN.SEE_ALL_OLD_VERSION && row.templateVersionId){
                    //     await this.oppenPageOldversion(row);
                    // } 
                }),
                onGridReady: () => {
                    this.gridOptions.context.isGridReady = true;
                    const gridApi: GridApi = this.gridOptions.api;
                    gridApi.closeToolPanel();
                    gridApi.refreshHeader();
                    this.store.isRowSelected = false;
                    gridApi.setServerSideDatasource(new TaxIncomeCancelDataSource(this.store, this.gridOptions));
                },
            };
        } catch (error) {
            console.log(error);
        }
    }

    getRowSelectedLength(): number {
        const gridApi = this.gridOptions.api;
        if (gridApi) {
            return gridApi.getSelectedNodes().length;
        }
        return 0;
    }

    viewDetail(_action: string = ACTION.CREATE, data: ITaxIncome = null): void {
        try {
            this._detailDialogRef = this._matDialog.open(DetailTaxIncomeComponent, {
                panelClass: 'detail-tax-income-dialog',
                data: {
                    aggId: data.aggId
                },
                id: 'detailTaxIncome',
                disableClose: true,
            });
            this._detailDialogRef.afterClosed().subscribe((isSuccess: boolean) => {
                if (isSuccess) {
                    this.refresh();
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
}
