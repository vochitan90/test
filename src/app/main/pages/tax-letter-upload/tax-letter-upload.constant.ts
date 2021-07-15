import { APP_CONFIG } from 'app/app.config';

export class TAX_LETTER_UPLOAD_CONSTANT {
    static readonly TAX_LETTER_UPLOAD_ATTRIBUTE = 'TAX_LETTER_UPLOAD_ATTRIBUTE';
    static readonly SCREEN = {
        ID: "TAX_LETTER_UPLOAD",
        ACCOUNT: 'ACCOUNT',
        CREATE_ACCOUNT: 'create'
    };
    static readonly LINK = {
        LIST: '/upload-period/list',
    };
    static readonly IMPORT_CONTRACT = 'IMPORT_CONTRACT';
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
        //contractNo: 'Số quyết định',
        //contractDate: 'Ngày quyết định',
        // bpbJoinDate: 'Ngày vào công ty',
        // contractEffectiveDate: 'Ngày hiệu lực',
        // contractExpiredDate: 'Ngày kết thúc',
        // bpbEmpPosition: 'Chức danh',
        // bpbEmpLevel: 'Cấp bậc',
        // bpbEmpSalary: 'Lương chính',
        // bpbEmpAllowance: 'Phụ cấp',
        // contractPlace: 'Nơi ký hợp đồng',
        // contractSigndate: 'Ngày ký hợp đồng',
        // docDuplicate: 'Trùng tài liệu',


        // New From Tan
        taxincomeLetterCode: "Mã",
        empPayYear: "Xác nhận thu nhập năm",
        empName: "Họ và tên",
        empCode: "Mã nhân viên",
        empJobtile: "Chức vụ",
        vietnamWorkDate: "Ngày đến Việt Nam",
        empPayFromDate: "Thu nhập từ ngày",
        empPayToDate: "Thu nhập đến ngày",
        empIncomeTotal: "Số tiền",
        empIncomeVietnam: "Tại Việt Nam",
        empIncomeForeign: "Tại nước ngoài",
        empIncomeForeignWithheld: "Các khoản bị khấu trừ ngoài Việt Nam",
        empTaxincomeWithheld: "Thuế thu nhập cá nhân",
        empInsuranceWithheld: "Bảo hiểm xã hội hoặc các loại bảo hiểm bắt buộc tương tự",
        empOtherWithheld: "Các khoản bị khấu trừ khác",
        empRent: "Số tiền thuê nhà tại Việt Nam",
        contractNo: "Hợp đồng lao động số",
        contractDate: "Ngày hợp đồng",


    };
    static readonly COLUMN = {
        FILE_PATH: 'filePath',
        DESCRIPTION: 'description',
        CONTENT: 'content',
        MOD_NO: 'modNo',
        COMPAY_ID: 'companyId',
        RECORD_STATUS: 'recordStatus',
        CHECKER_DATE: 'checkerDate',
        CHECKER_ID: 'checkerId',
        ID: 'id',
        FUNCTION_KEY: 'functionKey',
        FTS_VALUE: 'ftsValue',
        MAKER_ID: 'makerId',
        MAKER_DATE: 'makerDate',
        PERCENT_PROCESS: 'percentProcess',
        PROCESS_NAME: 'processName',
        PROCESS_CODE: 'processCode',
        AUTH_STATUS: 'authStatus',
        STATUS: 'status',
        FILE_NAME: 'fileName',
        TENANT_CODE: 'tenantCode',
        RESULT: 'result',
    };
    static readonly API = {
        GET_SCHEMA_PIVOT: APP_CONFIG.MCR_ETAX + 'services/processUploadServices/getSchemaPivot',
        PIVOT_PAGING: APP_CONFIG.MCR_ETAX + 'services/processUploadServices/pivotPaging',
        PIVOT_COUNT: APP_CONFIG.MCR_ETAX + 'services/processUploadServices/pivotCount',
        LIST_PROCESS_DETAIL_STATUS: APP_CONFIG.MCR_ETAX + 'services/processUploadServices/listProcessDetailStatus',
        LIST_PROCESS_DETAIL_VALID: APP_CONFIG.MCR_ETAX + 'services/processUploadServices/listProcessDetailValid',
        
        DOWNLOAD_FILE: APP_CONFIG.MCR_ETAX + 'api/file/downloadimport',
        //UPLOAD_FILE: APP_CONFIG.MCR_EDOC + 'api/file/processImport',
        UPLOAD_FILE: APP_CONFIG.MCR_ETAX + 'api/file/uploadTemp',
        ISSUE_IMPORT: APP_CONFIG.MCR_ETAX + 'services/processUploadServices/issueImport',


        // later
        CREATE: APP_CONFIG.MCR_ETAX + 'services/taxincomeLetterServices/processUploadTaxincomeLetter',
        UPDATE: APP_CONFIG.MCR_ETAX + 'accountService/update',
        DELETE: APP_CONFIG.MCR_ETAX + 'accountService/delete',
        BULK_DELETE: APP_CONFIG.MCR_ETAX + 'accountService/bulkDelete',
        PIVOT_PAGING_CONTRACT: APP_CONFIG.MCR_ETAX + 'accountService/pivotPagingByContract',
    };
}
