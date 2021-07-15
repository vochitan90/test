import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { NotificationModel } from './notification.model';
import { NotificationService } from './notification.service';
import { Events } from 'app/main/shared';

@Component({
    selector: 'notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
    hasSelectedMails: boolean;
    isIndeterminate: boolean;
    folders: any[];
    filters: any[];
    labels: any[];
    searchInput: FormControl;
    currentMail: NotificationModel;

    config = {
        suppressScrollX: true
    };

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {MailService} _mailService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _mailService: NotificationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _events: Events
    ) {
        // Load the translations
        // setTimeout(()=>{
        //     this._fuseTranslationLoaderService.loadTranslations(english, vi);
        // }, 0);

        // Set the defaults
        this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // this._mailService.onSelectedMailsChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(selectedMails => {
        //         setTimeout(() => {
        //             this.hasSelectedMails = selectedMails.length > 0;
        //             this.isIndeterminate = (selectedMails.length !== this._mailService.mails.length && selectedMails.length > 0);
        //         }, 0);
        //     });

        // this._mailService.onFoldersChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(folders => {
        //         this.folders = this._mailService.folders;
        //     });

        // this._mailService.onFiltersChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(folders => {
        //         this.filters = this._mailService.filters;
        //     });

        // this._mailService.onLabelsChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(labels => {
        //         this.labels = this._mailService.labels;
        //     });

        // this._mailService.onCurrentMailChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(currentMail => {
        //         if (!currentMail) {
        //             this.currentMail = null;
        //         }
        //         else {
        //             this.currentMail = currentMail;
        //         }
        //     });

        this.searchInput.valueChanges.pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(500),
            distinctUntilChanged()
        )
            .subscribe(searchText => {
                this._events.publish('searchMailNotification', searchText);
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle select all
     */
    toggleSelectAll(): void {
        this._mailService.toggleSelectAll();
    }

    /**
     * Select mails
     *
     * @param filterParameter
     * @param filterValue
     */
    selectMails(filterParameter?, filterValue?): void {
        this._mailService.selectMails(filterParameter, filterValue);
    }

    /**
     * Deselect mails
     */
    deselectMails(): void {
        this._mailService.deselectMails();
    }

    /**
     * Deselect current mail
     */
    deselectCurrentMail(): void {
        this._mailService.onCurrentMailChanged.next(null);
    }

    /**
     * Toggle label on selected mails
     *
     * @param labelId
     */
    toggleLabelOnSelectedMails(labelId): void {
        this._mailService.toggleLabelOnSelectedMails(labelId);
    }

    /**
     * Set folder on selected mails
     *
     * @param folderId
     */
    setFolderOnSelectedMails(folderId): void {
        this._mailService.setFolderOnSelectedMails(folderId);
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    onScrollDown(): void {
        this._events.publish('loadMailNotification', true);
    }
}
