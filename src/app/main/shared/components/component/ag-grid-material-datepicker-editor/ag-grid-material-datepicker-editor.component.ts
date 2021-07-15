import { Component } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ICellEditorParams } from 'ag-grid-community';

@Component({
    selector: 'ag-grid-material-datepicker-editor',
    template: `
        <mat-form-field>
            <input matInput [matDatepicker]="picker" [formControl]="dateControl" disabled (dateChange)="onChangeDate($event)" (keydown)="onKeyDown($event)">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker disabled="false"></mat-datepicker>
        </mat-form-field>
    `,
    styleUrls: ['./ag-grid-material-datepicker-editor.component.scss'],
})
export class AgGridMaterialDatepickerEditorComponent implements AgEditorComponent {
    private _params: ICellEditorParams;
    public dateControl = new FormControl('', []);

    constructor() {
    }

    isPopup(): boolean {
        return false;
    }

    isCancelBeforeStart(): boolean {
        return false;
    }

    isCancelAfterEnd(): boolean {
        return false;
    }

    agInit(_params: any): void {
        this._params = _params;
        this.dateControl.setValue(moment(_params.value).toDate());
        if (this._params['required']) {
            this.dateControl.setValidators([Validators.required]);
        }
        console.log('AgGridMaterialDatepickerEditorComponent, agInit, _params: ', this._params, 'formatValue=' + this.dateControl.value);
    }

    getValue(): number {
        console.log('AgGridMaterialDatepickerEditorComponent, getValue: ' + moment(this.dateControl.value).valueOf());
        return moment(this.dateControl.value).valueOf();
    }

    onChangeDate(e): void {
        console.log('AgGridMaterialDatepickerEditorComponent, onChangeDate', this.dateControl.value);
    }

    onKeyDown(e: KeyboardEvent): void {
        console.log('AgGridMaterialDatepickerEditorComponent, onKeyDown', e);
        switch (e.key) {
            case 'Enter':
                if (!this.dateControl.valid) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                break;
        }
    }
}
