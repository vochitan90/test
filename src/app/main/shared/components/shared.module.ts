import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MATERIAL_MODULES } from './core/material.module';
import { SharedComponentsModule } from './core/component.module';

const ANGULAR_MODULES: any[] = [
    FormsModule, ReactiveFormsModule, HttpClientModule,
];

@NgModule({
    imports:[
        CommonModule,
        ANGULAR_MODULES,
        MATERIAL_MODULES,
        MatMomentDateModule,
        SharedComponentsModule
    ],
    declarations:[

    ],
    exports:[
        ANGULAR_MODULES,
        MATERIAL_MODULES,
        SharedComponentsModule
    ],
})
export class SharedModule { }
