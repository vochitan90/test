import { Component } from "@angular/core";
import { IFilterAngularComp } from "ag-grid-angular";
import { IDoesFilterPassParams, IFilterParams } from 'ag-grid-community';
import { Subject, BehaviorSubject, Observable } from "rxjs";
import { debounceTime, tap } from "rxjs/operators";

@Component({
  selector: "td-set-filter",
  templateUrl: "./td-set-filter.component.html"
})
export class TDSetFilterComponent implements IFilterAngularComp {
  private static readonly rowHeight: number = 28;

  private filterDatas: Array<any>;
  private model: Array<string>;
  private uniqueCheck: object;
  private filterParams: IFilterParams;
  private fieldId: string;
  private filterList: Array<any>;
  private ngUnsubscribe: Subject<any>;

  /**
   * Indicator to check if all items are selected
   */
  isEverythingSelected: boolean;
  /**
   * The height of the container holding our list of unique values
   * for the given column. The height is determined by the number of
   * items * rowHeight (28px);
   */
  containerHeight: number;
  /**
   * Using an object to store our selected values. The lookup will be
   * faster on a simple object, then using an array to filter or using a Map.
   */
  selectedValuesMap: object;
  /**
   * Holds our list of values for the user to select from.
   */
  onFilterListChange$: BehaviorSubject<string[]>;
  onFilterValuesChanged$: Observable<string[]>;

  
  agInit(params: IFilterParams): void {

    this.filterParams = params;
    this.uniqueCheck = {};
    this.selectedValuesMap = {};
    this.filterList = new Array<string>();
    this.filterDatas = params.colDef.filterParams;
    this.fieldId = params.colDef.field;
   
    this.onFilterListChange$ = new BehaviorSubject<string[]>([]);
    this.ngUnsubscribe = new Subject<any>();

    this.onFilterValuesChanged$ = this.onFilterListChange$
      .pipe(
        debounceTime(250),
        tap(values => this.sortValues(values)),
        tap(values => this.setContainerHeight())
      );

    this.setUniqueValues();
    this.selectEverything();
  }

  setUniqueValues() {
    for(let item of this.filterDatas){
        if (!this.isValueValid(item.key)) {
            return;
          }
      
          if (this.uniqueCheck[item.key]) {
            return;
          }

        this.filterList.push(item);
        this.onFilterListChange$.next([...this.filterList]);
        this.uniqueCheck[item.key] = 1;
    }
  }

  toggleItem(value: string) {
    if (this.selectedValuesMap[value]) {
      delete this.selectedValuesMap[value];
    } else {
      this.selectedValuesMap[value] = 1;
    }

    this.isEverythingSelected =
      Object.keys(this.selectedValuesMap).length === this.filterList.length;

    this.onFilterChanged();
  }

  toggleEverything() {
    this.isEverythingSelected = !this.isEverythingSelected;
    if (this.isEverythingSelected) {
      this.selectEverything();
    } else {
      this.unselectEverything();
    }
    this.onFilterChanged();
  }

  isFilterActive(): boolean {
      let value = Object.keys(this.selectedValuesMap).length > 0 && !this.isEverythingSelected;
     return Object.keys(this.selectedValuesMap).length > 0 && !this.isEverythingSelected;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    const node = params.node;
    if (!node.data) {
      return false;
    }

    const nodeValue = params.data[this.fieldId];
    if (!this.isValueValid(nodeValue)) {
      return false;
    }

    // check if current row node value exists in our selectedValuesMap
    return Boolean(this.selectedValuesMap[nodeValue]);
  }

  //The grid will pass undefined/null to clear the filter.
  getModel() {
    if(this.isEverythingSelected){
        return null;
    }

    let valueFilter:any = [];
    for(let item of this.filterDatas){
        if(this.selectedValuesMap[item.key] === 1){
            valueFilter.push(item.key);
        }
    }
    if(valueFilter.length == 0){
        return null;
    }

    let model = {
        type:'equals',
        values:valueFilter,
        filterType:'set'
    };
    return model;
  }

  onFilterChanged() {
    this.filterParams.filterChangedCallback();
  }

  setModel(value: string) {
    // this.unselectEverything();
    // this.selectedValuesMap[value] = 1;
    // this.addUniqueValueIfMissing(value);
  }

  destroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private setContainerHeight() {
    this.containerHeight =
      this.filterList.length * TDSetFilterComponent.rowHeight;
  }

  private sortValues(values: string[]) {
    values.sort();
  }

  private selectEverything() {
    this.filterList.forEach(value => (this.selectedValuesMap[value.key] = 1));
    this.isEverythingSelected = true;
  }

  private unselectEverything() {
    this.selectedValuesMap = {};
    this.isEverythingSelected = false;
  }


  private isValueValid(value: string) {
    if (value === "" || value === undefined || value === null) {
      return false;
    }

    return true;
  }
}
