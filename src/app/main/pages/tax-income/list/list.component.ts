
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
    GridApi,
    GridOptions, PaginationChangedEvent,
    RowClickedEvent,
    RowDoubleClickedEvent, RowSelectedEvent
} from 'ag-grid-community';
import { getAgGridFrameworkComponents } from 'app/main/shared/components/component/ag-grid/AgGridFrameworkComponents';
import { BaseComponent } from 'app/main/shared/components/component/base-component/base.component';
import { ACTION, APP_CONSTANT } from 'app/main/shared/const/app.constant';
import { FormConfigService, I18nService, UtilCommon, UtilComponent } from '../../../shared';
import ColumnDefFactory from '../../../shared/ag-grid/ColumnDefFactory';
import { TdDialogService } from '../../../shared/components/component/dialogs';
import { DetailTaxIncomeComponent } from '../detail/detail.component';
import { ITaxIncome } from '../models/taxIncome.interface';
import { TAX_INCOME_CONSTANT } from '../taxIncome.constant';
import { TaxIncomeStore } from '../taxIncome.store';
import { UpdateTaxIncomeComponent } from '../update/update.component';
import { TaxIncomeNewDataSource } from './taxIncome.datasource';


@Component({
    selector: 'app-list-tax-income-new',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListTaxIncomeNewComponent extends BaseComponent implements OnInit {

    private _detailDialogRef: MatDialogRef<DetailTaxIncomeComponent>;
    private _updateDialogRef: MatDialogRef<UpdateTaxIncomeComponent>;
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
            this.store.getAccountUserAttribute(TAX_INCOME_CONSTANT.TAXINCOME_NEW_ATTRIBUTE).catch(() => undefined),
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

    async actionChangeColumn(columnState): Promise<void> {
        if (this.store.isFirstEnterSreen) {
            const countValue = await this.store.pivotCountOnTitle().catch(() => undefined);
            if (this._utils.checkIsNotNull(countValue)) {
                this.setPivotCountOnTitle(countValue);
            }
            this.store.isFirstEnterSreen = false;
            return;
        }
        await this.store.saveAccountUserAttribute({ columnState }, true, TAX_INCOME_CONSTANT.TAXINCOME_NEW_ATTRIBUTE);
    }

    public buildColumnDefs(dataSchema: any): void {
        this.store._entitySchema = dataSchema;
        this.store.gridConfigs.delCols = this.store.delColsIssuedDate();
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
                rowMultiSelectWithClick: false,
                rowSelection: 'multiple',
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
                    gridApi.setServerSideDatasource(new TaxIncomeNewDataSource(this.store, this.gridOptions));
                },
            };
        } catch (error) {
            console.log(error);
        }
    }


    add(): void {
        this._utils.routingPageChild(TAX_INCOME_CONSTANT.LINK.CREATE, this._route);
    }

    update(): void {
        const selectedRowNodes: any = this.gridOptions.api.getSelectedNodes();
        // if (!this.validateData(selectedRowNodes[0].data)) {
        //     return;
        // }
        this._updateDialogRef = this._matDialog.open(UpdateTaxIncomeComponent, {
            panelClass: 'detail-tax-income-dialog',
            data: {
                aggId: selectedRowNodes[0].data.aggId
            },
            id: 'detailTaxIncome',
            disableClose: true,
        });
        this._updateDialogRef.afterClosed().subscribe((isSuccess: boolean) => {
            if (isSuccess) {
                this.refresh();
            }
        });
    }

    issue(): void {
        const selectedRowNodes = this.gridOptions.api.getSelectedNodes();
        const msgConfirm = `${TAX_INCOME_CONSTANT.SCREEN.TAXINCOME}.CONFIRM_ISSUE_MESSAGE`;

        if (selectedRowNodes.length > 0) {
            this._dialogService.openConfirm({
                title: this._translateService.instant('DIALOG.CONFIRM_TITLE'),
                message: this._translateService.instant(msgConfirm, { k: '' }),
                cancelButton: this._translateService.instant('CONTROL.NO'),
                acceptButton: this._translateService.instant('CONTROL.YES'),
                width: '400px',
            }).afterClosed().subscribe((accept: boolean) => {
                if (accept) {
                    this.store.isLoading = true;
                    this.store.issue(selectedRowNodes.map(row => row.data[TAX_INCOME_CONSTANT.COLUMN.ID]))
                        .then(data => {
                            if (!this._utils.checkIsNotNull(data)) {
                                this._utilComponent.showTranslateSnackbar(`${TAX_INCOME_CONSTANT.SCREEN.TAXINCOME}.ISSUE_SUCCESS`);
                                selectedRowNodes.forEach(row => row.setSelected(false));
                                setTimeout(() => {
                                    this.refresh();
                                }, 0);
                            } else {
                                this._utilComponent.showTranslateSnackbar(`${TAX_INCOME_CONSTANT.SCREEN.TAXINCOME}.ISSUE_FAIL`, 'error');
                            }
                            this.store.isLoading = false;
                        }).catch(error => {
                            // console.error('delete fail!', error);
                            this.store.isLoading = false;
                            this._utilComponent.showTranslateSnackbar(`${TAX_INCOME_CONSTANT.SCREEN.TAXINCOME}.ISSUE_FAIL`, 'error');
                        });
                }
            });
        }

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

    delete(): void {
        const selectedRowNodes = this.gridOptions.api.getSelectedNodes();
        const msgConfirm = `${TAX_INCOME_CONSTANT.SCREEN.TAXINCOME}.CONFIRM_DELETE_MESSAGE`;

        if (selectedRowNodes.length > 0) {
            // if (!this.validateListData(selectedRowNodes, 'Chỉ được xóa chứng từ trạng thái mới lập')) {
            //     return;
            // }
            this._dialogService.openConfirm({
                title: this._translateService.instant('DIALOG.CONFIRM_TITLE'),
                message: this._translateService.instant(msgConfirm, { k: '' }),
                cancelButton: this._translateService.instant('CONTROL.NO'),
                acceptButton: this._translateService.instant('CONTROL.YES'),
                width: '400px',
            }).afterClosed().subscribe((accept: boolean) => {
                if (accept) {
                    this.store.isLoading = true;
                    this.store.delete(selectedRowNodes.map(row => row.data[TAX_INCOME_CONSTANT.COLUMN.ID]))
                        .then(data => {
                            if (!this._utils.checkIsNotNull(data)) {
                                this._utilComponent.showTranslateSnackbar(`${TAX_INCOME_CONSTANT.SCREEN.TAXINCOME}.DELETE_SUCCESS`);
                                selectedRowNodes.forEach(row => row.setSelected(false));
                                setTimeout(() => {
                                    this.refresh();
                                }, 0);
                            } else {
                                this._utilComponent.showTranslateSnackbar(`${TAX_INCOME_CONSTANT.SCREEN.TAXINCOME}.DELETE_FAIL`, 'error');
                            }
                            this.store.isLoading = false;
                        }).catch(error => {
                            // console.error('delete fail!', error);
                            this.store.isLoading = false;
                            this._utilComponent.showTranslateSnackbar(`${TAX_INCOME_CONSTANT.SCREEN.TAXINCOME}.DELETE_FAIL`, 'error');
                        });
                }
            });
        }
    }

    getRowSelectedLength(): number {
        const gridApi = this.gridOptions.api;
        if (gridApi) {
            return gridApi.getSelectedNodes().length;
        }
        return 0;
    }

    validateData(taxIncome: ITaxIncome): boolean {
        if (
            taxIncome.recordStatus === APP_CONSTANT.RECORD_STATUS_O
            // && taxIncome.authStatus === AUTH_STATUS_CONSTANT.M
            && taxIncome.status === TAX_INCOME_CONSTANT.STATUS.NEW
        ) {
            return true;
        }
        this._utilComponent.showTranslateSnackbar(`Chỉ được cập nhật thông tin chứng từ trạng thái mới lập`, 'error');
        return false;
    }

    validateListData(listTaxIncome: any[], messs): boolean {
        for (const item of listTaxIncome) {
            if (
                item.data.recordStatus !== APP_CONSTANT.RECORD_STATUS_O
                // || item.data.authStatus !== AUTH_STATUS_CONSTANT.M
                || item.data.status !== TAX_INCOME_CONSTANT.STATUS.NEW
            ) {
                this._utilComponent.showTranslateSnackbar(messs, 'error');
                return false;
            }
        }
        return true;
    }
}
