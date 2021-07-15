import { Injectable } from '@angular/core';
import { INotification } from '../../models/notification';
import { Events } from './Events';
import { UtilCommon } from './UtilCommon';
import { Observable, Subscription } from 'rxjs';
// import { Message, StompHeaders } from '@stomp/stompjs';
// import { StompService, StompConfig, StompRService, StompState } from '@stomp/ng2-stompjs';
// import * as SockJS from 'sockjs-client';
import { AppState } from './AppState';
// export function socketProvider(): string {
//     if (window.location.origin.indexOf('gateway-dev') > -1 || window.location.origin.indexOf('localhost') > -1) {
//         return new SockJS('https://gateway-dev.lcssoft.com.vn/mqgateway/wsep/');
//     }
//     return new SockJS(window.location.origin + '/mqgateway/wsep/');

// }

@Injectable({
    providedIn: 'root'
})

export class SocketNotification {

    // privateMessages: any;
    // privateSubscription: any;

    // stomConfig: StompConfig;
    // // Stream of messages
    // private subscription: Subscription;
    // public messages: Observable<any>;
    // public mq: Array<string> = [];

    // // Subscription status
    // public subscribed: boolean;

    // headers: StompHeaders;

    // private firstLogin: boolean = true;
    // private isLogged: boolean = false;

    // constructor(public _stompService: StompRService, private _utils: UtilCommon,
    //     private _events: Events, private _appState: AppState,
    // ) {
       
    // }

    // public subscribe(): void {
    //     if (this.subscribed || !this._utils.getToken() || !this._appState) {
    //         return;
    //     }

    //     const headers: StompHeaders = {
    //         'Authorization': this._utils.getToken()
    //     };

    //     const appState: any = this._appState.appState;
    //     const moreInfo: any = appState.moreInfo;
    //     this.messages = this._stompService.subscribe('/notification/tenant_app/' + moreInfo.appCode + '.' + moreInfo.tenantCode, headers);
    //     this.privateMessages = this._stompService.subscribe('/notification/user/' + appState.userCode, headers);

    //     // Subscribe a function to be run on_next message
    //     this.subscription = this.messages.subscribe(this.onSendMessage);
    //     this.privateSubscription = this.privateMessages.subscribe(this.onPrivateMessage);

    //     this.subscribed = true;

    //     // setInterval(() => {
    //     //     this._stompService.publish('/notification/tenant_app/' + moreInfo.appCode + '.' + moreInfo.tenantCode, '{abc:321}', headers);
    //     // }, 10000);
    // }

    // public unsubscribe(): void {
    //     if (!this.subscribed) {
    //         return;
    //     }
    //     if (!this.subscription) {
    //         return;
    //     }
    //     // This will internally unsubscribe from Stomp Broker
    //     // There are two subscriptions - one created explicitly, the other created in the template by use of 'async'
    //     this.subscription.unsubscribe();
    //     this.privateSubscription.unsubscribe();
    //     this.privateSubscription = null;
    //     this.messages = null;
    //     this.privateMessages = null;

    //     this.subscribed = false;
    // }


    // public onSendMessage = (message: Message) => {

    //     // Store message in "historic messages" queue
    //     // this.mq.push(message.body + '\n');

    //     // // Count it
    //     // this.count++;

    //     // Log it to the console
    //     if (message) {
    //         console.log('Message sent to store: ' + message.body);
    //     }
    // }

    // public onPrivateMessage = (message: Message) => {

    //     // Store message in "historic messages" queue
    //     // this.mq.push(message.body + '\n');

    //     // // Count it
    //     // this.count++;

    //     // Log it to the console
    //     // console.log('Message sent to me: ' + message);
    //     if (message) {
    //         console.log('Message sent to me: ' + message.body);
    //         const body: any = JSON.parse(message.body);
    //         if (body.from === 'EXT:CALL_CENTER') {
    //             this._events.publish('action:ticketIsComing', body);
    //             return;
    //         }
    //         this.notifyMe(body.from, body.title, body);
    //     }
    // }

    // initStorm(): void {
    //     // this.stomConfig = this.
    //     this._stompService = new StompService(this.generateStompConfig());
    //     // this.stomConfig = this.generateStompConfig();
    //     // this._stompService.config = this.stomConfig;
    //     // console.log(this._stompService);

    //     this._stompService.initAndConnect();

    //     // this._stompService.client.on
    //     // this.headers = {
    //     //     'Authorization': this.getAuthToken()
    //     // };
    //     // this._stompService.client.connect(this.headers, () => {
    //     //     console.log('=   ================ aaaaa');
    //     // });

    //     // this._stompService.ser
    // }

    // initStormToPromise(): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         this._stompService = new StompService(this.generateStompConfig());

    //         this._stompService.initAndConnect();

    //         const stompRService: any = this._stompService;
    //         stompRService.client.connect(this.headers, (sucess: any) => {
    //             if (sucess) {
    //                 if (sucess.command === 'CONNECTED') {
    //                     if (this.firstLogin && !this.isLogged) {
    //                         this.firstLogin = false;
    //                         this.isLogged = true;
    //                     } else {
    //                         this.disconnect();
    //                         this.firstLogin = true;
    //                         this.isLogged = false;
    //                         this.initStormToPromise().then((sucesss: any) => {
    //                             if (sucesss) {
    //                                 setTimeout(() => {
    //                                     this.subscribe();
    //                                 }, 1000);
    //                             }
    //                         });
    //                     }
    //                     resolve(sucess);
    //                 }
    //                 return;
    //             }
    //             resolve(false);
    //         });
    //     });

    // }

    // generateStompConfig(): StompConfig {
    //     const authToken: string = this.getAuthToken();
    //     if (!authToken) {
    //         return;
    //     }
    //     // setup security headers
    //     this.headers = {
    //         'Authorization': authToken
    //     };

    //     // reconnect
    //     const stompConfig: StompConfig = {
    //         // Which server?
    //         url: socketProvider,

    //         // Headers
    //         // Typical keys: login, passcode, host
    //         // headers: {
    //         //   login: 'guest',
    //         //   passcode: 'guest'
    //         // },
    //         headers: this.headers,

    //         // How often to heartbeat?
    //         // Interval in milliseconds, set to 0 to disable
    //         heartbeat_in: 0, // Typical value 0 - disabled
    //         heartbeat_out: 20000, // Typical value 20000 - every 20 seconds
    //         // Wait in milliseconds before attempting auto reconnect
    //         // Set to 0 to disable
    //         // Typical value 5000 (5 seconds)
    //         reconnect_delay: 5000,

    //         // Will log diagnostics on console
    //         debug: true
    //     };

    //     return stompConfig;

    // }

    // /** Consume a message from the _stompService */

    // isConnected(): boolean {
    //     if(this._stompService){
    //         return this._stompService.connected();
    //     }
    //     return false;
    // }

    // disconnect(): void {
    //     this.unsubscribe();
    //     if(this._stompService){
    //         this._stompService.disconnect();
    //     }
    // }

    // getAuthToken(): string {
    //     const authToken: string = this._utils.getToken();
    //     if (!authToken) {
    //         // alert('authToken is null');
    //         return '';
    //     }
    //     return authToken;
    // }


    // initPermission(): void {
    //     if (window['Notification'] && window['Notification'].permission !== 'granted') {
    //         Notification.requestPermission((status: any) => {
    //             if (status !== 'granted') {
    //                 // Notification. = status;
    //                 return;
    //             }
    //         });
    //     }
    //     return;
    // }

    // notifyMe(title: string, text: string, dataNotification: INotification, img: string = 'assets/images/logos/logo.png'): void {

    //     // const img = 'assets/images/logos/logo.png';
    //     // const text = 'HEY! Your task 321312312 is now overdue.';
    //     const me: any = this;
    //     const notification = new Notification(title, { body: text, icon: img });

    //     this._events.publish('updateNotificationNumber', true);

    //     // dataNotification.message = dataNotification.title;
    //     // dataNotification.user = dataNotification.from;
    //     // dataNotification.isReaded = 1;
    //     // dataNotification.time = this._utils.formatDate(dataNotification.createdTime);

    //     this._events.publish('addArrayNotification', dataNotification);

    //     setTimeout(() => {
    //         if (notification) {
    //             notification.close();
    //         }
    //     }, 8000);

    //     notification.onclick = function (event: any) {
    //         event.preventDefault(); // prevent the browser from focusing the Notification's tab
    //         // window.open('http://www.mozilla.org', '_blank');
    //         me._events.publish('clickNotification', dataNotification);
    //         setTimeout(() => {
    //             if (notification) {
    //                 notification.close();
    //             }
    //         }, 500);
    //     };
    // }
}
