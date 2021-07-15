export interface Cert {
    issuedBy: string;
    issuedTo: string;
    validityPeriod: any;
    clientCertificate: boolean;
}

export interface verifyPDF {
    verified: any,
    authenticity: any, 
    integrity: any,
    expired: any,
    meta: any,
}