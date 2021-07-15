import { Component, ViewEncapsulation, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Events } from 'app/main/shared';
import { APP_CONFIG } from 'app/app.config';
@Component({
    selector: 'quick-panel',
    templateUrl: './quick-panel.component.html',
    styleUrls: ['./quick-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class QuickPanelComponent implements OnInit, AfterViewInit, OnDestroy {
    date: any;
    events: any[];
    notes: any[];
    settings: any;
    day: string;
    fulldate: string;
    version: string = APP_CONFIG.VERSION;
    /**
     * Constructor
     */
    constructor(private _events: Events) {
        // Set the defaults
        // this.date = new Date();
        // moment.locale('vi');
        // this.date = moment();
        // this.day = this.date.format('dddd');
        // this.fulldate = this.date.format('L');
        // this.settings = {
        //     notify: true,
        //     cloud : false,
        //     retro : true
        // };
        this.events = [];

        this._events.subscribe('initQuickPanel', () => {
            let lstTicket: any = localStorage.getItem('lstTicket');
            if (lstTicket && lstTicket !== 'null') {
                lstTicket = JSON.parse(lstTicket);
                const tickets = [];
                let childTicket = null;
                for (const ticket of lstTicket) {
                    if (ticket && ticket !== 'null') {
                        childTicket = JSON.parse(ticket.payload);
                        childTicket.popupID = ticket.popupID;
                        tickets.push(childTicket);
                    }
                }
                this.events = tickets;
            }
        });

        this._events.subscribe('removeListTicket', (data) => {
            let lstTicket: any = localStorage.getItem('lstTicket');
            if (lstTicket && lstTicket !== 'null') {
                lstTicket = JSON.parse(lstTicket);
                const tickets = [];
                for (const ticket of lstTicket) {
                    if (ticket && ticket !== 'null') {
                        const payload = JSON.parse(ticket.payload);
                        if (ticket.popupID === data.popupID && data.customerPhone === payload.customerPhone) {
                            //
                        } else {
                            tickets.push(ticket);
                        }
                        // this.events.push(JSON.parse(ticket.payload));
                    }
                }
                if (tickets.length > 0) {
                    localStorage.setItem('lstTicket', JSON.stringify(tickets));
                    let lstTicketTemp: any = localStorage.getItem('lstTicket');
                    if (lstTicketTemp && lstTicketTemp !== 'null') {
                        lstTicketTemp = JSON.parse(lstTicketTemp);
                        const ticketsTemp = [];
                        let childTicket = null;
                        for (const ticket of lstTicketTemp) {
                            if (ticket && ticket !== 'null') {
                                childTicket = JSON.parse(ticket.payload);
                                childTicket.popupID = ticket.popupID;
                                ticketsTemp.push(childTicket);
                            }
                        }
                        this.events = ticketsTemp;
                    }
                } else if (lstTicket.length === 1 && tickets.length === 0) {
                    localStorage.removeItem('lstTicket');
                    this.events = [];
                }
                this._events.publish('updateBadgeNumPopup', true);

            }
        });
    }

    ngAfterViewInit(): void {
        // const language: string = localStorage.getItem('language') || 'vi';
        // moment.locale(language);
        // this.date = moment();
        // this.day = this.date.format('dddd').toString().toUpperCase();
        // this.fulldate = this.date.format('L');
        // this.settings = {
        //     notify: true,
        //     cloud: false,
        //     retro: true
        // };
    }

    ngOnInit(): void{
        const language: string = localStorage.getItem('language') || 'vi';
        moment.locale(language);
        this.date = moment();
        this.day = this.date.format('dddd').toString().toUpperCase();
        this.fulldate = this.date.format('L');
        this.settings = {
            notify: true,
            cloud: false,
            retro: true
        };
    }

    ngOnDestroy(): void {
        // 
    }

    openTicket(evt: any): void {
        const cmd = {
            payload: JSON.stringify(evt)
        };
        this._events.publish('action:ticketIsComing', cmd);
    }
}
