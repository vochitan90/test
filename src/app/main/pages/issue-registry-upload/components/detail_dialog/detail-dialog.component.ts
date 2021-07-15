import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { checkIsNotNull } from 'app/main/shared/utils/GridService';
import { TranslateService } from '@ngx-translate/core';
import { COMPONENT_CONSTANT, VALIDATION_CONSTANT_MESSAGE } from 'app/main/shared/const/app.constant';
import { IProcessUpload } from '../../models/processUpload.interface';
import { IssueRegistryUploadStore } from '../../issue-registry-upload.store';
import { UtilCommon, UtilComponent } from 'app/main/shared';
import { ISSUE_REGISTRY_UPLOAD_CONSTANT } from '../../issue-registry-upload.constant';
import { IContentDetail, IPttbRegistaxincoAttachments, ITaxIncome, ICertErrorText } from '../../models/content.interface';
import { mergeFormWithData } from 'app/main/shared/utils/FunctionUtils';
import { IframeViewComponent } from '../iframe-view/iframe-view.component';
import { RELEASE_REGISTRATION_CONSTANT } from 'app/main/pages/releaseRegistration/releaseRegistration.constant';




@Component({
    selector: 'app-period-upload-dialog-form',
    templateUrl: './detail-dialog.component.html',
    styleUrls: ['./detail-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class IssueRegistryDetailResultUploadDialogComponent implements OnInit, OnDestroy {
    public data: IProcessUpload;
    public loading = true;
    formGroupAccountDetail: FormGroup;
    dataAccount: any;
    content;
    statusText: string;
    taxincome: ITaxIncome = {};
    lstFail = [];
    currentStatusRecord;

    TAX_INCOME_STATUS = ISSUE_REGISTRY_UPLOAD_CONSTANT.STATUS;
    CERT_TAXCODE = ISSUE_REGISTRY_UPLOAD_CONSTANT.CERT_TAXCODE;
    CERT_STATUS = ISSUE_REGISTRY_UPLOAD_CONSTANT.CERT_STATUS;

    // Check chữ ký số
    isCertError = false;
    isCertStatusGood = false;
    isCertTaxCodeGood = false;
    isCertExpired = false;
    certErrorText: ICertErrorText = {};

    listFileRegistry: IPttbRegistaxincoAttachments[] = [];
    listFileForm: IPttbRegistaxincoAttachments[] = [];
    listFileOther: IPttbRegistaxincoAttachments[] = [];

    private _previewFileDialogRef: MatDialogRef<IframeViewComponent>;

    public form: FormGroup;

    processDetailIds = [];
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _store: IssueRegistryUploadStore,
        private _utils: UtilCommon,
        private _utilCmp: UtilComponent,
        private _formBuilder: FormBuilder,
        private _translateService: TranslateService,
        public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) private _dialogData: any,
        public matDialogRef: MatDialogRef<IssueRegistryDetailResultUploadDialogComponent>) {
            this.form = _formBuilder.group({
                'buName': [''],
                'buTaxcode': [''],
                'buPhone': [''],
                'buEmail': [''],
                'buMajor': [''],
                'buAddress': [''],

                'taxPlaceName': [''],
                'buPattern': [''],
                'buSerial': [''],
                'registryYear': [''],
                'decisionNo': [''],
                'registryFrom': [''],
                'registryTo': [''],
                'registryAmount': [''],
            });
    }

    async ngOnInit(): Promise<void> {
        try {
            if (checkIsNotNull(this._dialogData)) {
                this.data = this._dialogData.data;
                this.statusText = this._translateService.instant('TAXINCOME_LETTER_UPLOAD.STATUS_' + this.data.status);
                await this.getAllInforWhenOpenDialog();
                this.validateCerInfo();
            }
        } catch (err: any) {
            this._utilCmp.showTranslateSnackbar('Tải dữ liệu thất bại!', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
            this.loading = false;
            this._changeDetectorRef.detectChanges();
        } finally{
            this.loading = false;
            this._changeDetectorRef.detectChanges();
        };
    }

    validateCerInfo(): void {
        // Kiểm tra trạng thái chũ ký có lỗi không
        if (this.taxincome?.extValue) {
            // Kiểm tra trạng thái chữ ký
            if (this.taxincome?.extValue?.cerInfo?.revocation?.certStatus === this.CERT_STATUS.GOOD) {
                this.isCertStatusGood = true;
            }
            else {
                this.isCertStatusGood = false;
                this.isCertError = true;
                switch (this.taxincome?.extValue?.cerInfo?.revocation?.certStatus) {
                    case this.CERT_STATUS.UNKNOWN:
                        this.certErrorText.status = 'Không kiểm tra được thông tin';
                        break;
                    case this.CERT_STATUS.REVOKED:
                        this.certErrorText.status = 'Đã bị thu hồi';
                        break;
                    default:
                        break;
                }
            }
            // Kiểm tra mã số thuế trong chữ ký
            if (this.taxincome?.extValue?.cerValidator?.taxCode) {
                this.isCertTaxCodeGood = false;
                this.isCertError = true;
                switch (this.taxincome?.extValue?.cerValidator?.taxCode) {
                    case this.CERT_TAXCODE.CERT_TAX_IS_NULL:
                        this.certErrorText.taxCode = 'Không tìm thấy mã số thuế trong chữ ký số';
                        break;
                    case this.CERT_TAXCODE.CERTTAX_NOT_EQ_BUTAX:
                        this.certErrorText.taxCode = 'MST đơn vị phát hành không trùng với MST trên chữ ký số';
                        break;
                    default:
                        break;
                }
            } else {
                this.isCertTaxCodeGood = true;
            }
            // Kiểm tra hiệu lực chữ ký
            if (this.taxincome?.extValue?.cerValidator?.cert && this.taxincome?.extValue?.cerValidator?.cert === 'EXPIRED') {
                this.isCertExpired = true;
                this.isCertError = true;
                this.certErrorText.expired = 'Chữ ký số không còn hiệu lực tại thời điểm ký';
            } else {
                this.isCertExpired = false;
            }
        }
    }

    async getAllInforWhenOpenDialog(): Promise<void> {

        // Begin to load Thông tin tổ chức
        
        mergeFormWithData(this._dialogData.data, this.form);

        const response = await this._store.getRegistrytaxHistoriesAggid(this._dialogData.data.aggId);
        //const response = await this._store.getRegistrytaxHistoriesAggid("aaaaaaaaaaaaaaaaaa");
        if (this._utils.checkIsNotNull(response)) {
            this.taxincome = response;
            this.taxincome.pttbRegistrytaxHistories.sort(function(x, y){
                return y.makerDate - x.makerDate;
            })
            this.loadTaxincomeAttachments(this.taxincome.pttbRegistaxincoAttachments);
        }
        this._changeDetectorRef.detectChanges();
    }

    loadTaxincomeAttachments(pttbRegistaxincoAttachments: IPttbRegistaxincoAttachments[]): void {
        this.listFileRegistry = pttbRegistaxincoAttachments.filter(item =>
            item.attmentType === ISSUE_REGISTRY_UPLOAD_CONSTANT.ATTMENT_TYPE.REGISTRY);
        this.listFileForm = pttbRegistaxincoAttachments.filter(item =>
            item.attmentType === ISSUE_REGISTRY_UPLOAD_CONSTANT.ATTMENT_TYPE.FORM);
        this.listFileOther = pttbRegistaxincoAttachments.filter(item =>
            item.attmentType === ISSUE_REGISTRY_UPLOAD_CONSTANT.ATTMENT_TYPE.OTHER);
    }

    async downloadResource(item: IPttbRegistaxincoAttachments): Promise<void> {
        try {
            // IF file doc
            if (this._utils.getExtensionFileDoc(item.smtbResource.fileName)) {
                const { response, ext } = await this._store.downloadResource(item.smtbResource.aggId, true);
                if (this._utils.checkIsNotNull(response) && this._utils.checkIsNotNull(ext)) {
                    this._utils.downloadFile(item.smtbResource.fileName, response);
                } else {
                    this._utilCmp.openSnackBar('Không thể tải tập tin ', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
                }
            } else {// Other
                const response = await this._store.downloadResource(item.smtbResource.aggId, false);
                if (this._utils.checkIsNotNull(response)) {
                    this._utils.downloadFile(item.smtbResource.fileName, response);
                } else {
                    this._utilCmp.openSnackBar('Không thể tải tập tin ', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
                }
            }
        } catch (error) {
            this._utilCmp.openSnackBar('Không thể tải tập tin ', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
        }
    }

    async getSellerSign(): Promise<void> {
        // f5161c5f-cf49-4239-a486-379e8f0ae1fc
        try {
            const response = await this._store.downloadCert(this.taxincome.aggId);
            if (this._utils.checkIsNotNull(response)) {
                this._utils.downloadFile('cer.cer', response);
            } else {
                this._utilCmp.openSnackBar('Không thể tải thông tin chứng thư số ', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
            }
        } catch (error) {
            this._utilCmp.openSnackBar('Không thể tải thông tin chứng thư số ', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
        }
    }

    preview(item: IPttbRegistaxincoAttachments): void {
        this._previewFileDialogRef = this._matDialog.open(IframeViewComponent, {
            //panelClass: 'custom-dialog',
            data: {
                previewPdf: `${ISSUE_REGISTRY_UPLOAD_CONSTANT.API.PREVIEW_RESOURCE}aggId=${item.smtbResource.aggId}`,
            },
            id: 'previewFile',
            disableClose: false,
            width: '100%',
        });
    }

    

    getStyleStatusText() {
        if (this.data) {
            if (this.data.status == 1) {
                return '#018747';
            }
            if (this.data.status == 2) {
                return 'red';
            }
        }
    }

    ngOnDestroy(): void {

    }

    cancel() {
        console.log("cancel");
    }

    export() {

    }

    getCurrentDetailStatusOfRecord(status) {
        return this._translateService.instant('ISSUE_REGISTRY.STATUS_HISTORY_' + status);
    }

    async send(): Promise<void> {
        try {
            await this._store.issueImport(this.data.id, this.processDetailIds);
        } catch (error) {
            this._utilCmp.showTranslateSnackbar('Phát hành thất bại!', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
        } finally {
            this.loading = false;
            await this.getAllInforWhenOpenDialog();
            this._changeDetectorRef.detectChanges();
        }

    }
    release() {

    }

    selectedRecord(success: IContentDetail) {
        success.checked = !success.checked;
        this.processDetailIds.push(success.id);
    }

    hideTable(evt) {
        console.log(evt);
    }

    async downloadTemplate(): Promise<void> {
        try {
            await this._store.downloadFile(this.data.id, this.data.fileName);
        } catch (error) {
            this._utilCmp.showTranslateSnackbar('DOWNLOAD_FAIL', COMPONENT_CONSTANT.SNACK_BAR_ERROR);
        } finally {
            this.loading = false;
            this._changeDetectorRef.detectChanges();
        }
    }

}
