import { Component } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular';
import { FormControl, Validators } from '@angular/forms';
import { ICellEditorParams } from 'ag-grid-community';

@Component({
    selector: 'ag-grid-material-input-editor',
    template: `
        <mat-form-field>
            <input matInput type="text" [formControl]="inputControl">
        </mat-form-field>
    `,
    styleUrls: ['./ag-grid-material-input-editor.component.scss'],
})
export class AgGridMaterialInputEditorComponent implements AgEditorComponent {
    _params: ICellEditorParams;
    public inputControl = new FormControl('', []);

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

    agInit(params: any): void {
        this._params = params;
        this.inputControl.setValue(params.value);
        // if (this._params['required']) {
        this.inputControl.setValidators([Validators.required]);
        // }
        console.log('agInit, params: ', this._params, 'value=' + params.value);
    }

    getValue(): number {
        console.log('AgGridMaterialInputEditor, getValue: ' + this.inputControl.value);
        return this.inputControl.value;
    }

    onKeyDown(e: KeyboardEvent): void {
        console.log('AgGridMaterialInputEditor, onKeyDown', e);
        switch (e.key) {
            case 'Enter':
                if (!this.inputControl.valid) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                break;
        }
    }
}
