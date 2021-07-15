import { IOrgInfo } from './../models/org-info.interface';

import { ACTION, AG_GRID_CONSTANT, SCREEN_CONSTANT } from './../../../shared/const/app.constant';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, FilterChangedEvent, GridApi, GridOptions, PaginationChangedEvent, RowClickedEvent, RowDoubleClickedEvent, RowEditingStoppedEvent, RowSelectedEvent, SortChangedEvent } from 'ag-grid-community';
import { BaseComponent } from 'app/main/shared/components/component/base-component/base.component';
import { TdDialogService } from 'app/main/shared/components/component/dialogs/services/dialog.service';
import { I18nService } from 'app/main/shared/utils/I18nService';
import { UtilCommon } from 'app/main/shared/utils/UtilCommon';
import { UtilComponent } from 'app/main/shared/utils/UtilComponent';
import { OrgInfoStore } from '../org-info.store';
import { getAgGridFrameworkComponents } from 'app/main/shared/components/component/ag-grid/AgGridFrameworkComponents';
import { ORG_INFO_CONSTANT } from '../org-info.constant';
import { OrgInfoDataSource } from '../org-info.datasource';
import ColumnDefFactory from 'app/main/shared/ag-grid/ColumnDefFactory';
import { CreateOrgInfoComponent } from '../components/create/create.component';
import { DetailOrgInfoDialogComponent } from '../components/detail_dialog/detail-dialog.component';
import { Action } from 'rxjs/internal/scheduler/Action';
import { OrgInfoService } from '../org-info.service';


@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent {

    //private _addDialogRef: MatDialogRef<CreateOrgInfoComponent>;
    private _detailsDialogRef: MatDialogRef<DetailOrgInfoDialogComponent>;
    @ViewChild(AgGridAngular) agGrid: AgGridAngular;

    screenID = ORG_INFO_CONSTANT.SCREEN.ID;

    constructor(
        private _orgInfoService: OrgInfoService,
        public _changeDetectorRef: ChangeDetectorRef,
        public _dialogService: TdDialogService,
        public _route: ActivatedRoute,
        public _translateService: TranslateService,
        public _utils: UtilCommon,
        public _utilComponent: UtilComponent,
        public _i18nService: I18nService,
        public _matDialog: MatDialog,
        public store: OrgInfoStore) {
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
                    actions: [
                        { action: AG_GRID_CONSTANT.ACTIONS.UPDATE, icon: 'edit', name: 'CONTROL.EDIT', screen: SCREEN_CONSTANT.TEMPLATE },
                        { action: AG_GRID_CONSTANT.ACTIONS.ACTIVE, icon: 'analytics', name: 'CONTROL.UPDATE_AUTH_STATUS', screen: SCREEN_CONSTANT.TEMPLATE },
                        { action: AG_GRID_CONSTANT.ACTIONS.DOWNLOAD, icon: 'download', name: 'CONTROL.DOWNLOAD', screen: SCREEN_CONSTANT.TEMPLATE },
                        { action: AG_GRID_CONSTANT.ACTIONS.SEE_ALL_OLD_VERSION, icon: 'visibility', name: 'CONTROL.SEE_ALL_VERSION', screen: SCREEN_CONSTANT.TEMPLATE },
                    ],
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
                    return data[ORG_INFO_CONSTANT.COLUMN.ID];
                },
                onRowClicked: (event: RowClickedEvent) => {
                    this.store.isRowSelected = true;
                    // this._changeDetectorRef.detectChanges();
                },
                onSelectionChanged: (event: RowSelectedEvent) => {
                    var selectedRows = this.gridOptions.api.getSelectedRows();
                    console.log(selectedRows);
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
                    gridApi.setServerSideDatasource(new OrgInfoDataSource(this.store, this.gridOptions));
                },
            };
        } catch (error) {
            console.log(error);
        }
    }

    viewDetail(_action: string = ACTION.CREATE, data: IOrgInfo = null): void {
        try {
            this._detailsDialogRef = this._matDialog.open(DetailOrgInfoDialogComponent, {
                panelClass: 'org-info-dialog',
                data: {
                    action: _action,
                    data: data
                },
                id: 'detailOrgInfo',
                disableClose: true,
                width: '85%',
            });
            this._detailsDialogRef.afterClosed().subscribe((isSuccess: boolean) => {
                if (isSuccess) {
                    this.refresh();
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    add(): void {
        this._utils.routingPageChild(ORG_INFO_CONSTANT.LINK.CREATE, this._route);
    }

    edit(): void {

        const selectedRowNodes = this.gridOptions.api.getSelectedNodes();
        if (selectedRowNodes.length > 0) {
            const itemId = selectedRowNodes.map(row => row.data[ORG_INFO_CONSTANT.COLUMN.ID])[0] || '';
            //const data = 
            this._detailsDialogRef = this._matDialog.open(DetailOrgInfoDialogComponent, {
                panelClass: 'org-info-dialog',
                data: {
                    action: ACTION.UPDATE,
                    data: selectedRowNodes[0].data,
                },
                id: 'matDialogDetails',
                disableClose: false,
                width: '85%',
            });
            this._detailsDialogRef.afterClosed().subscribe((isSuccess: boolean) => {
                if (isSuccess) {
                    //this.gridOptions.api.refreshServerSideStore({ purge: true });
                    this.refresh();
                }
            });

            // this._utils.routingPageChild(ACCOUNTING_TERM_CONSTANT.LINK.DETAIL_PAGE, this._route, {id: itemId});
        }

    }

    delete(): void{
        const selectedRowNodes = this.gridOptions.api.getSelectedNodes();
        if (selectedRowNodes.length > 0) {
            this._dialogService.openConfirm({
                title: this._translateService.instant('DIALOG.CONFIRM_TITLE'),
                message: this._translateService.instant('DIALOG.CONFIRM_DELETE_K_ROWS_MESSAGE', {k: selectedRowNodes.length}),
                cancelButton: this._translateService.instant('CONTROL.NO'),
                acceptButton: this._translateService.instant('CONTROL.YES'),
                width: '400px',
            }).afterClosed().subscribe((accept: boolean) => {
                if (accept) {
                    const itemId = selectedRowNodes.map(row => row.data[ORG_INFO_CONSTANT.COLUMN.ID])[0] || '';
                    this._orgInfoService.deleteOrgInfo(itemId).then((value: any) => {
                        this._utilComponent.showTranslateSnackbar('DELETE_SUCCESS');
                        selectedRowNodes.forEach(row => row.setSelected(false));
                        setTimeout(() => {
                            this.refresh();
                            //this.gridOptions.api.refreshServerSideStore({ purge: true });
                        }, 0);
                    })
                }
            });
        }
    }
}
