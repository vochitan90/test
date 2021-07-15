import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilComponent } from 'app/main/shared';
import { ListUsbTokenComponent } from '../list-usb-token/list-usb-token.component';
import { ReleaseRegistrationService } from '../releaseRegistration.service';

@Component({
	selector: 'app-login-token-pin',
	templateUrl: './login-token-pin.component.html',
	styleUrls: ['./login-token-pin.component.scss']
})
export class LoginTokenPinComponent implements OnInit {

	public form: FormGroup;
	numberRegEx = /^-?(0|[1-9]\d*)?$/;
	messageInfo: string = '';
	isLoading: boolean = false;

	// From dialog data
	public base64: string;
	public fileName: string;
	public cttbIssueRegistryAttachmentId: number;
	public originalFileName: string;
	public currentItemSelected: any;
	currentTaxCode: string;
	tokenPin: string;

	public wsUrl = window['USB_TOKEN_URL'];

	listOfUsbToken: any[];

	private _openUsbTokenListDialogRef: MatDialogRef<ListUsbTokenComponent>;

	constructor(
		@Inject(MAT_DIALOG_DATA) public _dialogData: any,
		private _changeDetectorRef: ChangeDetectorRef,
		public matDialogRef: MatDialogRef<LoginTokenPinComponent>,
		private _formBuilder: FormBuilder,
		public rrService: ReleaseRegistrationService,
		public _utilCmp: UtilComponent,
		public _matDialog: MatDialog,) {
		this.form = this._formBuilder.group({
			'tokenPin': ['', Validators.compose([Validators.required, Validators.pattern(this.numberRegEx)])],
		})
	}

	stopLoading() {
		this.isLoading = false;
		this._changeDetectorRef.detectChanges();
	}

	startLoading() {
		this.isLoading = true;
		this._changeDetectorRef.detectChanges();
	}

	setMessage(text) {
		this.messageInfo = text;
		this._changeDetectorRef.detectChanges();
	}

	openListOfUsbTokenDialog() {
		try {
			this._openUsbTokenListDialogRef = this._matDialog.open(ListUsbTokenComponent, {
				panelClass: 'custom-dialog-list-usb-token',
				data: {
					base64: this.base64,
					fileName: this.fileName,
					cttbIssueRegistryAttachmentId: this.cttbIssueRegistryAttachmentId,
					originalFileName: this.originalFileName,
					currentTaxCode: this.currentTaxCode,
					listOfUsbToken: this.listOfUsbToken, // change request
					tokenPin: this.tokenPin,
				},
				id: 'usbTokenView',
				disableClose: false,
				width: '60%',
			});
			this._openUsbTokenListDialogRef.afterClosed().subscribe((isSuccess: boolean) => {
				if (isSuccess) {
					//this.currentStatus = 2;
					this.matDialogRef.close(true);
					this._changeDetectorRef.detectChanges();
				}
			});

		} catch (error) {
			console.log(error);
		}

	}

	loginTokenPin() {
		this.isLoading = true;
		this._changeDetectorRef.detectChanges();

		// Health check first!!!
		this.rrService.healthcheck(this.wsUrl, (message) => {
			console.log(message);
			if (message) {
				//GET USB TOKENS
				this.tokenPin = this.form.get("tokenPin").value;
				this.rrService.getUsbToken(this.wsUrl, this.tokenPin, (res) => {
					console.log(res);
					if (res.msgCode === "SUCCESS") {
						this.listOfUsbToken = res.listTokenUsb;
						this.setMessage('');
						// Continue to open list of usbtoken
						this.openListOfUsbTokenDialog();

					} else {
						if (res.msgCode === "USB_TOKEN_NOT_FOUND") {
							this.listOfUsbToken = [];
							this._utilCmp.showTranslateSnackbar(res.msg, "error");
							this.setMessage(res.msg);
						}
						if (res.msgCode === "CKR_PIN_INCORRECT") {
							this.listOfUsbToken = [];
							this._utilCmp.showTranslateSnackbar(res.msg, "error");
							this.setMessage(res.msg);
						}
					}
					this.stopLoading();
					return;
				});
			} else {
				this.setMessage('Lỗi kết nối!');
				this._utilCmp.showTranslateSnackbar("Lỗi kết nối!", "error");
				this.stopLoading();
				return;
			}
		});
	}

	ngOnInit(): void {

		// Get info from dialog data
		this.base64 = this._dialogData.base64;
		this.fileName = this._dialogData.fileName;
		this.originalFileName = this._dialogData.originalFileName;
		this.cttbIssueRegistryAttachmentId = this._dialogData.cttbIssueRegistryAttachmentId;
		this.currentTaxCode = this._dialogData.currentTaxCode;
	}

}
