import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class CurrencyTranslater {

  private KHONG: string = 'không';
  private MOT: string = 'một';
  private HAI: string = 'hai';
  private BA: string = 'ba';
  private BON: string = 'bốn';
  private NAM: string = 'năm';
  private SAU: string = 'sáu';
  private BAY: string = 'bảy';
  private TAM: string = 'tám';
  private CHIN: string = 'chín';
  private LAM: string = 'lăm';
  private LE: string = 'lẻ';
  private MUOI: string = 'mươi';
  private MUOIF: string = 'mười';
  private MOTS: string = 'mốt';
  private TRAM: string = 'trăm';
  private NGHIN: string = 'nghìn';
  private TRIEU: string = 'triệu';
  private TY: string = 'tỷ';

  private number: any[] = [this.KHONG, this.MOT, this.HAI, this.BA, this.BON, this.NAM, this.SAU, this.BAY, this.TAM, this.CHIN];

  constructor() {
    //
  }

  getDecimalText(currencyConfig: any): any {
    let realText: string = 'đồng';
    let decimalText: string = 'đồng';
    if (!currencyConfig) {
      return { realText, decimalText };
    }
    try {
      if (!currencyConfig) {
        currencyConfig = `{'allowDecimal': false,'decimalSeparator': ',','groupingSeparator': '.','decimalLength': 0,'realText': 'đồng',
          'decimalText' : 'đồng'}`;
      }
      currencyConfig = JSON.parse(currencyConfig);
      if (currencyConfig.realText) {
        realText = currencyConfig.realText;
      }
      if (currencyConfig.decimalText) {
        decimalText = currencyConfig.decimalText;
      }
    } catch (error) {
      return { realText, decimalText };
    }
    return { realText, decimalText };
  }

  readerCurrency(strNumber: any, type: string = 'VND', currencyConfig: any = null): string {
    let text1: any;
    let text2: string = '';
    let lstStrCurrency: any;
    let strReturn: string = '';
    let { realText, decimalText } = this.getDecimalText(currencyConfig);
    if (type !== 'VND') {
      if (!strNumber) {
        if (this.checkIsNumber(strNumber)) {
          return 'Không ' + realText;
        }
        return ' ' + realText;
      }
      text1 = strNumber.toString();
      let money: any, leMoney: any;
      if (text1.indexOf('.') > -1) {
        text1 = text1.split('.');
        money = text1[0];
        leMoney = text1[1];
      } else {
        money = text1;
      }
      text2 = money.replace(/\.0/g, '');
      lstStrCurrency = this.readNum(text2);
      strReturn = '';
      for (let i: number = 0; i < lstStrCurrency.length; i++) {
        const strCurrency: string = lstStrCurrency[i] || '';
        strReturn = strReturn + strCurrency + ' ';
      }
      strReturn = strReturn.trim();
      strReturn = strReturn.charAt(0).toUpperCase() + strReturn.slice(1);
      if (!leMoney) {
        // return strReturn + ' đô la Mỹ';
        return strReturn + ' ' + realText;
      } else {
        let text3: string = '';
        let lstStrCurrencyLe: any;
        text3 = leMoney.replace(/\.0/g, '');
        if (text3.charAt(0) === '0') {
          text3 = text3[1];
        } else if (text3.length === 1) {
          text3 = text3 + '0';
        }
        lstStrCurrencyLe = this.readNum(text3);
        let strReturnLe: string = '';
        for (let i: number = 0; i < lstStrCurrencyLe.length; i++) {
          const strCurrency: string = lstStrCurrencyLe[i] || '';
          strReturnLe = strReturnLe + strCurrency + ' ';
        }
        strReturnLe = strReturnLe.trim();
        strReturnLe = strReturnLe.charAt(0).toLowerCase() + strReturnLe.slice(1);
        // return strReturn + ' đô la Mỹ lẻ ' + strReturnLe + ' xu';
        return strReturn + ' ' + realText + ' lẻ ' + strReturnLe + ' ' + decimalText;
      }
    }
    text1 = (strNumber + '').replace(/\.00/g, '');
    text2 = text1.replace(/\.0/g, '');
    lstStrCurrency = this.readNum(text2);
    strReturn = '';
    for (let i: number = 0; i < lstStrCurrency.length; i++) {
      const strCurrency: string = lstStrCurrency[i] || '';
      strReturn = strReturn + strCurrency + ' ';
    }
    strReturn = strReturn.trim();
    strReturn = strReturn.charAt(0).toUpperCase() + strReturn.slice(1);
    return strReturn + ' ' + realText;

  }

  private readNum(a: any): any {
    let kq = [];
    let List_Num = this.split(a, 3);
    while (List_Num.length > 0) {
      // Xét 3 số đầu tiên của chuổi (số đầu tiên của List_Num)
      switch (List_Num.length % 3) {
        // 3 số đó thuộc hàng trăm
        case 1:
          let arr = this.read_3num(List_Num[0]);
          for (let _i = 0; _i < arr.length; _i++) {
            kq.push(arr[_i]);
          }
          break;
        // 3 số đó thuộc hàng nghìn
        case 2:
          let nghin = this.read_3num(List_Num[0]);
          if (nghin.length > 0) {
            for (let _i = 0; _i < nghin.length; _i++) {
              kq.push(nghin[_i]);
            }
            kq.push(this.NGHIN);
          }
          break;
        // 3 số đó thuộc hàng triệu
        case 0:
          let trieu = this.read_3num(List_Num[0]);
          if (trieu.length > 0) {
            for (let _i = 0; _i < trieu.length; _i++) {
              kq.push(trieu[_i]);
            }
            kq.push(this.TRIEU);
          }
          break;
      }

      // Xét nếu 3 số đó thuộc hàng tỷ
      if (List_Num.length == Math.round((List_Num.length / 3)) * 3 + 1 && List_Num.length != 1) {
        kq.push(this.TY);
      }

      List_Num = List_Num.slice(1, List_Num.length);
    }

    return kq;
  };

  private read_3num(a) {
    let kq = [];
    let num = parseInt(a);
    if (isNaN(num)) {
      num = -1;
    }
    if (num == 0) {
      return kq;
    }
    let hang_tram = parseInt(a.substring(0, 1));
    if (isNaN(hang_tram)) {
      hang_tram = -1;
    }
    let hang_chuc = parseInt(a.substring(1, 2));
    if (isNaN(hang_chuc)) {
      hang_chuc = -1;
    }
    let hang_dv = parseInt(a.substring(2, 3));
    if (isNaN(hang_dv)) {
      hang_dv = -1;
    }

    // xét hàng trăm
    if (hang_tram != -1) {
      kq.push(this.number[hang_tram]);
      kq.push(this.TRAM);
    }

    // xét hàng chục
    switch (hang_chuc) {
      case -1:
        break;
      case 1:
        kq.push(this.MUOIF);
        break;
      case 0:
        if (hang_dv != 0)
          kq.push(this.LE);
        break;
      default:
        kq.push(this.number[hang_chuc]);
        kq.push(this.MUOI);
        break;
    }

    // xét hàng đơn vị
    switch (hang_dv) {
      case -1:
        break;
      case 1:
        if ((hang_chuc != 0) && (hang_chuc != 1) && (hang_chuc != -1))
          kq.push(this.MOTS);
        else
          kq.push(this.number[hang_dv]);
        break;
      case 5:
        if ((hang_chuc != 0) && (hang_chuc != -1))
          kq.push(this.LAM);
        else
          kq.push(this.number[hang_dv]);
        break;
      case 0:
        if (!kq.length)
          kq.push(this.number[hang_dv]);
        break;
      default:
        kq.push(this.number[hang_dv]);
        break;
    }
    return kq;
  };

  private split(str, chunkSize) {
    let du = str.length % chunkSize;
    if (du != 0) {
      for (let i = 0; i < (chunkSize - du); i++) {
        str = "#" + str;
      }
    }
    return this.splitStringEvery(str, chunkSize);
  };

  private splitStringEvery(s, interval) {
    //let arrList = [];
    let arrayLength = Number(Math.ceil(((s.length / Number(interval)))));
    let result = [];
    let j = 0;
    let lastIndex = arrayLength - 1;
    for (let i = 0; i < lastIndex; i++) {
      result[i] = s.substring(j, j + interval);
      j += interval;
    }
    result[lastIndex] = s.substring(j);
    return result;
  }

  private checkIsNumber(str: any): boolean {
    if (str === null || str === undefined) {
      return false;
    }
    return !isNaN(str);
  }
}
