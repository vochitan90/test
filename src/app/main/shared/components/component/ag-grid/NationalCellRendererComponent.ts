import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
    selector: 'national-cell-render',
    template: `<span><img *ngIf="imageUrl" [src]="imageUrl" class="contact-national" border="0"/></span>`,
    styles: []
})
export class NationalCellRendererComponent implements ICellRendererAngularComp {
    public imageUrl: string;
    public params: any;

    agInit(params: ICellRendererParams): void {
        this.params = params;
        const rowData: any = params.node && params.node.data;
        if (rowData) {
            const value = rowData[params.colDef.field];
            if (value) {
                this.imageUrl = 'https://flags.fmcdn.net/data/flags/mini/' + value.toLowerCase() + '.png';
            }
        }
    }

    refresh(): boolean {
        return false;
    }
}
