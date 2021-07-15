import { Component } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular/lib/interfaces';
import { IAfterGuiAttachedParams, IHeaderParams } from 'ag-grid-community';

@Component({
    selector: 'app-custom-header-checkbox',
    template: `
    <div fxLayout="row">
        <div class="ag-header-select-all ag-labeled ag-label-align-right ag-checkbox ag-input-field">
            <div ref="eWrapper" [class.ag-checked]="isCheckAllCurrentPage" class="ag-wrapper ag-input-wrapper ag-checkbox-input-wrapper " role="presentation">
                <input ref="eInput" [checked]="isCheckAllCurrentPage" (change)="checkBoxHandel($event)" class="ag-input-field-input ag-checkbox-input" type="checkbox" id="ag-23-input" aria-label="Press Space to toggle all rows selection (unchecked)" tabindex="-1">
            </div>
        </div>
        <div class="ag-cell-label-container" role="presentation">
            <div ref="eLabel" class="ag-header-cell-label" role="presentation" unselectable="on">
                <span ref="eText" class="ag-header-cell-text" unselectable="on">{{displayName}}</span>
                <span ref="eFilter" class="ag-header-icon ag-header-label-icon ag-filter-icon ag-hidden" aria-hidden="true">
                    <span class="ag-icon ag-icon-filter" unselectable="on" role="presentation"></span>
                </span>
            </div>
        </div>
    <div>
    `
})
export class CustomHeaderCheckboxComponent implements IHeaderAngularComp {

    private params: any;
    public displayName = '';
    public isCheckAllCurrentPage = false;
    constructor() { }
    refresh(params: IHeaderParams): any {
        // alert('refresh Header');
        // throw new Error('Method not implemented.');
    }
    afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
        throw new Error('Method not implemented.');
    }

    agInit(params: any): void {
        if (params && params.displayName) {
            this.displayName = params.displayName;
        }
        this.params = params;
        this.checkCurrentPage(true);
    }

    checkBoxHandel(evt): void {
        this.checkCurrentPage(false);
    }

    // selectAllRowHandel(checkValue: boolean): void {
    //     // Cách 1 check tất cả page
    //     // this.params.api.forEachNode((node: any) => {
    //     //     node.setSelected(checkValue);
    //     // });
    // }

    /**
     * 
     * @param mode true: check when init , false: checkAll button handle
     */
    checkCurrentPage(mode: boolean): void {
        const rowCount = this.params.api.getDisplayedRowCount();
        const lastGridIndex = rowCount - 1;
        const currentPage = this.params.api.paginationGetCurrentPage();
        const pageSize = this.params.api.paginationGetPageSize();
        const startPageIndex = currentPage * pageSize;
        let endPageIndex = (currentPage + 1) * pageSize - 1;

        if (endPageIndex > lastGridIndex) {
            endPageIndex = lastGridIndex;
        }

        if (mode) {
            // Count selected rows
            let cptSelected = 0;

            for (let i = startPageIndex; i <= endPageIndex; i++) {
                const rowNode = this.params.api.getDisplayedRowAtIndex(i);
                if (rowNode) {
                    cptSelected += rowNode.selected ? 1 : 0;
                }
            }
            // Check the checkbox if all the rows are selected
            const cptRows = endPageIndex + 1 - startPageIndex;
            this.isCheckAllCurrentPage = cptSelected && cptRows <= cptSelected;
        } else {
            this.isCheckAllCurrentPage = !this.isCheckAllCurrentPage;

            for (let i = startPageIndex; i <= endPageIndex; i++) {
                const rowNode = this.params.api.getDisplayedRowAtIndex(i);
                if (rowNode) {
                    rowNode.setSelected(this.isCheckAllCurrentPage);
                }
            }
        }
    }
}
