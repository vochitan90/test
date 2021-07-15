import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
    AgGridEvent,
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
import { FormConfigService, I18nService, UtilCommon, UtilComponent } from 'app/main/shared';
import ColumnDefFactory from 'app/main/shared/ag-grid/ColumnDefFactory';
import { getAgGridFrameworkComponents } from 'app/main/shared/components/component/ag-grid/AgGridFrameworkComponents';
import { ACTION, AG_GRID_CONSTANT } from 'app/main/shared/const/app.constant';
import { BaseStoreService } from 'app/main/shared/utils/BaseStoreService';
import * as _ from 'lodash';
import { merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { TdDialogService } from '../dialogs';

@Component({
    selector: 'app-base-component',
    template: `NO UI TO BE FOUND HERE!`,
    styleUrls: ['./base.component.scss']
})

export class BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild(AgGridAngular) agGrid: AgGridAngular;
    public gridOptions: GridOptions;
    public pivotCountOnTitle = '';
    public showColumnAction = false;
    public screenID: string;
    public actions: [
    ];
    public rowSelection: string = AG_GRID_CONSTANT.ROW_SELECTION_MULTIPLE;
    public CONSTANT_BASE: any;
    public dataSource;
    constructor(
        public _changeDetectorRef: ChangeDetectorRef,
        public _dialogService: TdDialogService,
        public _translateService: TranslateService,
        public _utils: UtilCommon,
        public _utilComponent: UtilComponent,
        public _i18nService: I18nService,
        public store: BaseStoreService) {
    }

    public initGridUI(dataSchema: any): void {
        setTimeout(() => {
            this.buildColumnDefs(dataSchema);
            this.setUserAttributesToGrid();
            this._changeDetectorRef.detectChanges();
        }, 0);
        setTimeout(() => {
            const { agGrid } = this;
            try {
                this.store._unsubscribableArray.push(
                    merge(agGrid.displayedColumnsChanged, agGrid.displayedColumnsWidthChanged)
                        .pipe(
                            debounceTime(400),
                            map(event => (<AgGridEvent>event).columnApi.getColumnState()),
                            distinctUntilChanged(_.isEqual),
                        )
                        .subscribe(columnState => {
                            this.actionChangeColumn(columnState);
                        })
                );
                this._changeDetectorRef.detectChanges(); // fix bug: don't show title by current language.
            } catch (error) {
                console.log(error);
            }
        }, 300);
    }

    public setPivotCountOnTitle(count?: number): void {
        if (count === undefined) {
            this.pivotCountOnTitle = '';
        } else {
            this.pivotCountOnTitle = ' (' + count + ')';
        }
        this._changeDetectorRef.detectChanges();
    }

    public setUserAttributesToGrid(): void {
        const { columnApi, api } = this.gridOptions;
        if (columnApi && api) {
            this.store.updateStateForColumn(columnApi.getColumnState());
            columnApi.setColumnState(this.store.columnState);
            api.setFilterModel(this.store.normalFilterModel);
            if (this._utils.checkIsNotNull(this.store.getSortModel())) {
                columnApi.applyColumnState(this.store.getSortModel());
            }
        }
    }

    public buildColumnDefs(dataSchema: any): void {
        this.store._entitySchema = dataSchema;
        this.store._columnDefs = ColumnDefFactory.createColumnDefsFromSchema(dataSchema, this.store.gridConfigs);
        if (this.showColumnAction) {
            this.store._columnDefs.push(this._utils.getActionColumn(AG_GRID_CONSTANT.ACTIONS.ACTION));
        }
        if (this._utils.checkIsNotNull(this.gridOptions.api)) {
            this.gridOptions.api.setColumnDefs(this.store._columnDefs);
        }
    }

    public buildGridOptions(): void {
        try {
            this.gridOptions = <GridOptions>{
                context: {
                    isGridReady: false,
                    translateService: this._translateService,
                    store: this.store,
                    parent: this,
                    actions: this.actions
                },
                serverSideFilteringAlwaysResets: true,
                serverSideSortingAlwaysResets: true,
                rowSelection: this.rowSelection,
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
                suppressRowClickSelection: true,
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
                    return data[this.CONSTANT_BASE.COLUMN.ID];
                },
                onRowClicked: (event: RowClickedEvent) => {
                    this.onRowClicked(event);
                },
                onSelectionChanged: (event: RowSelectedEvent) => {
                    this.gridOptions.api.refreshHeader();
                },
                onRowDoubleClicked: (async (event: RowDoubleClickedEvent) => {
                    if (this.store.isLoading) {
                        return;
                    }
                    await this.onRowDoubleClicked(event, ACTION.VIEW);
                }),
                onSortChanged: (event: SortChangedEvent) => {
                    this.onSortChanged(event);
                },
                onPaginationChanged: (event: PaginationChangedEvent) => {
                    this.gridOptions.api.deselectAll();
                    this.gridOptions.api.refreshHeader();
                },
                onRowEditingStopped: (event: RowEditingStoppedEvent) => {
                    // console.log('onRowEditingStopped', event.data);
                },
                onCellClicked: (async (event: CellClickedEvent) => {
                    if (this.store.isLoading) {
                        return;
                    }
                    this.onCellClicked(event);
                }),
                onGridReady: () => {
                    this.gridOptions.context.isGridReady = true;
                    const gridApi: GridApi = this.gridOptions.api;
                    gridApi.closeToolPanel();
                    gridApi.refreshHeader();
                    gridApi.setServerSideDatasource(this.dataSource);
                },
            };
        } catch (error) {
            console.log(error);
        }
    }

    /**
    * autoSizeAll
    * @param skipHeader
    */
    public autoSizeAll(skipHeader): void {
        const allColumnIds = [];
        this.gridOptions.columnApi.getAllColumns().forEach((column: any) => {
            allColumnIds.push(column.colId);
        });
        this.gridOptions.columnApi.autoSizeColumns(allColumnIds, skipHeader);
    }

    /**
     * Call back from actionCellClick in ActionCellRenderer Component
     * @param action action
     * @param row data
     */
    public actionCellClick(action: string, row): void {
        if (action === AG_GRID_CONSTANT.ACTIONS.UPDATE) {
            this.viewDetail(row, action);
        } else if (action === AG_GRID_CONSTANT.ACTIONS.DE_ACTIVE) {
            // this.disableUser(row);
        }
    }

    ngOnInit(): void {
        this.store.initPemision();
        this.buildGridOptions();
        Promise.all([
            this.store.getSchemaPivot(),
            this.store.getAccountUserAttribute().catch(() => undefined),
            this._i18nService.getMessagesTenant(FormConfigService.buildScreenId(this.screenID)).catch(() => undefined)
        ]).then(array => {
            this.initGridUI(array[0]);
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

    ngOnDestroy(): void {
        this.store.isFirstEnterSreen = true;
        this.store._unsubscribableArray.forEach(s => {
            if (s && s.unsubscribe) {
                s.unsubscribe();
            }
        });
    }

    async ngAfterViewInit(): Promise<void> {
        // this.store.initPemision();
        // Promise.all([
        //     this.store.getSchemaPivot(),
        //     this.store.getAccountUserAttribute().catch(() => undefined),
        // ]).then(array => {
        //     this.initGridUI(array[0]);
        // }).catch(error => {
        //     console.error('getSchema & getAccountUserAttribute', error);
        // });
        // this.buildGridOptions();


        // this.store._unsubscribableArray.push(this._translateService.onLangChange.subscribe((e: LangChangeEvent) => {
        //     this._i18nService.getMessagesTenant(FormConfigService.buildScreenId(this.screenID)).then(data => {
        //         if (this.gridOptions.context.isGridReady && this.gridOptions.api) {
        //             this.gridOptions.api.setColumnDefs(this.store._columnDefs);
        //             this.setUserAttributesToGrid();
        //             this.autoSizeAll(false);
        //         }
        //     });
        // }));
        // const { agGrid } = this;
        // try {
        //     this.store._unsubscribableArray.push(
        //         merge(agGrid.displayedColumnsChanged, agGrid.displayedColumnsWidthChanged)
        //             .pipe(
        //                 debounceTime(400),
        //                 map(event => (<AgGridEvent>event).columnApi.getColumnState()),
        //                 distinctUntilChanged(_.isEqual),
        //             )
        //             .subscribe(columnState => {
        //                 this.actionChangeColumn(columnState);
        //             })
        //     );
        // } catch (error) {
        //     console.log(error);
        // }
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
        await this.store.saveAccountUserAttribute({ columnState });
    }

    public hasRowSelected(): boolean {
        const gridApi = this.gridOptions.api;
        if (gridApi) {
            return gridApi.getSelectedNodes().length > 0;
        }
        return false;
    }

    async fullTextSearch(searchText: any): Promise<void> {
        this.store.fullTextSearch(searchText);
        this.refresh();
    }

    public changeNormalSearch(): void {
        this.store.changeNormalSearch();
        this.refresh();
    }

    public async refresh(): Promise<void> {
        this.gridOptions.api.refreshServerSideStore({ purge: true });
        setTimeout(async () => {
            const countValue = await this.store.pivotCountOnTitle().catch(() => undefined);
            if (this._utils.checkIsNotNull(countValue)) {
                this.setPivotCountOnTitle(countValue);
            }
        }, 500);
    }

    public openFilter(): void {

    }

    public viewDetail(row, action): void {
    }

    async onCellClicked(event: CellClickedEvent): Promise<any> {
        this.onCellClicked(event);
    }

    public async onRowDoubleClicked(event: RowDoubleClickedEvent, action: string): Promise<any> {

    }

    public onFilterChanged(event: FilterChangedEvent): void {
        // console.log('onFilterChanged', event.api.getFilterModel());
    }

    public onSortChanged(event: FilterChangedEvent): void {
        // console.log('onSortChanged', event.api.getFilterModel());
    }

    public onRowClicked(event: RowClickedEvent): void {

    }

}
