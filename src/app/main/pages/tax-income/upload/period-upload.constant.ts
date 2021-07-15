import { APP_CONFIG } from 'app/app.config';

export class UPLOAD_PERIOD_CONSTANT {
    static readonly PROCESS_UPLOAD_ATTRIBUTE = 'TAXINCOME_PROCESS_UPLOAD_ATTRIBUTE';
    static readonly LINK = {
        LIST: '/upload-period/list',
    };
    static readonly SCREEN = {
        PROCESS_UPLOAD: 'PROCESS_UPLOAD',
    };
    static readonly STATUS_DETAIL = {
        INVALID: 0,
        VALID: 1,
        ISSUED: 2,
        ISSUED_FAIL: 3
    };
    static readonly FIELD_UPLOAD_EXCEL = {
        // contractGroupCode: 'Nhóm hợp đồng',
        // bpaCompanyName: 'Tên công ty',
        // bpaUnitName: 'Tên phòng ban',
        // bpaCompanyAddress: 'Địa chỉ công ty',
        // bpaCompanyPhone: 'Điện thoại công ty',
        // bpaRepresentativeName: 'Họ tên người đại diện',
        // bpaRepresentativePosition: 'Chức danh người đại diện',
        // bpbEmpCode: 'Mã nhân viên',
        // bpbEmpName: 'Họ tên nhân viên',
        // bpbBirthDate: 'Ngày sinh',
        // bpbIdNumber: 'Số CMND',
        // bpbIdIssueDate: 'Ngày cấp CMND',
        // bpbIdIssuePlace: 'Nơi cấp CMND',
        // bpbPrimaryAddress: 'Địa chỉ thường trú',
        // bpbContactEmail: 'Email liên hệ',
        // bpbContactPhone: 'Số điện thoại liên hệ',
        // contractNo: 'Số quyết định',
        // contractDate: 'Ngày quyết định',
        // bpbJoinDate: 'Ngày vào công ty',
        // contractEffectiveDate: 'Ngày hiệu lực',
        // contractExpiredDate: 'Ngày kết thúc',
        // bpbEmpPosition: 'Chức danh',
        // bpbEmpLevel: 'Cấp bậc',
        // bpbEmpSalary: 'Lương chính',
        // bpbEmpAllowance: 'Phụ cấp',
        // contractPlace: 'Nơi ký hợp đồng',
        // contractSigndate: 'Ngày ký hợp đồng',
        docDuplicate: 'Trùng tài liệu',

        buAddress: 'Địa chỉ  tổ chức trả thu nhập',
        buCode: 'buCode',
        buEmail: 'Email tổ chức trả thu nhập',
        buId: 'buId',
        buName: 'Tên tổ chức trả thu nhập',
        buPhone: 'Điện thoại liên hệ tổ chức trả thu nhập',
        buTaxcode: 'Mã số thuế tổ chức trả thu nhập',
        companyCode: 'Mã công ty',

        empContactAddress: 'Địa chỉ liên hệ',
        empContactPhone: 'Điện thoại liên hệ',
        empIncomeType: 'Khoản thu nhập',
        empCode: 'Mã nhân viên',
        empName: 'Họ tên',
        empTaxcode: 'Mã số thuế',
        empNationality: 'Quốc tịch',
        empIsResident: 'Cá nhân cư trú',
        empPayYear: 'Năm trả thu nhập',
        empPayFromMonth: 'Tháng bắt đầu trả thu nhập',
        empPayToMonth: 'Tháng kết thúc trả thu nhập',
        empPersonaltaxWithheld: 'Số tiền thuế',
        empTaxincomeCalculation: 'Tổng thu nhập tính thuế',
        empTaxincomeWithheld: 'Số thuế thu nhập cá nhân đã khấu trừ',
        makerId: 'Người tạo',
        pattern: 'Mẫu số',
        rowIndex: 'Dòng',
        serial: 'Ký hiệu',
    };
    static readonly COLUMN = {
        RESULT: 'result',
        FILE_NAME: 'fileName',
        MAKER_DATE: 'makerDate',
        AUTH_STATUS: 'authStatus',
        FILE_PATH: 'filePath',
        DESCRIPTION: 'description',
        TENANT_CODE: 'tenantCode',
        MOD_NO: 'modNo',
        RECORD_STATUS: 'recordStatus',
        CHECKER_DATE: 'checkerDate',
        PROCESS_NAME: 'processName',
        PROCESS_CODE: 'processCode',
        CHECKER_ID: 'checkerId',
        ID: 'id',
        FUNCTION_KEY: 'functionKey',
        FTS_VALUE: 'ftsValue',
        MAKER_ID: 'makerId',
        PERCENT_PROCESS: 'percentProcess',
        STATUS: 'status',
    };
    static readonly API = {
        GET_SCHEMA_PIVOT: APP_CONFIG.MCR_ETAX + 'services/processUploadServices/getSchemaPivot',
        PIVOT_PAGING: APP_CONFIG.MCR_ETAX + 'services/processUploadServices/pivotPaging',
        PIVOT_COUNT: APP_CONFIG.MCR_ETAX + 'services/processUploadServices/pivotCount',
        LIST_PROCESS_DETAIL_STATUS: APP_CONFIG.MCR_ETAX + 'services/processUploadServices/listProcessDetailStatus',
        LIST_PROCESS_DETAIL_VALID: APP_CONFIG.MCR_ETAX + 'services/processUploadServices/listProcessDetailValid',
        DOWNLOAD_FILE: APP_CONFIG.MCR_ETAX + 'api/file/downloadimport',
        ISSUE_IMPORT: APP_CONFIG.MCR_ETAX + 'services/processUploadServices/issueImport',
    };
}