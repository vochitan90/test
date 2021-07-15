import { action, computed, has, keys, observable, remove, set, toJS } from 'mobx';
import { SortField } from '../utils/LoadConfig';

export class DataTableStore {
    @observable private _dataArr: any[] = [];
    @observable public pageSize: number;
    @observable public pageIndex: number = 0;
    @observable public totalLength: number = 0;
    @observable public filterObj: any = null;
    public sort: SortField = null;
    public defaultFilters: any = null;

    constructor(defaultFilters: any, pageSize: number = 20, filters: any = {}, sort: SortField = null) {
        this.pageSize = pageSize;
        if (defaultFilters) {
            this.defaultFilters = defaultFilters;
        }
        this.filterObj = filters;
        this.sort = sort;
    }

    @action
    setPageSize(value: number): void {
        this.pageSize = value;
    }

    @action
    setPageIndex(value: number): void {
        this.pageIndex = value;
    }

    @action
    setTotalLength(value: number): void {
        this.totalLength = value;
    }

    setSort(sort: SortField): void {
        this.sort = sort;
    }

    setDefaultFilters(defaultFilters: any): void {
        this.defaultFilters = defaultFilters;
    }

    @computed
    get filterKeys(): any {
        return keys(this.filterObj);
    }

    @action
    addFilter(key: string): void {
        if (this.defaultFilters && this.defaultFilters[key] !== undefined && this.defaultFilters[key] !== null) {
            set(this.filterObj, key, this.defaultFilters[key]);
        } else {
            set(this.filterObj, key, '');
        }
    }

    @action
    removeFilter(key: string): void {
        remove(this.filterObj, key);
    }

    hasFilter(key: string): boolean {
        return has(this.filterObj, key);
    }

    @action
    setFilterValue(key: string, value: any): void {
        set(this.filterObj, key, value);
    }

    getFilterValue(key: string): any {
        return this.filterObj[key];
    }

    @action
    setDataArr(array: any[]): void {
        this._dataArr = array;
    }

    @computed
    get data(): any[] {
        return toJS(this._dataArr);
    }

    @action
    changePage(pageEvent: any): void {
        this.pageIndex = pageEvent.pageIndex;
        this.pageSize = pageEvent.pageSize;
    }

    @action
    removeAllFilter(): void {
        this.filterObj = [];
    }

    clearData(): void {
        this.pageIndex = 0;
        this.totalLength = 0;
        this.setDataArr([]);
        this.removeAllFilter();
    }
}
