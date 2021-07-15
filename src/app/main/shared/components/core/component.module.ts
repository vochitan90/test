
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MobxAngularModule } from 'mobx-angular';
import { ProfileDialogComponent } from '../component/profile/profile.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CovalentDialogsModule } from '../component/dialogs';
import { NotificationComponent } from '../component/notification-component/notification.cmp.component';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { FuseSearchBarModule } from '@fuse/components';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { ChangePassDialogComponent } from '../component/change-pass/change-pass.component';
import { agGridFrameworkComponents } from '../component/ag-grid/AgGridFrameworkComponents';
@NgModule({
    declarations: [
         ...agGridFrameworkComponents, ProfileDialogComponent, NotificationComponent, ChangePassDialogComponent
        
    ],
    imports: [MatSlideToggleModule, MatExpansionModule, CommonModule, CovalentDialogsModule, MatIconModule, MatToolbarModule, MatButtonModule,
        MatListModule, MatSidenavModule, TranslateModule.forChild(), MobxAngularModule, MatCardModule, MatMenuModule,
        MatTooltipModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
        FlexLayoutModule, MatProgressSpinnerModule,
        FuseSearchBarModule, MatProgressButtonsModule, MatRadioModule,
        MatSelectModule, MatTableModule, MatTabsModule,
        AgGridModule.withComponents([]),
    ],
    exports: [
        ...agGridFrameworkComponents, ProfileDialogComponent, NotificationComponent, ChangePassDialogComponent
      
    ],
    entryComponents: [
        ...agGridFrameworkComponents, ProfileDialogComponent, NotificationComponent, ChangePassDialogComponent
        
    ],
    providers: [
    ]
})
export class SharedComponentsModule {
}
