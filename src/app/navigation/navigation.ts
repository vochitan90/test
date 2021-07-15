import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    // {
    //     'id': 'applications',
    //     'title': 'Ứng dụng',
    //     'type': 'group',
    //     'icon': 'apps',
    //     'children': [
    //         // {
    //         //     id: 'document',
    //         //     title: ' Quản lý E-Tax',
    //         //     type: 'collapsable',
    //         //     icon: 'dashboard',
    //         //     children: [
    //         //         {
    //         //             id: 'documentSigned',
    //         //             title: 'Tài liệu hoàn tất ký duyệt',
    //         //             type: 'item',
    //         //             url: '/document/list',
    //         //             exactMatch: true
    //         //         },
    //         //         {
    //         //             id: 'document_create',
    //         //             title: 'Tài liệu từ chối ký duyệt',
    //         //             type: 'item',
    //         //             url: '/document/create',
    //         //             exactMatch: true
    //         //         },
    //         //         {
    //         //             id: 'document_create',
    //         //             title: 'Tài liệu chờ ký duyệt',
    //         //             type: 'item',
    //         //             url: '/document/create',
    //         //             exactMatch: true
    //         //         },
    //         //         {
    //         //             id: 'document_create',
    //         //             title: 'Tài liệu có link ký bị khóa',
    //         //             type: 'item',
    //         //             url: '/document/create',
    //         //             exactMatch: true
    //         //         },
    //         //         {
    //         //             id: 'document_create',
    //         //             title: 'Ký duyệt tài liệu',
    //         //             type: 'item',
    //         //             url: '/document/create',
    //         //             exactMatch: true
    //         //         }
    //         //     ]
    //         // },
    //         // {
    //         //     id: 'upload-period',
    //         //     title: 'Quản lý đợt upload tài liệu',
    //         //     type: 'collapsable',
    //         //     icon: 'dashboard',
    //         //     children: [
    //         //         {
    //         //             id: 'upload-period_list',
    //         //             title: 'Danh sách',
    //         //             type: 'item',
    //         //             url: '/upload-period/list',
    //         //             exactMatch: true
    //         //         },
    //         //         {
    //         //             id: 'upload-period_create',
    //         //             title: 'Tạo mới',
    //         //             type: 'item',
    //         //             url: '/upload-period/create',
    //         //             exactMatch: true
    //         //         }
    //         //     ]
    //         // },
    //         // {
    //         //     id: 'userMangement',
    //         //     title: 'Quản lý người dùng',
    //         //     type: 'collapsable',
    //         //     icon: 'dashboard',
    //         //     children: [
    //         //         {
    //         //             id: 'user_list',
    //         //             title: 'Danh sách',
    //         //             type: 'item',
    //         //             url: '/user/list',
    //         //             exactMatch: true
    //         //         },
    //         //         {
    //         //             id: 'user_create',
    //         //             title: 'Tạo mới',
    //         //             type: 'item',
    //         //             url: '/user/create',
    //         //             exactMatch: true
    //         //         }
    //         //     ]
    //         // },
    //         // {
    //         //     id: 'template',
    //         //     title: 'Quản lý mẫu',
    //         //     type: 'collapsable',
    //         //     icon: 'dashboard',
    //         //     children: [
    //         //         {
    //         //             id: 'template_list',
    //         //             title: 'Danh sách',
    //         //             type: 'item',
    //         //             url: '/template/list',
    //         //             exactMatch: true
    //         //         },
    //         //         {
    //         //             id: 'template_create',
    //         //             title: 'Tạo mới',
    //         //             type: 'item',
    //         //             url: '/template/create',
    //         //             exactMatch: true
    //         //         },
    //         //         {
    //         //             id: 'template_approve',
    //         //             title: 'Duyệt mẫu',
    //         //             type: 'item',
    //         //             url: '/template/pending',
    //         //             exactMatch: true
    //         //         }
    //         //     ]
    //         // },
    //         // {
    //         //     id: 'case',
    //         //     title: 'Quản lý bộ mẫu',
    //         //     type: 'collapsable',
    //         //     icon: 'dashboard',
    //         //     children: [
    //         //         {
    //         //             id: 'case_list',
    //         //             title: 'Danh sách',
    //         //             type: 'item',
    //         //             url: '/case/list',
    //         //             exactMatch: true
    //         //         },
    //         //         {
    //         //             id: 'case_create',
    //         //             title: 'Tạo mới',
    //         //             type: 'item',
    //         //             url: '/case/create',
    //         //             exactMatch: true
    //         //         },
    //         //         {
    //         //             id: 'case_list_pending',
    //         //             title: 'Duyệt bộ mẫu',
    //         //             type: 'item',
    //         //             url: '/case/pending',
    //         //             exactMatch: true
    //         //         }
    //         //     ]
    //         // },
    //         // {
    //         //     id: 'contact',
    //         //     title: 'Quản lý quy trình',
    //         //     type: 'collapsable',
    //         //     icon: 'dashboard',
    //         //     children: [
    //         //         {
    //         //             id: 'workflow_list',
    //         //             title: 'Danh sách',
    //         //             type: 'item',
    //         //             url: '/workflow/list',
    //         //             exactMatch: true
    //         //         },
    //         //         {
    //         //             id: 'workflow_list_config',
    //         //             title: 'Danh sách cấu hình',
    //         //             type: 'item',
    //         //             url: '/workflow/configs',
    //         //             exactMatch: true
    //         //         },
    //         //         {
    //         //             id: 'workflow_config',
    //         //             title: 'Cấu hình sử dụng qui trình',
    //         //             type: 'item',
    //         //             url: '/workflow/config',
    //         //             exactMatch: true
    //         //         }
    //         //     ]
    //         // },
    //         {
    //             id: 'organizationInformation',
    //             title: 'Thông tin tổ chức',
    //             type: 'item',
    //             url: '/organizationInformation',
    //             exactMatch: true
    //         },
    //         {
    //             id: 'releaseRegistrationManagement',
    //             title: 'Quản lý đăng ký phát hành',
    //             type: 'collapsable',
    //             icon: 'dashboard',
    //             children: [
    //                 {
    //                     id: 'release_registration_list',
    //                     title: 'Danh sách đăng ký phát hành',
    //                     type: 'item',
    //                     url: '/release-registration/list',
    //                     exactMatch: true
    //                 },
    //                 {
    //                     id: 'release_registration_create',
    //                     title: 'Tạo mới đăng ký phát hành',
    //                     type: 'item',
    //                     url: '/release-registration/create',
    //                     exactMatch: true
    //                 },
    //             ]
    //         },
    //         {
    //             id: 'personalIncomeTaxLicenseManagement',
    //             title: 'Quản lý chứng từ thuế TNCN',
    //             type: 'collapsable',
    //             icon: 'dashboard',
    //             children: [
    //                 {
    //                     id: 'personal_income_tax_license_list',
    //                     title: 'Danh sách chứng từ',
    //                     type: 'item',
    //                     url: '/personal-income-tax-license/list',
    //                     exactMatch: true
    //                 },
    //                 {
    //                     id: 'personal_income_tax_license_create',
    //                     title: 'Tạo mới chứng từ',
    //                     type: 'item',
    //                     url: '/personal-income-tax-license/create',
    //                     exactMatch: true
    //                 },
    //                 // {
    //                 //     id: 'personal_income_tax_license_update',
    //                 //     title: 'Cập nhật chứng từ',
    //                 //     type: 'item',
    //                 //     url: '/personal-income-tax-license/update',
    //                 //     exactMatch: true
    //                 // },
    //                 // {
    //                 //     id: 'personal_income_tax_license_replace',
    //                 //     title: 'Thay thế chứng từ',
    //                 //     type: 'item',
    //                 //     url: '/personal-income-tax-license/replace',
    //                 //     exactMatch: true
    //                 // },
    //                 // {
    //                 //     id: 'personal_income_tax_license_delete',
    //                 //     title: 'Hủy chứng từ',
    //                 //     type: 'item',
    //                 //     url: '/personal-income-tax-license/delete',
    //                 //     exactMatch: true
    //                 // },
    //             ]
    //         },
    //         {
    //             id: 'releaseLicenseManagement',
    //             title: 'Quản lý đợt phát hành chứng từ',
    //             type: 'collapsable',
    //             icon: 'dashboard',
    //             children: [
    //                 {
    //                     id: 'release_license_list',
    //                     title: 'Danh sách đợt phát hành',
    //                     type: 'item',
    //                     url: '/release-license/list',
    //                     exactMatch: true
    //                 },
    //                 {
    //                     id: 'release_license_create',
    //                     title: 'Tạo mới đợt phát hành',
    //                     type: 'item',
    //                     url: '/release-license/create',
    //                     exactMatch: true
    //                 },
    //             ]
    //         },
    //         {
    //             id: 'confirmIncomeTax',
    //             title: 'Quản lý giấy xác nhận TNCN',
    //             type: 'collapsable',
    //             icon: 'dashboard',
    //             children: [
    //                 {
    //                     id: 'confirmIncomeTaxList',
    //                     title: 'Danh sách',
    //                     type: 'item',
    //                     url: '/confirm-income-tax/list',
    //                     exactMatch: true
    //                 }, {
    //                     id: 'confirmIncomeTax_create',
    //                     title: 'Tạo mới',
    //                     type: 'item',
    //                     url: '/confirm-income-tax/create',
    //                     exactMatch: true
    //                 },
    //             ]
    //         },
    //         {

    //             id: 'report',
    //             title: 'Báo cáo',
    //             type: 'collapsable',
    //             icon: 'dashboard',
    //             children: [
    //                 {
    //                     id: 'list_use_license',
    //                     title: 'Bảng kê sử dụng chứng từ',
    //                     type: 'item',
    //                     url: '/report/list-use-license',
    //                     exactMatch: true
    //                 },
    //             ]
    //         },

    //     ]
    // }
];
