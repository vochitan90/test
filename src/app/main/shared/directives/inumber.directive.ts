import { Directive, ElementRef, HostListener, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { AppState } from '../utils/AppState';

//https://codeburst.io/digit-only-directive-in-angular-3db8a94d80c3
@Directive({
  selector: '[inumber]'
})
export class InumberDirective implements OnChanges {


  private decimalCounter = 0;
  private currentDecimalLength: number = 0;
  private flag: boolean = true;  // disable long press

  private navigationKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste'
  ];

  @Output() onInputChange: any = new EventEmitter<any>();

  @Input() value: any;
  @Input('inumber') config: any;

  // public config: any = {
  //   decimal: true,
  //   decimalLength: 3,
  //   decimalSeparator: '.',
  //   groupSeparator: ','
  // };

  @Input() maxLength?= 20;

  inputElement: HTMLInputElement;

  constructor(public el: ElementRef, private _appState: AppState) {
    this.config = _appState.getConfigNumberDirective();
    this.inputElement = el.nativeElement;
  }

  ngAfterViewInit(): void {
    this.config = this._appState.getConfigNumberDirective();
    if (this.value) {
      let value = this.value + '';
      value = value.replace('.', this.config.decimalSeparator); // conver number decimalSeparator to custom decimalSeparator
      this.sanatizeInput(value);

    }
  }

  //truong hop ben ngoai gan gia tri cho field
  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (changes['value'] && changes['value'].currentValue !== changes['value'].previousValue) {

      if (changes['value'].currentValue) {
        let value = changes['value'].currentValue;

        // lam tron den n so thap phan
        if (this.config.decimalLength || this.config.decimalLength === 0) {
          let n = this.config.decimalLength;
          value = Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
        }

        value = value + ''; //chuyen sang kieu chuoi de sai ham replace

        value = value.replace('.', this.config.decimalSeparator); // conver number decimalSeparator to custom decimalSeparator
        this.sanatizeInput(value);

      } else {
        if (changes['value'].currentValue === 0) {
          this.sanatizeInput('0');
        } else {
          this.sanatizeInput('');
        }
      }
    }
  }

  @HostListener('change')
  onChange(): void {
    let valueInput = this.el.nativeElement.value;

    if (valueInput.indexOf(this.config.decimalSeparator) > -1) {
      let arr = valueInput.split(this.config.decimalSeparator);

      let decimalValue = arr[1];
      if (decimalValue.length <= 0) {
        this.decimalCounter = 0;
        valueInput = arr[0];
      }

    }

    let valueFormat = this.formatNumner(valueInput);
    this.inputElement.value = valueFormat;
    this.onInputChange.emit(this.parseNumber(valueFormat));
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    // if (!this.flag && e.key !== 'Delete' && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
    //   e.preventDefault();
    // }
    // if(isNaN(Number(e.key))){
    //   this.flag = false;
    // }
    if (
      this.navigationKeys.indexOf(e.key) > -1 || // Allow: navigation keys: backspace, delete, arrows etc.
      (e.key === 'a' && e.ctrlKey === true) || // Allow: Ctrl+A
      (e.key === 'c' && e.ctrlKey === true) || // Allow: Ctrl+C
      (e.key === 'v' && e.ctrlKey === true) || // Allow: Ctrl+V
      (e.key === 'x' && e.ctrlKey === true) || // Allow: Ctrl+X
      (e.key === 'a' && e.metaKey === true) || // Allow: Cmd+A (Mac)
      (e.key === 'c' && e.metaKey === true) || // Allow: Cmd+C (Mac)
      (e.key === 'v' && e.metaKey === true) || // Allow: Cmd+V (Mac)
      (e.key === 'x' && e.metaKey === true) || // Allow: Cmd+X (Mac)
      (this.config.decimal && e.key === this.config.decimalSeparator && this.decimalCounter < 1) // Allow: only one decimal point
    ) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if (e.key === ' ' || isNaN(Number(e.key)) || this.inValidInput()) {
      e.preventDefault();
    }

  }

  private inValidInput(): boolean {
    const { selectionStart: start, selectionEnd: end } = this.inputElement;
    let decimalSeparatorIdx = this.el.nativeElement.value.indexOf(this.config.decimalSeparator);

    if (decimalSeparatorIdx > -1) {
      //check decimal
      if (this.currentDecimalLength >= this.config.decimalLength && start > decimalSeparatorIdx) {
        return true;
      }


      //check 
      if (start <= decimalSeparatorIdx) {
        let arr = this.el.nativeElement.value.split(this.config.decimalSeparator);
        if (arr[0].length > this.maxLength) {
          return true;
        }
      }
    } else {
      const length = this.el.nativeElement.value ? this.el.nativeElement.value.length : 0;
      if (length > this.maxLength) {
        return true;
      }
    }

    return false;
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(e: KeyboardEvent) {
    // this.flag = true;

    let valueInput = this.el.nativeElement.value;

    if (!this.config.decimal) {
      return;
    } else {
      let arr = this.el.nativeElement.value.split(this.config.decimalSeparator);
      this.decimalCounter = arr.length - 1;
      if (arr.length >= 2) {
        let decimalValue = arr[1].substring(0, this.config.decimalLength);
        valueInput = arr[0] + this.config.decimalSeparator + decimalValue;
        this.currentDecimalLength = arr[1].length;
      }
    }

    this.sanatizeInput(valueInput);
  }

  private sanatizeInput(valueInput: string): void {
    // if(!valueInput){
    //   return;
    // }
    valueInput = valueInput + ''; // convert to string using indexof
    let oldLength = valueInput.length;
    const { selectionStart: start, selectionEnd: end } = this.inputElement;

    let newValue = this.formatNumner(valueInput);
    let newLength = newValue.length;
    this.inputElement.value = newValue;

    let pos = start;
    if (newLength - oldLength > 0) {
      pos = pos + (newLength - oldLength);
    } else if (newLength - oldLength < 0) {
      pos = pos - 1;
      if (pos < 0) {
        pos = 0;
      }
    }

    this.el.nativeElement.selectionStart = pos;
    this.el.nativeElement.selectionEnd = pos;
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }

  // @HostListener('drop', ['$event'])
  // onDrop(event: DragEvent) {
  //   event.preventDefault();
  // }



  private formatNumner(valueInput: any): any {
    if ((!valueInput && valueInput != 0) || valueInput.trim().length == 0) {
      return '';
    }

    let decimalValue = '';
    let decimalSeparator = '';
    let value = valueInput;

    if (valueInput.indexOf(this.config.decimalSeparator) > -1) {
      // let arr = this.el.nativeElement.value.split(this.config.decimalSeparator);
      let arr = valueInput.split(this.config.decimalSeparator);
      value = arr[0];
      if (!value || value.length === 0) {
        value = '0';
      }
      // decimalValue = arr[1].substring(0,this.config.decimalLength);
      decimalValue = arr[1];

      decimalSeparator = this.config.decimalSeparator;

    }

    value = this.parseNumber(value);

    if (isNaN(value)) {
      return value + decimalSeparator + decimalValue;
    }
    if (value === 0) {
      return value + decimalSeparator + decimalValue;
    }
    let sign = (value == (value = Math.abs(value)));
    value = Math.floor(value * 100 + 0.50000000001);
    value = Math.floor(value / 100).toString();
    for (let i = 0, length = Math.floor((value.length - (1 + i)) / 3); i < length; i++) {
      value = value.substring(0, value.length - (4 * i + 3)) + this.config.groupSeparator + value.substring(value.length - (4 * i + 3));
    }
    value = value + decimalSeparator + decimalValue;
    return (((sign) ? '' : '-') + value);
  }

  private parseNumber(value: any): any {
    if ((!value && value != 0) || value.trim().length == 0) {
      return null;
    }
    let strValue: string = '';

    strValue = value.split(this.config.groupSeparator).join('');
    strValue = strValue.replace(this.config.decimalSeparator, '.');

    return strValue;
  }
}