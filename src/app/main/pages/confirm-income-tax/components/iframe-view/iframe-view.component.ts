import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { UtilCommon, UtilComponent } from 'app/main/shared';

@Component({
	selector: 'einvoice-iframe-view',
	templateUrl: './iframe-view.component.html',
	styleUrls: ['./iframe-view.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IframeViewComponent implements OnInit, OnDestroy {

	showIframe: any;
	_previewUrl: any;
	constructor(
		private _changeDetectorRef: ChangeDetectorRef,
		public matDialogRef: MatDialogRef<IframeViewComponent>,
		@Inject(MAT_DIALOG_DATA) public _dialogData: any,
		private _utils: UtilCommon,
        private _utilsCom: UtilComponent,
		private sanitizer: DomSanitizer) {

	}

	ngOnInit(): void {
		
		if (this._dialogData) {
			const url = this._dialogData.previewPdf;
			//const url = 'http://www.africau.edu/images/default/sample.pdf';
    		this._previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
			this._changeDetectorRef.detectChanges();
		}		
	}

	async downloadFile() : Promise<void>{
		// const id = this._dialogData.data.id;
		// const dataFile = await this._releaseRegistrationService.downloadFile(id);
		// if (this._utils.checkIsNotNull(dataFile)) {
		// 	const anchorElement = document.createElement('a');
        //     anchorElement.download = dataFile.fileName;
        //     anchorElement.href = window.URL.createObjectURL(dataFile.blob);
		// 	anchorElement.click();
		// }
	}

	print(){
		var myIframe = document.getElementById("viewfile")['contentWindow'];
            myIframe.focus();
            myIframe.print();
            return false;
	}

	ngOnDestroy(): void {
		this.showIframe = false;
		this._previewUrl = '';
	}
}
