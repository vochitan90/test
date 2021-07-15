
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
import { getAgGridFrameworkComponents } from 'app/main/shared/components/component/ag-grid/AgGridFrameworkComponents';
import { BaseComponent } from 'app/main/shared/components/component/base-component/base.component';
import { ACTION } from 'app/main/shared/const/app.constant';
import { I18nService, UtilCommon, UtilComponent } from '../../../shared';
import ColumnDefFactory from '../../../shared/ag-grid/ColumnDefFactory';
import { TdDialogService } from '../../../shared/components/component/dialogs';
import { DetailReleaseRegistrationDialogComponent } from '../detail-dialog/detail-dialog.component';
import { IReleaseRegistration } from '../models/releaseRegistration.interface';
import { RELEASE_REGISTRATION_CONSTANT } from '../releaseRegistration.constant';
import { ReleaseRegistrationDataSource } from '../releaseRegistration.datasource';
import { ReleaseRegistrationService } from '../releaseRegistration.service';
import { ReleaseRegistrationStore } from '../releaseRegistration.store';
import { CancelUploadDialogComponent } from '../upload_dialog/upload-dialog.component';


@Component({
    selector: 'app-list-release-registration',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListReleaseRegistrationComponent extends BaseComponent {

    private _addDialogRef: MatDialogRef<DetailReleaseRegistrationDialogComponent>;
    private _uploadDialogRef: MatDialogRef<CancelUploadDialogComponent>;
    @ViewChild(AgGridAngular) agGrid: AgGridAngular;
    CONSTANT_BASE = RELEASE_REGISTRATION_CONSTANT;
    showColumnAction = false;
    screenID = RELEASE_REGISTRATION_CONSTANT.SCREEN.ID;

    disableEditButton: boolean = true;

    constructor(
        public _changeDetectorRef: ChangeDetectorRef,
        public _dialogService: TdDialogService,
        public _route: ActivatedRoute,
        public _translateService: TranslateService,
        public _utils: UtilCommon,
        public _utilComponent: UtilComponent,
        public _i18nService: I18nService,
        public _matDialog: MatDialog,
        private _releaseRegistrationService: ReleaseRegistrationService,
        public store: ReleaseRegistrationStore) {
        super(_changeDetectorRef, _dialogService, _translateService, _utils, _utilComponent, _i18nService, store);
    }


    buildGridOptions(): void {
        try {
            this.store.isRowSelected = false;
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
                    return data[RELEASE_REGISTRATION_CONSTANT.COLUMN.ID];
                },
                onRowClicked: (event: RowClickedEvent) => {
                    this.store.isRowSelected = true;
                    console.log(event.data);
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
                    // const row = event.data as IReleaseRegistration;
                    // const colId = event.column[AG_GRID_CONSTANT.COLD_ID];
                    // if(colId === RELEASE_REGISTRATION_CONSTANT.COLUMN.DOWNLOAD && row.id){
                    //     await this.store.downloadFile(row.id, row.name);
                    // }else if(colId === RELEASE_REGISTRATION_CONSTANT.COLUMN.SEE_ALL_OLD_VERSION && row.templateVersionId){
                    //     await this.oppenPageOldversion(row);
                    // } 
                }),
                onGridReady: () => {
                    this.gridOptions.context.isGridReady = true;
                    const gridApi: GridApi = this.gridOptions.api;
                    gridApi.closeToolPanel();
                    gridApi.refreshHeader();
                    gridApi.setServerSideDatasource(new ReleaseRegistrationDataSource(this.store, this.gridOptions));
                },
            };
            this._changeDetectorRef.detectChanges();
        } catch (error) {
            console.log(error);
        }
    }

    add(): void {
        this._utils.routingPageChild(RELEASE_REGISTRATION_CONSTANT.LINK.CREATE, this._route);
    }

    viewDetail(_action: string = ACTION.CREATE, data: IReleaseRegistration = null): void {
        try {
            this._addDialogRef = this._matDialog.open(DetailReleaseRegistrationDialogComponent, {
                panelClass: 'release-registry-dialog',
                data: {
                    action: _action,
                    data: data
                },
                id: 'detailReleaseRegistration',
                disableClose: false,
                width:'85%'
            });
            this._addDialogRef.afterClosed().subscribe((isSuccess: boolean) => {
                this.refresh();
            });
        } catch (error) {
            console.log(error);
        }
    }

    delete(): void {
        // this._uploadDialogRef = this._matDialog.open(CancelUploadDialogComponent, {
        //     panelClass: 'custom-dialog-default',
        //     data: {
        //         entitySchema: this.store._entitySchema,
        //     },
        //     id: 'demoDetailDialog',
        //     disableClose: true,
        //     width : '800px',
        //     height: '300px',
        //     autoFocus: false
        // });
        // this._uploadDialogRef.afterClosed().subscribe((isSuccess: boolean) => {
        //     if (isSuccess) {
        //         this.gridOptions.api.refreshServerSideStore({ purge: true });
        //     }
        // });

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
                    const itemId = selectedRowNodes.map(row => row.data[RELEASE_REGISTRATION_CONSTANT.COLUMN.ID])[0] || '';
                    this._releaseRegistrationService.deleteRR(itemId).then((value: any) => {
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

    edit(): void{
        try {

            const selectedRowNodes = this.gridOptions.api.getSelectedNodes();
            if (selectedRowNodes.length > 0) {
                const itemId = selectedRowNodes.map(row => row.data[RELEASE_REGISTRATION_CONSTANT.COLUMN.ID])[0] || '';
                //const data = 
                this._addDialogRef = this._matDialog.open(DetailReleaseRegistrationDialogComponent, {
                    panelClass: 'release-registry-dialog',
                    data: {
                        action: ACTION.UPDATE,
                        data: selectedRowNodes[0].data,
                    },
                    id: 'detailReleaseRegistration',
                    disableClose: false,
                    width:'85%'
                });
                this._addDialogRef.afterClosed().subscribe((isSuccess: boolean) => {
                    if (isSuccess) {
                        this.refresh();
                        //this.gridOptions.api.refreshServerSideStore({ purge: true });
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
}
