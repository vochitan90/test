export interface ResourceDtos {
    'sizeType'?: any;
    'aliasName'?: any;
    'fileName'?: any;
    'filePath'?: any;
    'mineType'?: any;
    'refCode'?: any;
}

export interface SmtbResource {
    sizeType?: any;
    aliasName?: any;
    fileName?: any;
    makerDate?: any;
    authStatus?: any;
    filePath?: any;
    modNo?: any;
    recordStatus?: any;
    checkerDate?: any;
    mineType?: any;
    checkerId?: any;
    storageType?: any;
    id?: any;
    cttbIssueRegistryAttachments?: any;
    cttbTaxincomeAttachments?: any;
    refCode?: any;
    makerId?: any;
}
export interface TaxIncomeAttachments {
    makerDate?: any;
    authStatus?: any;
    tenantCode?: any;
    extValue?: any;
    modNo?: any;
    cttbTaxincome?: any;
    recordStatus?: any;
    checkerDate?: any;
    isPrimary?: any;
    checkerId?: any;
    id?: any;
    smtbResource: SmtbResource;
    makerId?: any;
    status?: any;
}
export interface ITaxIncome {
    buEmail?: any;
    issuedDate?: any;
    note?: any;
    pattern?: any;
    description?: any;
    empIdnoIssuedDate?: any;
    empTaxcode?: any;
    tenantCode?: any;
    cttbBusinessUnit?: any;
    cttbUserProfile?: any;
    buAddress?: any;
    empTaxincomeWithheld?: any;
    extValue?: any;
    empContactAddress?: any;
    modNo?: any;
    cttbTaxincomes?: any;
    empIdnoIssuedPlace?: any;
    empPersonaltaxWithheld?: any;
    checkerDate?: any;
    empName?: any;
    empTaxincomeCalculation?: any;
    id?: any;
    cttbTaxincomeAttachments?: TaxIncomeAttachments[];
    makerId?: any;
    buId?: any;
    empNationality?: any;
    makerDate?: any;
    empPayFromMonth?: any;
    taxincomeNo?: any;
    empIdno?: any;
    empContactPhone?: any;
    authStatus?: any;
    buCode?: any;
    buName?: any;
    empIncomeType?: any;
    empPayYear?: any;
    cttbTaxincome?: any;
    buTaxcode?: any;
    recordStatus?: any;
    empCode?: any;
    serial?: any;
    checkerId?: any;
    empIsResident?: any;
    buPhone?: any;
    aggId?: any;
    empPayToMonth?: any;
    ftsValue?: any;
    status?: any;
}
// Cancel
export interface ITaxIncomeCancel {
    id?: any;
    note?: any;
    resourceDto?: ResourceDtos;
}
// Replace
export interface ITaxIncomeReplace {
    buId?: any;
    buCode?: any;
    buName?: any;
    buAddress?: any;
    buEmail?: any;
    buPhone?: any;
    buTaxcode?: any;
    description?: any;
    empCode?: any;
    empIdno?: any;
    empIdnoIssuedDate?: any;
    empIdnoIssuedPlace?: any;
    empIncomeType?: any;
    empIsResident?: any;
    empName?: any;
    empPersonaltaxWithheld?: any;
    empTaxcode?: any;
    empTaxincomeCalculation?: any;
    empTaxincomeWithheld?: any;
    extValue?: any;
    note?: any;
    pattern?: any;
    serial?: any;
    taxincomeRefId?: any;
    empNationality?: any;
    empContactAddress?: any;
    empContactPhone?: any;
    empPayFromMonth?: any;
    empPayToMonth?: any;
    empPayYear?: any;
    resourceDtos?: ResourceDtos[];
}
// Upload
export interface ITaxIncomeUpload {
    buId?: any;
    pattern?: any;
    serial?: any;
    resourceDto?: ResourceDtos;
}
// ISSUE_IMPORT
export interface ITaxIncomeIssueImport {
    id?: any;
    processDetailIds?: any[];
}
