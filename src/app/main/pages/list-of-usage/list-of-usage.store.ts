import { Injectable } from '@angular/core';
import { FN_NAMES } from 'app/main/shared/const/Permission';
import { BaseStoreService } from 'app/main/shared/utils/BaseStoreService';
import { AppState, HttpHelper, UtilCommon } from '../../shared';
import { LIST_OF_USAGE_CONSTANT } from './list-of-usage.constant';
import { ListOfUsageService } from './list-of-usage.service';
import { IRevonue } from './models/revonue.interface';

// @Injectable({
//     providedIn: 'root'
// })
@Injectable()
export class ListOfUsageStore extends BaseStoreService {

    public isFirstEnterSreen = true;
    public isRowSelected = false;
    public gridConfigs: any = {
        editColDefs: {
            status: {
                cellRenderer: (params) => {
                    if (params.value) {
                        const value = params.context.parent._translateService.instant('REPORT_LIST.STATUS_' + params.value);

                        const eDiv = document.createElement('div');
                        if (params.value === 1) {
                            eDiv.innerHTML = '<span style="cursor: pointer;color: blue;" class="status_click">' + value + '</span>';
                            const eButton = eDiv.querySelectorAll('.status_click')[0];
                            eButton.addEventListener('click', () => {
                                params.context.parent.downloadFile(params.node.data);
                            });
                        } else {
                            eDiv.innerHTML = '<span>' + value + '</span>';
                        }


                        return eDiv;
                        // return '<span style="cursor: pointer;color: blue;">'+params.value+'</span>';
                    }
                    return '';
                }
            },
        },
        delCols: this.delCols(),
        colsOrder: {
            [LIST_OF_USAGE_CONSTANT.COLUMN.DESCRIPTION]: 1,
            [LIST_OF_USAGE_CONSTANT.COLUMN.STATUS]: 2,
            [LIST_OF_USAGE_CONSTANT.COLUMN.MAKER_ID]: 3,
            [LIST_OF_USAGE_CONSTANT.COLUMN.MAKER_DATE]: 4,
        },
        visibleCols: [
            LIST_OF_USAGE_CONSTANT.COLUMN.DESCRIPTION,
            LIST_OF_USAGE_CONSTANT.COLUMN.STATUS,
            LIST_OF_USAGE_CONSTANT.COLUMN.MAKER_ID,
            LIST_OF_USAGE_CONSTANT.COLUMN.MAKER_DATE,
        ],
        exportCols: [
            LIST_OF_USAGE_CONSTANT.COLUMN.DESCRIPTION,
            LIST_OF_USAGE_CONSTANT.COLUMN.STATUS,
            LIST_OF_USAGE_CONSTANT.COLUMN.MAKER_ID,
            LIST_OF_USAGE_CONSTANT.COLUMN.MAKER_DATE,
        ],
    };

    constructor(
        public listOfUsageService: ListOfUsageService,
        private httpHelper: HttpHelper,
        public _utils: UtilCommon,
        public _appState: AppState) {
        super(listOfUsageService, _utils, _appState);
    }

    initPemision(): void {
        if (!this._utils.checkIsNotNull(this.permissions)) {
            this.permissions = {
                create: this._appState.hasPermission(FN_NAMES.ACCOUNT_CREATE) || this._appState.hasPermission(FN_NAMES.ACCOUNT_CREATE_QTSC),
                delete: this._appState.hasPermission(FN_NAMES.ACCOUNT_DELETE) || this._appState.hasPermission(FN_NAMES.ACCOUNT_DELETE_QTSC),
                export: this._appState.hasPermission(FN_NAMES.ACCOUNT_EXPORT) || this._appState.hasPermission(FN_NAMES.ACCOUNT_EXPORT_QTSC),
                share: this._appState.hasPermission(FN_NAMES.IDL_SHARE_ACCOUNT) || this._appState.hasPermission(FN_NAMES.IDL_SHARE_ACCOUNT_QTSC)
            };
        }
    }

    delCols(): any {
        return [
            LIST_OF_USAGE_CONSTANT.COLUMN.MOD,
            LIST_OF_USAGE_CONSTANT.COLUMN.REPORT_NAME,
            LIST_OF_USAGE_CONSTANT.COLUMN.FILE_PATH,
            LIST_OF_USAGE_CONSTANT.COLUMN.AUTH_STATUS,
            LIST_OF_USAGE_CONSTANT.COLUMN.TENANT_CODE,
            LIST_OF_USAGE_CONSTANT.COLUMN.APP_CODE,
            LIST_OF_USAGE_CONSTANT.COLUMN.RECORD_STATUS,
            LIST_OF_USAGE_CONSTANT.COLUMN.CHECKER_DATE,
            LIST_OF_USAGE_CONSTANT.COLUMN.BUSINESS_UNITCODE,
            LIST_OF_USAGE_CONSTANT.COLUMN.EXCEPTION_CONTENT,
            LIST_OF_USAGE_CONSTANT.COLUMN.CHECKER_ID,
            LIST_OF_USAGE_CONSTANT.COLUMN.ID,
        ];
    }

    getListBusinessUnitActiveForUser(): Promise<any> {
        return this.listOfUsageService.getListBusinessUnitActiveForUser();
    }

    getListPatternByBuTaxCode(buTaxCode): Promise<any> {
        return this.listOfUsageService.getListPatternByBuTaxCode(buTaxCode);
    }

    getListSerial(buTaxCode, pattern): Promise<any> {
        return this.listOfUsageService.getListSerial(buTaxCode, pattern);
    }

    createRuntimeWithExport(data: IRevonue): Promise<any> {
        return this.listOfUsageService.createRuntimeWithExport(data);
    }

    getReportRuntimeByid(reportId: number): Promise<any> {
        return this.listOfUsageService.getReportRuntimeByid(reportId);
    }

    handleGetDataFromReport(dataPdf: any, utilsComp: any, callback: any = null, fileName: string = ''): any {
        if (!dataPdf) {
            this.isLoading = false;
            utilsComp.openSnackBar('Không thể xuất báo cáo', 'error');
            return;
        }
        let countInterval = 1;
        const interval: any = setInterval(() => {
            if (countInterval === 6) {
                this.isLoading = false;
                utilsComp.generateDialogConfirm(() => {
                    this.isLoading = false;
                    this._utils.routingBackPage('/report-gdt/list');

                }, null, 'Vui lòng chờ trong giây lát.', 'Báo cáo đang chờ xuất.');
                clearInterval(interval);
                return;
            }
            countInterval++;
            this.handelGetReportRuntimeByid(dataPdf, interval, utilsComp, callback, fileName);
        }, 10000);
        setTimeout(() => {
            this.handelGetReportRuntimeByid(dataPdf, interval, utilsComp, callback, fileName);
        }, 3000);
    }

    handelGetReportRuntimeByid(dataPdf, interval, utilsComp, callback, fileName): any {
        this.getReportRuntimeByid(dataPdf).then((dataReport: any) => {
            if (!dataReport) {
                clearInterval(interval);
                this.isLoading = false;
                utilsComp.openSnackBar('Không thể xuất báo cáo', 'error');
                return;
            }
            if (dataReport.status === 1 && dataReport.filePath) {
                clearInterval(interval);
                let typePdf = 'pdf';
                if (dataReport.runtimeValue.exportFormat.toLowerCase() === 'xlsx'
                    || dataReport.runtimeValue.exportFormat.toLowerCase() === 'xls') {
                    typePdf = 'xlsx';
                }
                if (callback && typePdf === 'pdf') {
                    this.handleDownloadFileReport(dataReport, utilsComp, typePdf, callback.call(), fileName);
                } else {
                    this.handleDownloadFileReport(dataReport, utilsComp, typePdf, null, fileName);
                }
                return;
            } else if (dataReport.status === 2) {
                clearInterval(interval);
                this.isLoading = false;
                utilsComp.openSnackBar('Không thể xuất báo cáo', 'error');
            }
        }).catch(() => {
            clearInterval(interval);
            this.isLoading = false;
            utilsComp.openSnackBar('Không thể xuất báo cáo', 'error');
        });
    }

    handleDownloadFileReport(dataReport: any, utilsCmp: any, typeFile: string, callback: any = null, fileName: string): void {
        if (typeFile === 'pdf') {
            this.downloadReportPDFNew(dataReport.filePath).then((report: any) => {
                // if (report) {
                //     const fileURL: any = URL.createObjectURL(report);
                //     this.isLoading = false;
                //     if (callback) {
                //         callback.call();
                //     }
                //     setTimeout(() => {
                //         const _iFrame: any = document.getElementById('dialog-frame');
                //         _iFrame.setAttribute('src', fileURL + '#zoom=100');
                //     }, 300);
                // } else {
                //     utilsCmp.openSnackBar('Tải báo cáo thất bại', 'error');
                // }
                this.downloadFile(report, fileName, typeFile);
            }).catch(() => {
                this.isLoading = false;
                utilsCmp.openSnackBar('Tải báo cáo thất bại', 'error');
            });
            return;
        } else {
            this.downloadReportNew(dataReport.filePath).then((report: any) => {
                if (report) {
                    this.downloadFile(report, fileName, typeFile);
                } else {
                    utilsCmp.openSnackBar('Tải báo cáo thất bại', 'error');
                }
            }).catch(() => {
                this.isLoading = false;
                utilsCmp.openSnackBar('Tải báo cáo thất bại', 'error');
            });
        }
    }

    downloadFile(report, fileName, typeFile): any {
        const fileURL: any = URL.createObjectURL(report);
        this.isLoading = false;
        const anchor: any = document.createElement('a');
        anchor.href = fileURL;
        anchor.download = fileName + '.' + typeFile;
        anchor.click();
    }

    downloadReportNew(filePath: string): Promise<any> {
        return this.httpHelper.methodGetBlobService(LIST_OF_USAGE_CONSTANT.API.EXPORT + filePath);
    }

    downloadReportPDFNew(filePath: string): Promise<any> {
        return this.httpHelper.methodGetPdfService(LIST_OF_USAGE_CONSTANT.API.EXPORT + filePath);
    }
}
