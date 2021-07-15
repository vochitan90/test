
export interface ExtraInfo {
}

export interface IAccount {
    extraInfo: ExtraInfo;
    code: string;
    hotline?: any;
    pltbAddresses: any[];
    pltbPlaces?: any;
    hasConnection: boolean;
    joinDate?: any;
    representMail?: any;
    contactAddress: string;
    id: number;
    contactMail?: any;
    fax?: any;
    email?: any;
    representAddress: string;
    website?: string;
    contactName?: string;
    foundDate?: number;
    taxCode?: string;
    representPhone?: string;
    phone?: any;
    name: string;
    representName?: string;
    contactPhone?: string;
    status?: string;
    accountTypeId?: any;
    contactNat?: any;
    contactGender?: any;
    contactJobTitle?: any;
    shortName?: any;
    representNat?: any;
    representGender?: any;
    representJobTitle?: any;
    business?: any;
    market?: any;
    budgetCode?: any;
    siCode?: any;
    estLicenseNo?: any;
    estLicenseDate?: any;
    estLicenseIssuer?: any;
    buId?: any;
    buCode?: any;
    aggId: string;
    makerId: string;
    makerDate: number;
    authStatus: string;
    recordStatus: string;
    checkerId?: any;
    checkerDate?: any;
    modNo: number;
    tenantCode: string;
}
