export interface IReleaseRegistration {
    companyCode: string;
    aliasName?: string;
    makerDate: number;
    code: string;
    authStatus: string;
    templateVersionId: number;
    description: string;
    templateTypeName: string;
    version: number;
    extValue?: any;
    templateTypeCode: string;
    modNo: number;
    templateTypeId: number;
    companyId: number;
    recordStatus: string;
    checkerDate?: number;
    name: string;
    checkerId?: string;
    id: number;
    ftsValue?: any;
    effectiveDate: number;
    makerId: string;
}

export interface ICertInfo{
    certTax: string;
    isserDN: any;
    notAfter: number;
    notBefore: number;
    revocation: any;
    subjectDN: any;
    serialNumber: string;
    signDate: number;
    issuerDN: any;
}

export interface ICertVadilator{
    taxCode: string;
    cert: string;
}


