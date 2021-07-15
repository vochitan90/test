import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISSUE_REGISTRY_UPLOAD_CONSTANT } from '../../issue-registry-upload/issue-registry-upload.constant';
import { ICertErrorText } from '../../issue-registry-upload/models/content.interface';
import { ICertInfo, ICertVadilator } from '../models/releaseRegistration.interface';
import { ReleaseRegistrationStore } from '../releaseRegistration.store';

@Component({
	selector: 'app-pdf-signed-info',
	templateUrl: './pdf-signed-info.component.html',
	styleUrls: ['./pdf-signed-info.component.scss']
})
export class PdfSignedInfoComponent implements OnInit {

	TAX_INCOME_STATUS = ISSUE_REGISTRY_UPLOAD_CONSTANT.STATUS;
	CERT_TAXCODE = ISSUE_REGISTRY_UPLOAD_CONSTANT.CERT_TAXCODE;
	CERT_STATUS = ISSUE_REGISTRY_UPLOAD_CONSTANT.CERT_STATUS;

	// Check chữ ký số
	isCertError = false;
	isCertStatusGood = false;
	isCertTaxCodeGood = false;
	isCertExpired = false;
	certErrorText: ICertErrorText = {};

	certInfo: ICertInfo;
	certValidator: ICertVadilator;

	constructor(public _matDialogRef: MatDialogRef<PdfSignedInfoComponent>,
		@Inject(MAT_DIALOG_DATA) public _dialogData: any, private store: ReleaseRegistrationStore, private _changeDetectorRef: ChangeDetectorRef) { }

	validateCerInfo(): void {
		// Kiểm tra trạng thái chũ ký có lỗi không
		if (this.certInfo) {
			// Kiểm tra trạng thái chữ ký
			if (this.certInfo?.revocation?.certStatus === this.CERT_STATUS.GOOD) {
				this.isCertStatusGood = true;
			}
			else {
				this.isCertStatusGood = false;
				this.isCertError = true;
				switch (this.certInfo?.revocation?.certStatus) {
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
			if (this.certValidator?.taxCode) {
				this.isCertTaxCodeGood = false;
				this.isCertError = true;
				switch (this.certValidator?.taxCode) {
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
			if (this.certValidator?.cert && this.certValidator?.cert === 'EXPIRED') {
				this.isCertExpired = true;
				this.isCertError = true;
				this.certErrorText.expired = 'Chữ ký số không còn hiệu lực tại thời điểm ký';
			} else {
				this.isCertExpired = false;
			}

			this._changeDetectorRef.detectChanges();
		}
	}

	ngOnInit(): void {
		if (this._dialogData) {
			this.store.getCertByAggid(this._dialogData.aggId).then(res => {
				console.log(res);
				this.certInfo = res.cerInfo;
				this.certValidator = res.cerValidator;
				this.validateCerInfo();
			});
		}
	}

}
