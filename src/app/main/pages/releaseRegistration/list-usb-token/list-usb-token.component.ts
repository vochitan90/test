import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilComponent } from 'app/main/shared';
import { ReleaseRegistrationService } from '../releaseRegistration.service';
import * as client from 'lcs-usbtoken';

@Component({
	selector: 'app-list-usb-token',
	templateUrl: './list-usb-token.component.html',
	styleUrls: ['./list-usb-token.component.scss']
})
export class ListUsbTokenComponent implements OnInit, OnDestroy, AfterViewInit {

	public form: FormGroup;
	listOfUsbToken: any[];
	public base64: string;
	public fileName: string;
	public cttbIssueRegistryAttachmentId: number;
	public originalFileName: string;
	public currentItemSelected: any;
	currentTaxCode: string;

	isLoading = true;
	isSameTaxCode = false;
	sub: any;
	tokenPin: string;

	//public wsUrl = "ws://localhost:41803";
	public wsUrl = window['USB_TOKEN_URL'];
	public messageInfo = "";

	//numberRegEx = /^-?(0|[1-9]\d*)?$/;

	constructor(
		@Inject(MAT_DIALOG_DATA) public _dialogData: any,
		private _changeDetectorRef: ChangeDetectorRef,
		private dialogRef: MatDialog,
		public matDialogRef: MatDialogRef<ListUsbTokenComponent>,
		private _formBuilder: FormBuilder,
		public rrService: ReleaseRegistrationService,
		public _utilCmp: UtilComponent) {
		this.form = this._formBuilder.group({
			'usbToken': [''],
			//'tokenPin': ['', Validators.compose([Validators.required, Validators.pattern(this.numberRegEx)])],
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

	ngAfterViewInit() {
		// try {
		// 	this.base64 = this._dialogData.base64;
		// 	this.fileName = this._dialogData.fileName;
		// 	this.originalFileName = this._dialogData.originalFileName;
		// 	this.cttbIssueRegistryAttachmentId = this._dialogData.cttbIssueRegistryAttachmentId;
		// 	this.messageInfo = "??ang ki???m tra v?? l???y th??ng tin usb token, vui l??ng ?????i trong gi??y l??t.";
		// 	this.startLoading();



		// 	client.healthcheck(this.wsUrl, (message) => {
		// 		console.log(message);
		// 		// this.rrService.healthcheck(this.wsUrl, (message) => {
		// 		// 	console.log(message);
		// 		// });
		// 	})

		// 	//this.rrService.healthcheck(this.wsUrl, (message) => {
		// 		//console.log(message);
		// 		// if (message) {
		// 		// 	//GET USB TOKENS
		// 		// 	// Begin use tool sign api 1
		// 		// 	this.rrService.getUsbToken(this.wsUrl, (res) => {
		// 		// 		console.log(res);
		// 		// 		//this.messageInfo = res;
		// 		// 		if (res.msgCode === "SUCCESS") {
		// 		// 			this.listOfUsbToken = res.listTokenUsb;
		// 		// 			this.form.get("usbToken").setValue(this.listOfUsbToken[0]);
		// 		// 			this.setMessage('');
		// 		// 		} else {
		// 		// 			if (res.msgCode === "USB_TOKEN_NOT_FOUND") {
		// 		// 				this.listOfUsbToken = [];
		// 		// 				this._utilCmp.showTranslateSnackbar(res.msg, "error");
		// 		// 				this.setMessage(res.msg);
		// 		// 			}
		// 		// 		}
		// 		// 		this.stopLoading();
		// 		// 		return;
		// 		// 	});
		// 		// }else{
		// 		// 	this.setMessage('L???i k???t n???i!');
		// 		// 	this._utilCmp.showTranslateSnackbar("L???i k???t n???i!", "error");
		// 		// 	this.stopLoading();
		// 		// 	return;
		// 		// }
		// 	//});
		// } catch (error) {
		// 	console.log(error);
		// 	this.stopLoading();
		// 	return;
		// }
	}

	test() {
		this.ngOnInit();
	}

	ngOnInit(): void {
		try {
			this.setMessage("??ang t???i danh s??ch... vui l??ng ?????i!");
			this.startLoading();

			this.base64 = this._dialogData.base64;
			this.fileName = this._dialogData.fileName;
			this.originalFileName = this._dialogData.originalFileName;
			this.cttbIssueRegistryAttachmentId = this._dialogData.cttbIssueRegistryAttachmentId;
			this.currentTaxCode = this._dialogData.currentTaxCode;
			this.listOfUsbToken = this._dialogData.listOfUsbToken;
			// Set value for dropdown
			this.form.get("usbToken").setValue(this.listOfUsbToken[0]);
			this.tokenPin = this._dialogData.tokenPin;

			this.setMessage('');
			this.stopLoading();

			

			// this.rrService.healthcheck(this.wsUrl, (message) => {
			// 	console.log(message);
			// 	if (message) {
			// 		//GET USB TOKENS
			// 		// Begin use tool sign api 1
			// 		this.rrService.getUsbToken(this.wsUrl, this.tokenPin, (res) => {
			// 			console.log(res);
			// 			//this.messageInfo = res;
			// 			if (res.msgCode === "SUCCESS") {
			// 				this.listOfUsbToken = res.listTokenUsb;
			// 				this.form.get("usbToken").setValue(this.listOfUsbToken[0]);
			// 				console.log(this.currentTaxCode);
			// 				this.setMessage('');
			// 			} else {
			// 				if (res.msgCode === "USB_TOKEN_NOT_FOUND") {
			// 					this.listOfUsbToken = [];
			// 					this._utilCmp.showTranslateSnackbar(res.msg, "error");
			// 					this.setMessage(res.msg);
			// 				}
			// 			}
			// 			this.stopLoading();
			// 			return;
			// 		});
			// 	} else {
			// 		this.setMessage('L???i k???t n???i!');
			// 		this._utilCmp.showTranslateSnackbar("L???i k???t n???i!", "error");
			// 		this.stopLoading();
			// 		return;
			// 	}
			// });
		} catch (error) {
			console.log(error);
			this.stopLoading();
			return;
		}
	}

	ngOnDestroy() {
		//client.disconnectWs(this.wsUrl + '/healthcheck');
		//console.log(this.sub);
	}

	checkTaxCodeBeforeSign(currentTaxCode, usbTaxCode) {
		const tempMst = usbTaxCode.split(":");
		if(tempMst[0] === "MST" && tempMst[1] === currentTaxCode){
			this.isSameTaxCode = true;
			return true;
		}
		this.isSameTaxCode = false;
		return false;
	}

	async uploadFileSignedToSystem() {

		this.rrService.uploadsignedV2(this.base64, this.cttbIssueRegistryAttachmentId).then(res => {
			console.log(res);
			if (res.status === "SUCCESS") {
				this._utilCmp.showTranslateSnackbar('K?? s??? th??nh c??ng!', "complete");
				this.messageInfo = '';
				this.stopLoading();
				//this.matDialogRef.close(true);
				this.dialogRef.closeAll();
				return;
			}
		})
	}

	onChangeUsbToken(event) {
		this.currentItemSelected = event.value;
	}

	checkLogin(tokenSerial, tokenPin, callBack) {

		const params = {
			"tokenSerial": tokenSerial,
			"tokenPin": tokenPin,
			"listUid": [],
			"certSerial": "",
			"version": "1.0.0"
		}
		this.rrService.checkLogin(this.wsUrl, params, (res) => {
			return callBack(res);
		});
	}

	signDocTest(){
		//this.matDialogRef.close(true);

		this.dialogRef.closeAll();
	}

	signDoc() {

		// Begin use tool sign api 2
		this.isLoading = true;

		if (this.form.valid) {

			const usbTaxCode = this.form.get("usbToken").value.subjectID;

			if (this.checkTaxCodeBeforeSign(this.currentTaxCode, usbTaxCode)) {
				const tokenSerial = this.form.get("usbToken").value.tokenSerial;
				//const tokenPin = this.form.get("tokenPin").value;

				this.messageInfo = "H??? th???ng ??ang ki???m tra th??ng tin thi???t b???!";
				this._changeDetectorRef.detectChanges();
				this.checkLogin(tokenSerial, this.tokenPin, (res) => {
					console.log(res);
					if (res.msgCode === "SUCCESS") {
						//if (res.msgCode) {
						const param = {
							"tokenInfoDto": {
								"tokenSerial": tokenSerial,
								"tokenPin": this.tokenPin, // get from login token pin form
								"version": "1.0.0",
							},
							"dataList": [{ "originalFileName": this.originalFileName, "documentBase64": this.base64, "mimeType": "application/pdf" }],
							"cmd": {
								"signerName": "",
								"signerLocation": "Ho Chi Minh",
								"signatureReason": "I agree the agreement",
								"signingHints": {
									"showSignatureImage": true,
									"location": "LAST_PAGE",
									"x": 0.0,
									"y": 0.0,
									"width": 233,
									"height": 64,
									"marginX": 121,
									"marginY": 25,
									"fieldName": "VPB_FC",
									"signaturePosition": "BOTTOM_RIGHT"
								},
								"signerType": "O"
							}
						}

						this.messageInfo = "??ang k?? s??? vui l??ng ?????i...";
						const signDoc = this.rrService.signDoc(this.wsUrl, param, (res) => {
							console.log(res);
							if (res.code === "SUCCESS") {
								this.base64 = res.resultData[0].resultData;
								this.uploadFileSignedToSystem();
							} else {
								let errorMessage = '';
								if (res.code === "CKR_PIN_INCORRECT") {
									errorMessage = "Sai m?? s??? PIN!";
								}
								if (res.code === "SERIAL_USB_NOT_MATCH") {
									errorMessage = "Serial usb token kh??ng tr??ng v???i ???? ch???n!";
								}
								if (res.code === "CAN_NOT_FIND_VALID_CERT") {
									errorMessage = "Kh??ng t??m th???y cert h???p l???!";
								}
								if (res.code === "USB_TOKEN_NOT_FOUND") {
									errorMessage = "Kh??ng ph??t hi???n thi???t b??? USB token!";
								}
								if (res.msgCode === "USB_TOKEN_EXPIRED") {
									errorMessage = "Usb token h???t h???n!";
								}
								this.isLoading = false;
								this.setMessage(errorMessage);
								this._utilCmp.showTranslateSnackbar(errorMessage, 'error');
								return;
							}

						});
					} else {
						let errorMessage = '';
						if (res.msgCode === "CKR_PIN_INCORRECT") {
							errorMessage = "Sai m?? s??? PIN!";
						}
						if (res.msgCode === "SERIAL_USB_NOT_MATCH") {
							errorMessage = "Serial usb token kh??ng tr??ng v???i ???? ch???n!";
						}
						if (res.msgCode === "TOKEN_SERIAL_EMTY") {
							errorMessage = "Serial usb token tr???ng tr??n";
						}
						if (res.msgCode === "USB_TOKEN_NOT_FOUND") {
							errorMessage = "Kh??ng ph??t hi???n thi???t b??? USB token!";
						}
						if (res.msgCode === "USB_TOKEN_EXPIRED") {
							errorMessage = "Usb token h???t h???n!";
						}
						this.isLoading = false;
						this.setMessage(errorMessage);
						this._utilCmp.showTranslateSnackbar(errorMessage, "error");
						return;
					}
				});
			}else{
				this.isLoading = false;
				this.setMessage("MST tr??n token kh??ng tr??ng v???i MST doanh nghi???p ph??t h??nh ch???ng t???!");
				this._utilCmp.showTranslateSnackbar("MST tr??n token kh??ng tr??ng v???i MST doanh nghi???p ph??t h??nh ch???ng t???!", "error");
				return;
			}
		}
	}


	// https://ionicframework.com/blog/converting-a-base64-string-to-a-blob-in-javascript/
	// const base64Response = await fetch(`data:application/pdf;base64,${base64}`);
	// const blob = await base64Response.blob();
	// console.log(blob);

	// const anchorElement = document.createElement('a');
	// anchorElement.download = fileName;
	// anchorElement.href = window.URL.createObjectURL(blob);
	// anchorElement.click();

	// var file = new File([blob], fileName);
	// console.log(file);

	// this.rrService.uploadsigned(file).then(res => {
	// 	console.log(res);
	// })

}
