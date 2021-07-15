export interface ResourceDtos {
    'sizeType'?: any;
    'aliasName'?: any;
    'fileName'?: any;
    'filePath'?: any;
    'mineType'?: any;
    'refCode'?: any;
    'storageType'?: any;
}

export interface IContentDetail {
    // contractDate: number;
    // contractExpiredDate: number;
    // bpbEmpLevel: string;
    // contractNo: string;
    // bpbIdIssueDate: number;
    // bpbJoinDate: number;
    // contractPlace: string;
    // contractSigndate: number;
    // contractEffectiveDate: number;
    // bpaAuthStatus: string;
    // bpaRepresentativeName: string;
    // bpbEmpSalary: number;
    // bpbEmpPosition: string;
    // makerId: string;
    // companyCode: string;
    // bpbEmpName: string;
    // bpbContactEmail: string;
    // bpaRepresentativePosition: string;
    // bpbBirthDate: number;
    // bpaCompanyAddress: string;
    // bpbIdIssuePlace: string;
    // bpbContactPhone: string;
    // bpbAuthStatus: string;
    // companyId: number;
    // bpaCompanyName: string;
    // bpaCompanyPhone: string;
    // bpbEmpCode: string;
    // bpbIdNumber: string;
    id: number;
    checked?: boolean;
}

export interface ICerInfo {
    signDate?: any;
    notBefore?: any;
    notAfter?: any;
    issuerDN?: {
        CN?: any;
    };
    subjectDN?: {
        ST?: any;
        UID?: any;
        CN?: any;
        L?: any;
    };
    serialNumber?: any;
    revocation?: {
        certStatus?: any;
        revocationDate?: any;
    };
}

export interface IExtValue {
    cerInfo?: ICerInfo;
    cerValidator: {
        taxCode?: any;
        cert?: any;
    };
}

export interface ITaxIncome {
    registryAmount?: any;
    registryFrom?: any;
    description?: any;
    registryTo?: any;
    tenantCode?: any;
    buAddress?: any;
    extValue?: IExtValue;
    buPattern?: any;
    modNo?: any;
    buMajor?: any;
    taxPlaceId?: any;
    taxPlaceName?: any;
    registryYear?: any;
    checkerDate?: any;
    companyRegistry?: any;
    id?: any;
    makerId?: any;
    makerDate?: any;
    authStatus?: any;
    pttbRegistrytaxHistories?: IPttbRegistrytaxHistories[];
    buCode?: any;
    buName?: any;
    buTaxcode?: any;
    recordStatus?: any;
    buSerial?: any;
    checkerId?: any;
    taxPlaceCode?: any;
    buPhone?: any;
    pttbRegistaxincoAttachments?: IPttbRegistaxincoAttachments[];
    aggId?: any;
    ftsValue?: any;
    status?: any;
}
export interface ICertErrorText {
    status?: any;
    taxCode?: any;
    expired?: any;
}

export interface IPttbRegistrytaxHistories {
    note?: any;
    makerDate?: any;
    pttbRegistryTaxincome?: any;
    authStatus?: any;
    tenantCode?: any;
    extValue?: any;
    modNo?: any;
    recordStatus?: any;
    checkerDate?: any;
    contentValue?: any;
    checkerId?: any;
    id?: any;
    makerId?: any;
    status?: any;
}

export interface IPttbRegistaxincoAttachments {
    makerDate?: any;
    pttbRegistryTaxincome?: any;
    discription?: any;
    authStatus?: any;
    tenantCode?: any;
    extValue?: any;
    modNo?: any;
    recordStatus?: any;
    checkerDate?: any;
    checkerId: null;
    id?: any;
    smtbResource: ISmtbResource;
    attmentType?: any;
    makerId?: any;
    status?: any;
}

export interface ISmtbResource {
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
    pttbRegistaxincoAttachments?: any;
    id?: any;
    refCode?: any;
    aggId?: any;
    makerId?: any;
}