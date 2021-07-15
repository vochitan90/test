import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ACTION, APP_CONSTANT, AUTH_STATUS_CONSTANT, SCREEN_CONSTANT } from 'app/main/shared/const/app.constant';

@Component({
    selector: 'child-cell',
    template: `<button class="btn" mat-icon-button [matMenuTriggerFor]="menu">
                    <mat-icon>more_horiz</mat-icon>
                </button>
            <mat-menu #menu="matMenu" xPosition="before">
                    <ng-container *ngFor="let item of actions">
                        <button *ngIf="checkActionActive(item.action, item.screen)" mat-menu-item (click)="actionCellClick(item.action)">
                            <mat-icon>{{item.icon}}</mat-icon>
                            <span>{{item.name | translate}}</span>
                        </button>
                    </ng-container>
            </mat-menu>`,
    styles: [
        `.btn {
            line-height: 35px;
            height: 35px;
        }
        `
    ]
})
export class ActionCellRenderer implements ICellRendererAngularComp {
    public params: any;
    public actions: any;

    agInit(params: any): void {
        this.params = params;
        this.actions = this.params.context.actions;
    }

    actionCellClick(action: string): any {
        this.params.context.parent.actionCellClick(action, this.params.node.data);
    }

    refresh(): boolean {
        return false;
    }

    checkActionActive(action: string, screen: string): boolean {
        const data = this.params.node.data;
        if(action === ACTION.UPDATE){
            if (screen) {
                if (screen === SCREEN_CONSTANT.TEMPLATE || screen === SCREEN_CONSTANT.CASE) {
                    if (action === ACTION.UPDATE) {
                        if (data.authStatus === AUTH_STATUS_CONSTANT.P) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }
}
