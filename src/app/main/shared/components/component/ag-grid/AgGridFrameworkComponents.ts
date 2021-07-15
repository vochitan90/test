import { AgGridMaterialDatepickerEditorComponent } from '../ag-grid-material-datepicker-editor/ag-grid-material-datepicker-editor.component';
import { AgGridMaterialInputEditorComponent } from '../ag-grid-material-input-editor/ag-grid-material-input-editor.component';
import { TDSetFilterComponent } from '../ag-grid-select-filter/td-set-filter.component';
import { ActionCellRenderer } from './ActionCellRenderer.component';
import { AvatarCellRendererComponent } from './AvatarCellRendererComponent';
import { CustomHeaderCheckboxComponent } from './CustomHeaderCheckbox.component';
import { NationalCellRendererComponent } from './NationalCellRendererComponent';

export const agGridFrameworkComponents = [
    AvatarCellRendererComponent,
    NationalCellRendererComponent,
    AgGridMaterialDatepickerEditorComponent,
    AgGridMaterialInputEditorComponent,
    CustomHeaderCheckboxComponent,
    ActionCellRenderer
];

export function getAgGridFrameworkComponents(): any {
    return {
        customColumnHeaderCheckbox: CustomHeaderCheckboxComponent,
        avatarCellRenderer: AvatarCellRendererComponent,
        nationalCellRenderer: NationalCellRendererComponent,
        tdSetFilter: TDSetFilterComponent,
        datePickerEditor: AgGridMaterialDatepickerEditorComponent,
        inputEditor: AgGridMaterialInputEditorComponent,
        actionCellRenderer: ActionCellRenderer,
    };
}
