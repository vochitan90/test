import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
    CellClickedEvent, FilterChangedEvent, GridApi, GridOptions, PaginationChangedEvent,
    RowClickedEvent, RowDoubleClickedEvent, RowEditingStoppedEvent, RowSelectedEvent, SortChangedEvent
} from 'ag-grid-community';
import { FormConfigService } from 'app/main/shared';
import ColumnDefFactory from 'app/main/shared/ag-grid/ColumnDefFactory';
import { getAgGridFrameworkComponents } from 'app/main/shared/components/component/ag-grid/AgGridFrameworkComponents';
import { BaseComponent } from 'app/main/shared/components/component/base-component/base.component';
import { TdDialogService } from 'app/main/shared/components/component/dialogs/services/dialog.service';
import { ACTION } from 'app/main/shared/const/app.constant';
import { I18nService } from 'app/main/shared/utils/I18nService';
import { UtilCommon } from 'app/main/shared/utils/UtilCommon';
import { UtilComponent } from 'app/main/shared/utils/UtilComponent';
import { CONFIRM_INCOME_TAX_CONSTANT } from '../confirm-income-tax.constant';
import { ConfirmIncomeTaxDataSource } from '../confirm-income-tax.datasource';
import { ConfirmIncomeTaxService } from '../confirm-income-tax.service';
import { ConfirmIncomeTaxStore } from '../confirm-income-tax.store';
import { DetailConfirmIncomeTaxDialogComponent } from './../components/detail_dialog/detail-dialog.component';
import { IConfirmIncomeTax } from './../models/confirm-income-tax';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent {

    private _detailsDialogRef: MatDialogRef<DetailConfirmIncomeTaxDialogComponent>;
    @ViewChild(AgGridAngular) agGrid: AgGridAngular;
    CONSTANT_BASE = CONFIRM_INCOME_TAX_CONSTANT;
    showColumnAction = false;
    screenID = CONFIRM_INCOME_TAX_CONSTANT.SCREEN.ID;

    disableEditButton: boolean = true;
    listBU = [];

    constructor(
        public _changeDetectorRef: ChangeDetectorRef,
        private _confirmIncomeTaxService: ConfirmIncomeTaxService,
        public _dialogService: TdDialogService,
        public _route: ActivatedRoute,
        public _translateService: TranslateService,
        public _utils: UtilCommon,
        public _utilComponent: UtilComponent,
        public _i18nService: I18nService,
        public _matDialog: MatDialog,
        public store: ConfirmIncomeTaxStore) {
        super(_changeDetectorRef, _dialogService, _translateService, _utils, _utilComponent, _i18nService, store);
    }

    // START Override
    ngOnInit(): void {
        this.store.initPemision();
        this.buildGridOptions();
        Promise.all([
            this.store.getSchemaPivot(),
            this.store.getAccountUserAttribute().catch(() => undefined),
            this._i18nService.getMessagesTenant(FormConfigService.buildScreenId(this.screenID)).catch(() => undefined),
            this.store.getListBusinessUnitActiveForUser().catch(() => undefined)
        ]).then(array => {
            this.initGridUI(array[0]);
            this.listBU = array[3];
            if (this.listBU.length === 1) {
                this.store.selectedBuIdNew = this.listBU[0].id;
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

    buildGridOptions(): void {
        try {
            this.gridOptions = <GridOptions>{
                context: {
                    isGridReady: false,
                    translateService: this._translateService,
                    store: this.store,
                    parent: this,
                    // actions: [
                    //     { action: AG_GRID_CONSTANT.ACTIONS.UPDATE, icon: 'edit', name: 'CONTROL.EDIT' , screen : SCREEN_CONSTANT.TEMPLATE },
                    //     { action: AG_GRID_CONSTANT.ACTIONS.ACTIVE, icon: 'analytics', name: 'CONTROL.UPDATE_AUTH_STATUS' , screen : SCREEN_CONSTANT.TEMPLATE },
                    //     { action: AG_GRID_CONSTANT.ACTIONS.DOWNLOAD, icon: 'download', name: 'CONTROL.DOWNLOAD' , screen : SCREEN_CONSTANT.TEMPLATE},
                    //     { action: AG_GRID_CONSTANT.ACTIONS.SEE_ALL_OLD_VERSION, icon: 'visibility', name: 'CONTROL.SEE_ALL_VERSION' , screen : SCREEN_CONSTANT.TEMPLATE},
                    // ],
                },
                serverSideFilteringAlwaysResets: true,
                serverSideSortingAlwaysResets: true,
                rowSelection: 'single',
                rowMultiSelectWithClick: false,
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
                    return data[CONFIRM_INCOME_TAX_CONSTANT.COLUMN.ID];
                },
                onRowClicked: (event: RowClickedEvent) => {
                    this.store.isRowSelected = true;
                    if(event.data.status != 0){
                        this.disableEditButton = true;
                    }else{
                        this.disableEditButton = false;
                    }
                    this._changeDetectorRef.detectChanges();
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
                    // const row = event.data as ITemplate;
                    // const colId = event.column[AG_GRID_CONSTANT.COLD_ID];
                    // if(colId === TEMPLATE_CONSTANT.COLUMN.DOWNLOAD && row.id){
                    //     await this.store.downloadFile(row.id, row.name);
                    // }else if(colId === TEMPLATE_CONSTANT.COLUMN.SEE_ALL_OLD_VERSION && row.templateVersionId){
                    //     await this.oppenPageOldversion(row);
                    // } 
                }),
                onGridReady: () => {
                    this.gridOptions.context.isGridReady = true;
                    const gridApi: GridApi = this.gridOptions.api;
                    gridApi.closeToolPanel();
                    gridApi.refreshHeader();
                    gridApi.setServerSideDatasource(new ConfirmIncomeTaxDataSource(this.store, this.gridOptions));
                },
            };
        } catch (error) {
            console.log(error);
        }
    }

    viewDetail(_action: string = ACTION.CREATE, data: IConfirmIncomeTax = null): void {
        try {
            this._detailsDialogRef = this._matDialog.open(DetailConfirmIncomeTaxDialogComponent, {
                panelClass: 'detail-tax-income-letter-dialog',
                data: {
                    action: _action,
                    data: data
                },
                id: 'detailConfirmIncomeTax',
                disableClose: false,
                width: '60%'
            });
            this._detailsDialogRef.afterClosed().subscribe((isSuccess: boolean) => {
                if (isSuccess) {
                    this.refresh();
                    //this.gridOptions.api.refreshServerSideStore({ purge: true });
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    add(): void {
        this._utils.routingPageChild(CONFIRM_INCOME_TAX_CONSTANT.LINK.CREATE, this._route);
    }

    edit(_action: string = ACTION.CREATE, data: IConfirmIncomeTax = null): void {

        const selectedRowNodes = this.gridOptions.api.getSelectedNodes();
        // if (selectedRowNodes.length > 0) {
        const itemId = selectedRowNodes.map(row => row.data[CONFIRM_INCOME_TAX_CONSTANT.COLUMN.ID])[0] || '';
        this._detailsDialogRef = this._matDialog.open(DetailConfirmIncomeTaxDialogComponent, {
            panelClass: 'detail-tax-income-letter-dialog',
            data: {
                action: ACTION.UPDATE,
                data: selectedRowNodes[0].data,
            },
            id: 'editConfirmIncomeTax',
            disableClose: false,
            width: '60%'
        });
        this._detailsDialogRef.afterClosed().subscribe((isSuccess: boolean) => {
            if (isSuccess) {
                //this.gridOptions.api.refreshServerSideStore({ purge: true });
                this.refresh();
            }
        });

        // this._utils.routingPageChild(ACCOUNTING_TERM_CONSTANT.LINK.DETAIL_PAGE, this._route, {id: itemId});
        // }
    }

    delete(): void {
        const selectedRowNodes = this.gridOptions.api.getSelectedNodes();
        if (selectedRowNodes.length > 0) {
            this._dialogService.openConfirm({
                title: this._translateService.instant('DIALOG.CONFIRM_TITLE'),
                message: this._translateService.instant('DIALOG.CONFIRM_DELETE_K_ROWS_MESSAGE', { k: selectedRowNodes.length }),
                cancelButton: this._translateService.instant('CONTROL.NO'),
                acceptButton: this._translateService.instant('CONTROL.YES'),
                width: '400px',
            }).afterClosed().subscribe((accept: boolean) => {
                if (accept) {
                    const itemId = selectedRowNodes.map(row => row.data[CONFIRM_INCOME_TAX_CONSTANT.COLUMN.ID])[0] || '';
                    this._confirmIncomeTaxService.deleteCIT(itemId).then((value: any) => {
                        this._utilComponent.showTranslateSnackbar('DELETE_SUCCESS');
                        selectedRowNodes.forEach(row => row.setSelected(false));
                        setTimeout(() => {
                            this.refresh();
                            //this.gridOptions.api.refreshServerSideStore({ purge: true });
                        }, 0);
                    });
                }
            });
        }
    }

}
