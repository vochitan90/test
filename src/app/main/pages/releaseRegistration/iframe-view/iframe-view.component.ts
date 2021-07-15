import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { UtilCommon, UtilComponent } from 'app/main/shared';
import { fromEvent, Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { ListUsbTokenComponent } from '../list-usb-token/list-usb-token.component';
import { ReleaseRegistrationService } from '../releaseRegistration.service';
import { verifyPDF, getCertificatesInfoFromPDF } from '@ninja-labs/verify-pdf';
import { Cert } from './cert.interface';
import { PdfSignedInfoComponent } from '../pdf-signed-info/pdf-signed-info.component';
import { LoginTokenPinComponent } from '../login-token-pin/login-token-pin.component';

@Component({
	selector: 'einvoice-iframe-view',
	templateUrl: './iframe-view.component.html',
	styleUrls: ['./iframe-view.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IframeViewComponent implements OnInit, OnDestroy {

	showIframe: any;
	_previewUrl: any;
	base64: string;
	fileName: string;
	originalFileName: string;
	aggId: string;
	currentStatus: number;
	cttbIssueRegistryAttachmentId: number;
	currentTaxCode: string;

	cert: Cert;
	verifyPDF: verifyPDF;
	messageExpired: string = '';
	zoom: string = "#zoom=125";

	private _addDialogRef: MatDialogRef<ListUsbTokenComponent>;
	private _loginTokenPinDialogRef: MatDialogRef<LoginTokenPinComponent>;
	private _pdfSignedInFoDialogRef: MatDialogRef<PdfSignedInfoComponent>;

	constructor(
		private _changeDetectorRef: ChangeDetectorRef,
		public matDialogRef: MatDialogRef<IframeViewComponent>,
		@Inject(MAT_DIALOG_DATA) public _dialogData: any,
		private _releaseRegistrationService: ReleaseRegistrationService,
		private _utils: UtilCommon,
		public _matDialog: MatDialog,
		private _utilsCom: UtilComponent,
		private sanitizer: DomSanitizer) {

	}

	ngOnInit(): void {

		if (this._dialogData) {
			const url = this._dialogData.previewPdf;
			this.currentStatus = this._dialogData.status;
			this.aggId = this._dialogData.aggId;
			//const url = 'http://www.africau.edu/images/default/sample.pdf#zoom=125';
			this._previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
			this.currentTaxCode = this._dialogData.taxCode;

			// Convert base64
			const id = this._dialogData.data.id;
			// this._releaseRegistrationService.downloadFile(id).then(dataFile => {

			// 	this.fileName = dataFile.fileName;
			// 	// REF
			// 	// https://www.it-swarm-vi.com/vi/file/angular-2-ma-hoa-hinh-anh-thanh-base64/826540066/
			// 	this.convertBlobToBase64(dataFile.blob).subscribe(base64 => {
			// 		this.base64 = base64.split(',')[1];
			// 		console.log(base64.split(',')[1])
			// 	});
			// });

			// get base 64 v2
			this._releaseRegistrationService.downloadFileV2(id).then(res => {
				console.log(res.dataBase64);
				this.originalFileName = res.originalFileName;
				this.base64 = res.dataBase64;
				const signedPdfBuffer = this.base64ToArrayBuffer(this.base64);
				try {
					// this.verifyPDF = verifyPDF(signedPdfBuffer);
					// this.verifyPDF.expired ? this.messageExpired = "Hết hiệu lực" : this.messageExpired = "Hiệu lực";
					// const certs =getCertificatesInfoFromPDF(signedPdfBuffer);
					// this.cert = certs[0];				
					// this._changeDetectorRef.detectChanges();
				} catch (error) {
					console.log(error);
				}
			});

			// Get cttbIssueRegistryAttachments
			this.cttbIssueRegistryAttachmentId = this._dialogData.cttbIssueRegistryAttachments[0].id;
			this._changeDetectorRef.detectChanges();
		}
	}

	convertBlobToBase64(blob: Blob): Observable<string> {
		let reader = new FileReader();
		reader.readAsDataURL(blob);
		return fromEvent(reader, 'load').pipe(pluck('currentTarget', 'result'));
	}

	base64ToArrayBuffer(base64): any {
		var binary_string = window.atob(base64);
		var len = binary_string.length;
		var bytes = new Uint8Array(len);
		for (var i = 0; i < len; i++) {
			bytes[i] = binary_string.charCodeAt(i);
		}
		return bytes.buffer;
	}

	async downloadFile(): Promise<void> {
		const id = this._dialogData.data.id;
		const dataFile = await this._releaseRegistrationService.downloadFile(id);

		// REF
		// https://www.it-swarm-vi.com/vi/file/angular-2-ma-hoa-hinh-anh-thanh-base64/826540066/

		this.convertBlobToBase64(dataFile.blob).subscribe(base64 => {

			this.base64 = base64.split(',')[1];
			console.log(base64.split(',')[1])
		});

		// if (this._utils.checkIsNotNull(dataFile)) {
		// 	const anchorElement = document.createElement('a');
		// 	anchorElement.download = dataFile.fileName;
		// 	anchorElement.href = window.URL.createObjectURL(dataFile.blob);
		// 	anchorElement.click();
		// }
	}

	print() {
		var myIframe = document.getElementById("viewfile")['contentWindow'];
		myIframe.focus();
		myIframe.print();
		return false;
	}

	viewSignedPdfInfo(){
		try {
            const id = this._dialogData.data.id;
            try {
                this._pdfSignedInFoDialogRef = this._matDialog.open(PdfSignedInfoComponent, {
                    panelClass: 'custom-dialog-list-usb-token',
                    data: {     
						aggId: this.aggId,
                    },
                    id: 'pdfSignedInfo',
                    disableClose: false,
                    width: '70%',
                });
                this._pdfSignedInFoDialogRef.afterClosed().subscribe((isSuccess: boolean) => {
                    if (isSuccess) {
                    }
                });

            } catch (error) {
                console.log(error);
            }
        } catch (error) {
        }
	}

	sign(){
		// try {
        //     const id = this._dialogData.data.id;
        //     try {
        //         this._addDialogRef = this._matDialog.open(ListUsbTokenComponent, {
        //             panelClass: 'custom-dialog-list-usb-token',
        //             data: {
        //                 base64: this.base64,         
		// 				fileName: this.fileName,        
		// 				cttbIssueRegistryAttachmentId: this.cttbIssueRegistryAttachmentId,
		// 				originalFileName: this.originalFileName,
		// 				currentTaxCode: this.currentTaxCode,
        //             },
        //             id: 'usbTokenView',
        //             disableClose: false,
        //             width: '50%',
        //         });
        //         this._addDialogRef.afterClosed().subscribe((isSuccess: boolean) => {
        //             if (isSuccess) {
        //                 //this.gridOptions.api.refreshServerSideStore({ purge: true });

		// 				this.currentStatus = 2;
		// 				this.matDialogRef.close(true);
		// 				this._changeDetectorRef.detectChanges();
        //             }
        //         });

        //     } catch (error) {
        //         console.log(error);
        //     }
        // } catch (error) {
        // }

		// open login with token pin

		try {
            const id = this._dialogData.data.id;
            try {
                this._loginTokenPinDialogRef = this._matDialog.open(LoginTokenPinComponent, {
                    panelClass: 'custom-dialog-list-usb-token',
                    data: {
                        base64: this.base64,         
						fileName: this.fileName,        
						cttbIssueRegistryAttachmentId: this.cttbIssueRegistryAttachmentId,
						originalFileName: this.originalFileName,
						currentTaxCode: this.currentTaxCode,
                    },
                    id: 'loginTokenPin',
                    disableClose: false,
                    width: '50%',
                });
                this._loginTokenPinDialogRef.afterClosed().subscribe((isSuccess: boolean) => {
                    if (isSuccess) {
                        //this.gridOptions.api.refreshServerSideStore({ purge: true });

						this.currentStatus = 2;
						this.matDialogRef.close(true);
						this._changeDetectorRef.detectChanges();
                    }
                });

            } catch (error) {
                console.log(error);
            }
        } catch (error) {
        }
	}

	ngOnDestroy(): void {
		this.showIframe = false;
		this._previewUrl = '';
	}
}
