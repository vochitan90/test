
export interface IContent {
    type: string;
    value: string;
}

export interface IProcessUpload {
    makerDate: number;
    fileName: string;
    authStatus: string;
    filePath: string;
    description?: any;
    content: IContent;
    modNo: number;
    companyId: number;
    recordStatus: string;
    checkerDate?: number;
    processName?: string;
    processCode: string;
    checkerId?: string;
    id: number;
    functionKey: string;
    ftsValue?: any;
    makerId: string;
    percentProcess: number;
    status: number;
}


