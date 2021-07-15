import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { FuseUtils } from '@fuse/utils';
import { NotificationModel, MailFakeDb } from './notification.model';
import { HttpHelper, AppState } from 'app/main/shared';
import { API_URL, APP_CONFIG } from 'app/app.config';
import { INotification } from '../../models/notification';
// @Injectable({
//     providedIn: 'root'
// })
@Injectable({
    providedIn: 'root'
})
export class NotificationService implements Resolve<any>
{
    mails: INotification[];
    selectedMails: NotificationModel[];
    currentMail: INotification;
    searchText = '';

    folders: any[];
    filters: any[];
    labels: any[];
    routeParams: any;
    mailCurrent: INotification;
    onMailsChanged: BehaviorSubject<any>;
    onSelectedMailsChanged: BehaviorSubject<any>;
    onCurrentMailChanged: BehaviorSubject<any>;
    onFoldersChanged: BehaviorSubject<any>;
    onFiltersChanged: BehaviorSubject<any>;
    onLabelsChanged: BehaviorSubject<any>;
    onSearchTextChanged: BehaviorSubject<any>;

    constructor(
        private _httpClient: HttpClient,
        private _httpHelper: HttpHelper,
        private _appState: AppState
    ) {
        // Set the defaults
        this.selectedMails = [];
        this.onMailsChanged = new BehaviorSubject([]);
        this.onSelectedMailsChanged = new BehaviorSubject([]);
        this.onCurrentMailChanged = new BehaviorSubject([]);
        this.onFoldersChanged = new BehaviorSubject([]);
        this.onFiltersChanged = new BehaviorSubject([]);
        this.onLabelsChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new BehaviorSubject('');

        this.mails = [];
        this.folders = MailFakeDb.folders;
        this.labels = MailFakeDb.labels;

    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {
            Promise.all([
                this.getFolders(),
                this.getFilters(),
                this.getLabels(),
                this.getMails()
            ]).then(
                () => {
                    if (this.routeParams.mailId) {
                        this.setCurrentMail(this.routeParams.mailId);
                    }
                    else {
                        this.setCurrentMail(null);
                    }

                    this.onSearchTextChanged.subscribe(searchText => {
                        if (searchText !== '') {
                            this.searchText = searchText;
                            this.getMails();
                        }
                        else {
                            this.searchText = searchText;
                            this.getMails();
                        }
                    });
                    resolve(true);
                },
                reject
            );
        });
    }

    /**
     * Get all folders
     *
     * @returns {Promise<any>}
     */
    getFolders(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/mail-folders')
                .subscribe((response: any) => {
                    this.folders = response;
                    this.onFoldersChanged.next(this.folders);
                    resolve(this.folders);
                }, reject);
        });
    }

    /**
     * Get all filters
     *
     * @returns {Promise<any>}
     */
    getFilters(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/mail-filters')
                .subscribe((response: any) => {
                    this.filters = response;
                    this.onFiltersChanged.next(this.filters);
                    resolve(this.filters);
                }, reject);
        });
    }

    /**
     * Get all labels
     *
     * @returns {Promise<any>}
     */
    getLabels(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/mail-labels')
                .subscribe((response: any) => {
                    this.labels = response;
                    this.onLabelsChanged.next(this.labels);
                    resolve(this.labels);
                }, reject);
        });
    }

    /**
     * Get all mails
     *
     * @returns {Promise<Mail[]>}
     */
    getMails(): Promise<NotificationModel[]> {
        if (this.routeParams.labelHandle) {
            return this.getMailsByLabel(this.routeParams.labelHandle);
        }

        if (this.routeParams.filterHandle) {
            return this.getMailsByFilter(this.routeParams.filterHandle);
        }

        // return this.getMailsByFolder(this.routeParams.folderHandle);
    }

    /**
     * Get mails by folder
     *
     * @param handle
     * @returns {Promise<Mail[]>}
     */
    // getMailsByFolder(handle): Promise<NotificationModel[]> {
    //     return new Promise((resolve, reject) => {

    //         this._httpClient.get('api/mail-folders?handle=' + handle)
    //             .subscribe((folders: any) => {

    //                 const folderId = folders[0].id;

    //                 this._httpClient.get('api/mail-mails?folder=' + folderId)
    //                     .subscribe((mails: any) => {

    //                         this.mails = mails.map(mail => {
    //                             return new NotificationModel(mail);
    //                         });

    //                         this.mails = FuseUtils.filterArrayByString(this.mails, this.searchText);

    //                         this.onMailsChanged.next(this.mails);

    //                         resolve(this.mails);

    //                     }, reject);
    //             });
    //     });
    // }

    /**
     * Get mails by filter
     *
     * @param handle
     * @returns {Promise<Mail[]>}
     */
    getMailsByFilter(handle): Promise<NotificationModel[]> {
        return new Promise((resolve, reject) => {

            this._httpClient.get('api/mail-mails?' + handle + '=true')
                .subscribe((mails: any) => {

                    this.mails = mails.map(mail => {
                        return new NotificationModel(mail);
                    });

                    this.mails = FuseUtils.filterArrayByString(this.mails, this.searchText);

                    this.onMailsChanged.next(this.mails);

                    // resolve(this.mails);

                }, reject);
        });
    }

    /**
     * Get mails by label
     *
     * @param handle
     * @returns {Promise<Mail[]>}
     */
    getMailsByLabel(handle): Promise<NotificationModel[]> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/mail-labels?handle=' + handle)
                .subscribe((labels: any) => {

                    const labelId = labels[0].id;

                    this._httpClient.get('api/mail-mails?labels=' + labelId)
                        .subscribe((mails: any) => {

                            this.mails = mails.map(mail => {
                                return new NotificationModel(mail);
                            });

                            this.mails = FuseUtils.filterArrayByString(this.mails, this.searchText);

                            this.onMailsChanged.next(this.mails);

                            // resolve(this.mails);

                        }, reject);
                });
        });
    }

    /**
     * Toggle selected mail by id
     *
     * @param id
     */
    toggleSelectedMail(id): void {
        // First, check if we already have that mail as selected...
        if (this.selectedMails.length > 0) {
            for (const mail of this.selectedMails) {
                // ...delete the selected mail
                if (mail.id === id) {
                    const index = this.selectedMails.indexOf(mail);

                    if (index !== -1) {
                        this.selectedMails.splice(index, 1);

                        // Trigger the next event
                        this.onSelectedMailsChanged.next(this.selectedMails);

                        // Return
                        return;
                    }
                }
            }
        }

        // If we don't have it, push as selected
        // this.selectedMails.push(
        //     this.mails.find(mail => {
        //         return mail.id === id;
        //     })
        // );

        // Trigger the next event
        this.onSelectedMailsChanged.next(this.selectedMails);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void {
        if (this.selectedMails.length > 0) {
            this.deselectMails();
        }
        else {
            this.selectMails();
        }

    }

    /**
     * Select mails
     *
     * @param filterParameter
     * @param filterValue
     */
    selectMails(filterParameter?, filterValue?): void {
        this.selectedMails = [];

        // If there is no filter, select all mails
        // if (filterParameter === undefined || filterValue === undefined) {
        //     this.selectedMails = this.mails;
        // }
        // else {
        //     this.selectedMails.push(...
        //         this.mails.filter(mail => {
        //             return mail[filterParameter] === filterValue;
        //         })
        //     );
        // }

        // Trigger the next event
        this.onSelectedMailsChanged.next(this.selectedMails);
    }

    /**
     * Deselect mails
     */
    deselectMails(): void {
        this.selectedMails = [];

        // Trigger the next event
        this.onSelectedMailsChanged.next(this.selectedMails);
    }

    /**
     * Set current mail by id
     *
     * @param id
     */
    setCurrentMail(id): void {
        if (!id) {
            this.currentMail = null;
            this.onCurrentMailChanged.next(this.currentMail);
            return;
        }
        this.currentMail = this.mails.find(mail => {
            return mail.id === id;
        });
        this.onCurrentMailChanged.next(this.currentMail);
    }

    /**
     * Toggle label on selected mails
     *
     * @param labelId
     */
    toggleLabelOnSelectedMails(labelId): void {
        this.selectedMails.map(mail => {

            const index = mail.labels.indexOf(labelId);

            if (index !== -1) {
                mail.labels.splice(index, 1);
            }
            else {
                mail.labels.push(labelId);
            }

            this.updateMail(mail);
        });
    }

    /**
     * Set folder on selected mails
     *
     * @param folderId
     */
    setFolderOnSelectedMails(folderId): void {
        this.selectedMails.map(mail => {
            mail.folder = folderId;

            this.updateMail(mail);
        });

        this.deselectMails();
    }

    /**
     * Update the mail
     *
     * @param mail
     * @returns {Promise<any>}
     */
    updateMail(mail): Promise<any> {
        return new Promise((resolve, reject) => {

            this._httpClient.post('api/mail-mails/' + mail.id, { ...mail })
                .subscribe(response => {

                    this.getMails().then(mails => {

                        if (mails && this.currentMail) {
                            this.setCurrentMail(this.currentMail.id);
                        }

                        resolve(mails);

                    }, reject);
                });
        });
    }

    countNotification(): Promise<any> {
        const url: string = API_URL.NOTIFICATION.COUNT_UNREAD;
        return this._httpHelper.methodGetService(url, APP_CONFIG.QUERY_TIME_OUT);
    }


    updateRead(aggId: string, unread: number): Promise<any> {
        const url: string = API_URL.NOTIFICATION.UPDATE_READ;
        const params: string = 'cmd=' + encodeURIComponent(JSON.stringify({ 'aggId': aggId, 'unread': unread }));
        return this._httpHelper.methodPostService(url, params, APP_CONFIG.QUERY_TIME_OUT);
    }

    readAll(): Promise<any> {
        const url: string = API_URL.NOTIFICATION.READ_ALL;
        return this._httpHelper.methodGetBlobService(url, APP_CONFIG.QUERY_TIME_OUT);
    }

    deleteAll(): Promise<any> {
        const url: string = API_URL.NOTIFICATION.DELETE_ALL;
        return this._httpHelper.methodGetBlobService(url, APP_CONFIG.QUERY_TIME_OUT);
    }

    delete(aggId: string): Promise<any> {
        const url: string = API_URL.NOTIFICATION.DELETE;
        const params: string = 'aggId=' + aggId;
        return this._httpHelper.methodPostService(url, params, APP_CONFIG.QUERY_TIME_OUT);
    }

    getPagingListMail(offset: number = 0, limit: number = 0, keyword: string = ''): Promise<any[]> {
        const url: string = API_URL.NOTIFICATION.GET_PAGING_LIST_NOTIFICATION;
        let userCode: string = this._appState.getUserCode();

        if (userCode) {
            const loadCfg: any = {
                'offset': offset,
                'limit': limit,
                'filters': [
                    {
                        'field': 'to',
                        'value': 'USER:' + userCode,
                        'comparison': 'eq',
                        'type': 'string'
                    },
                    {
                        'field': 'keyword',
                        'value': keyword,
                        'comparison': 'eq',
                        'type': 'string'
                    }
                ],
                'sortField': '',
                'sortDir': 'DESC'
            };
            const params: string = 'loadCfg=' + encodeURIComponent(JSON.stringify(loadCfg));
            return this._httpHelper.methodPostService(url, params, APP_CONFIG.QUERY_TIME_OUT);
        }
        const interval = setInterval(() => {
            userCode = this._appState.getUserCode();
            if (userCode) {
                const loadCfg: any = {
                    'offset': offset,
                    'limit': limit,
                    'filters': [
                        {
                            'field': 'to',
                            'value': 'USER:' + userCode,
                            'comparison': 'eq',
                            'type': 'string'
                        },
                        {
                            'field': 'keyword',
                            'value': keyword,
                            'comparison': 'eq',
                            'type': 'string'
                        }
                    ],
                    'sortField': '',
                    'sortDir': 'DESC'
                };
                const params: string = 'loadCfg=' + encodeURIComponent(JSON.stringify(loadCfg));
                clearInterval(interval);
                return this._httpHelper.methodPostService(url, params, APP_CONFIG.QUERY_TIME_OUT);
            }
        }, 100);
        // const loadCfg: any = {
        //     'offset': offset,
        //     'limit': limit,
        //     'filters': [
        //         {
        //             'field': 'to',
        //             'value': 'USER:' + userCode,
        //             'comparison': 'eq',
        //             'type': 'string'
        //         },
        //         {
        //             'field': 'keyword',
        //             'value': keyword,
        //             'comparison': 'eq',
        //             'type': 'string'
        //         }
        //     ],
        //     'sortField': '',
        //     'sortDir': 'DESC'
        // };
        // const params: string = 'loadCfg=' + encodeURIComponent(JSON.stringify(loadCfg));
        // return this._httpHelper.methodPostService(url, params, APP_CONFIG.QUERY_TIME_OUT);
    }

    setMailCurrent(mailCurrent: INotification): void {
        this.mailCurrent = mailCurrent;
    }

    getMailCurrent(): INotification {
        return this.mailCurrent;
    }
}


