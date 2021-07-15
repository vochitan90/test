import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
    selector: 'avatar-cell-render',
    template: `<span><img *ngIf="imageUrl" [src]="imageUrl" class="contact-avatar" width="32" height="32" border="0"/></span>`,
    styles: []
})
export class AvatarCellRendererComponent implements ICellRendererAngularComp {
    public imageUrl: string;
    public params: any;

    agInit(params: ICellRendererParams): void {
        this.params = params;
        const rowData: any = params.node && params.node.data;
        if (rowData) {
            const picture = rowData[params.colDef.field];
            if (picture) {
                const pictures = JSON.parse(picture.value);
                this.imageUrl = pictures['thumbnail'] || pictures['medium'] || pictures['large']
                    || 'assets/assets/img/user.png';
            }
        }
    }

    refresh(): boolean {
        return false;
    }
}
