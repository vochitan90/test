export interface IItem {
    id: number;
    code: string;
    name: string;
    unit: string;
    price: number;
    authStatus: string;
    recordStatus: string;
    makerId: string;
    makerDate: number;
    checkerId: string;
    checkerDate: number;
    mod: number;
}

export const ITEM_FIELD_NAMES: any = {
    ITEM_ID: 'id',
    ITEM_CODE: 'code',
    ITEM_NAME: 'name',
    ITEM_PRICE: 'price',
    ITEM_UNIT: 'unit',
    MAKER_ID: 'makerId',
    MAKER_DATE: 'makerDate',
};
