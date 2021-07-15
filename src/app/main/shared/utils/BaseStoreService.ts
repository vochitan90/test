import { Injectable } from '@angular/core';
import { IPermision } from 'app/main/models/permision';
import { GRID_ATTRIBUTES, transformRequestBeforeQuery } from 'app/main/shared/utils/GridService';
import * as _ from 'lodash';
import { action, computed, observable } from 'mobx';
import { Unsubscribable } from 'rxjs';
import { AppState, UtilCommon } from '..';
@Injectable({
    providedIn: 'root'
})
export class BaseStoreService {
    @observable public isLoading = false;
    public _columnDefs: any[] = null;
    public _unsubscribableArray: Array<Unsubscribable> = [];
    public _entitySchema: any = null;

    @observable public scrollTopPage = 0;
    public screenUserAttribute: any;
    @observable public fullText = '';
    @observable public searchMode = 0; // 0-normal, 1-fullText.
    public lastRequest: any;
    public normalFilterModel: any;
    public columnState;

    public permissions: IPermision;
    public isFirstEnterSreen = true;
    public screen: string;
    public gridConfigs;
    constructor(
        public workFlowService: any,
        public _utils: UtilCommon,
        public _appState: AppState) {
    }

    initPemision(): void {
        if (!this._utils.checkIsNotNull(this.permissions)) {
            this.permissions = {};
        }
    }

    public buildGridAttribute(): any {
        return {
            lastRequest: this.lastRequest,
            searchMode: this.searchMode,
            fullText: this.fullText,
            normalFilterModel: this.normalFilterModel,
            columnState: this.columnState,
        };
    }

    public buildFullTexSearchRequest(request: any, fullText: string = ''): any {
        let filterModel: any = {};
        if (fullText && fullText.length > 0) {
            filterModel = {
                ftsValue: {
                    type: 'contains',
                    filter: fullText,
                    filterType: 'text'
                }
            };
        }
        return {
            ...request,
            filterModel,
        };
    }

    @action
    setScrollPosition(positionY: number): void {
        this.scrollTopPage = positionY;
    }

    @action
    setLoading(value: boolean): void {
        this.isLoading = value;
    }

    @action
    fullTextSearch(searchText: string): void {
        this.fullText = searchText;
        this.searchMode = 1;
    }

    changeNormalSearch(): void {
        this.searchMode = 0;
        this.fullText = '';
    }

    getSchemaPivot(): Promise<any> {
        return this.workFlowService.getSchemaPivot();
    }

    getLanguageForm(): Promise<any> {
        return this.workFlowService.getLanguageForm(this.screen);
    }


    updateStateForColumn(defaultColState: any[]): void {
        const { addColDefs = [], visibleCols = [], colsOrder = {} } = this.gridConfigs;
        let { columnState } = this;

        if (!columnState) { // first time, set visible for all columns
            _.forEach(defaultColState, cs => {
                cs.hide = visibleCols.indexOf(cs.colId) < 0;
            });
            columnState = defaultColState;
            this.columnState = columnState;

            columnState.sort(
                (a, b) => ((colsOrder[a.colId] || 99999) - (colsOrder[b.colId] || 99999)) ||
                    ((a.colId || '').localeCompare(b.colId))
            );
        } else { // other times, add new ColumnState and set visible for it.
            _.forEach(addColDefs, cf => {
                if (!_.find(columnState, cs => cs.colId === cf.field)) {
                    const colState = _.find(defaultColState, cs => cs.colId === cf.field);
                    colState.hide = visibleCols.indexOf(colState.colId) < 0;
                    columnState.push(colState);
                }
            });
        }

        this.screenUserAttribute = this.buildGridAttribute();
    }

    getAccountUserAttribute(): Promise<any> {
        return this.workFlowService.getProcessUploadUserAttribute().then(screenUserAttribute => {
            this.screenUserAttribute = screenUserAttribute || {};
            const { delCols = [] } = this.gridConfigs;
            if (this.delCols().length > 0) {
                for (const delCol of this.delCols()) {
                    delCols.push(delCol);
                }
            }
            if (this.screenUserAttribute.columnState) {
                if (delCols.length > 0) {
                    _.filter(this.screenUserAttribute.columnState, cs => delCols.indexOf(cs.colId) < 0);
                }
            }
            if (this.screenUserAttribute.normalFilterModel) {
                _.forEach(delCols, c => {
                    delete this.screenUserAttribute.normalFilterModel[c];
                });
            }

            this.lastRequest = this.screenUserAttribute.lastRequest || {};
            this.normalFilterModel = this.screenUserAttribute.normalFilterModel;
            this.columnState = this.screenUserAttribute.columnState;
            this.searchMode = this.screenUserAttribute.searchMode || 0;
            this.fullText = this.screenUserAttribute.fullText || '';
            return this.screenUserAttribute;
        });
    }

    saveAccountUserAttribute(obj: any, saveInStore: boolean = true): Promise<any> {
        if (saveInStore) {
            _.forEach(_.pick(obj, GRID_ATTRIBUTES), (value, key) => {
                this[key] = value;
            });
        }
        return this.workFlowService.setProcessUploadUserAttribute(JSON.stringify({
            ...this.screenUserAttribute,
            ...obj,
        }));
    }

    pivotPaging(request: any): Promise<any> {
        this.normalFilterModel = request.filterModel;
        if (this.isFullTextSearchMode) {
            request = this.buildFullTexSearchRequest(request, this.fullText);
        }
        this.lastRequest = request;
        this.screenUserAttribute = this.buildGridAttribute();
        this.isLoading = true;
        const res = transformRequestBeforeQuery(request);
        return this.workFlowService.pivotPaging(transformRequestBeforeQuery(request))
            .then(data => {
                this.isLoading = false;
                return data;
            }).catch(error => {
                this.isLoading = false;
                throw error;
            });
    }

    pivotCountOnTitle(): Promise<any> {
        const lastRequest = this.lastRequest;
        return this.workFlowService.pivotCount(transformRequestBeforeQuery(lastRequest));
    }

    getSortModel(): any {
        return this.lastRequest.sortModel;
    }

    @computed
    get isFullTextSearchMode(): boolean {
        return this.searchMode === 1;
    }


    @computed
    get isFullTextSearchModeContract(): boolean {
        return this.searchMode === 1;
    }

    public delCols(): any {
        return [
           
        ];
    }

    cellRenderer(){

    }

    public autoSizeAll(skipHeader, gridOptions): void {
        const allColumnIds = [];
        gridOptions.columnApi.getAllColumns().forEach((column: any) => {
            allColumnIds.push(column.colId);
        });
        gridOptions.columnApi.autoSizeColumns(allColumnIds, skipHeader);
    }

}
