import { Directive, ElementRef, HostListener, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[dateInput]',
})
export class DateInputDirective implements AfterViewInit {
  private navigationKeys: any = [
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste',
  ];

  @Output() changeNewDate: any = new EventEmitter<any>();
  @Input() valueDefaultDate: any;
  flag: boolean = true;
  inputElement: HTMLInputElement;
  maxLength: number = 10;

  constructor(public el: ElementRef) {
    this.inputElement = el.nativeElement;
    this.inputElement.value = '__/__/____';
    this.changeNewDate.emit('__/__/____');
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    // console.log('onKeyDown');
    if (!this.flag && e.key !== 'Delete' && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
      e.preventDefault();
    }
    this.flag = false;
    if (
      this.navigationKeys.indexOf(e.key) > -1 || // Allow: navigation keys: backspace, delete, arrows etc.
      (e.key === 'a' && e.ctrlKey === true) || // Allow: Ctrl+A
      (e.key === 'c' && e.ctrlKey === true) || // Allow: Ctrl+C
      // (e.key === 'v' && e.ctrlKey === true) || // Allow: Ctrl+V
      (e.key === 'x' && e.ctrlKey === true) || // Allow: Ctrl+X
      (e.key === 'a' && e.metaKey === true) || // Allow: Cmd+A (Mac)
      (e.key === 'c' && e.metaKey === true) || // Allow: Cmd+C (Mac)
      (e.key === 'v' && e.metaKey === true) || // Allow: Cmd+V (Mac)
      (e.key === 'x' && e.metaKey === true) // Allow: Cmd+X (Mac)

    ) {
      // let it happen, don't do anything
      return;
    }

    const length: number = this.inputElement.value.length;
    const { selectionStart: start, selectionEnd: end } = this.inputElement;
    if (e.key === 'Delete' && start < this.maxLength) {
      const rs: string = this.inputElement.value;

      let idx: number = start;
      if (idx === 2 || idx === 5) {
        idx = idx + 1;
      }

      let newValue: string = this.replaceAt(rs, idx, '_');
      this.inputElement.value = newValue;
      this.changeNewDate.emit(newValue);
      let pos: number = idx + 1;
      if (pos >= this.maxLength) {
        pos = 0;
      }
      this.el.nativeElement.selectionStart = pos;
      this.el.nativeElement.selectionEnd = pos;
      e.preventDefault();

    }

    if (e.key === 'Backspace' && start > 0) {
      let rs: string = this.inputElement.value;

      let idx: number = start;
      if (idx === 3 || idx === 6) {
        idx = idx - 1;
      }

      let left: string = rs.substring(0, idx - 1);
      let right: string = rs.substring(idx, rs.length);
      let newValue: string = left + '_' + right;
      this.inputElement.value = newValue;
      this.changeNewDate.emit(newValue);
      let pos: number = idx - 1;
      if (pos < 0) {
        pos = 0;
      }
      this.el.nativeElement.selectionStart = pos;
      this.el.nativeElement.selectionEnd = pos;
      e.preventDefault();

    }

    // Ensure that it is a number and stop the keypress
    if ((e.key === ' ' || isNaN(Number(e.key)))) {
      e.preventDefault();
    }

    if (length >= this.maxLength) {
      if (start >= this.maxLength) {
        e.preventDefault();
      } else {
        // let index = start+1;
        if (!isNaN(Number(e.key))) {
          let idx: number = start;

          if (idx === 2 || idx === 5) {
            idx = idx + 1;
          }
          let rs: string = this.inputElement.value;
          let newValue: string = this.replaceAt(rs, idx, e.key);
          this.inputElement.value = newValue;
          this.changeNewDate.emit(newValue);
          let pos: number = idx + 1;
          this.el.nativeElement.selectionStart = pos;
          this.el.nativeElement.selectionEnd = pos;

          e.preventDefault();
        }
      }

    }

  }

  @HostListener('keyup', ['$event'])
  onKeyUp(e: KeyboardEvent): void {
    this.flag = true;
    // const { selectionStart: start, selectionEnd: end } = this.inputElement;
    const length: number = this.inputElement.value.length;
    if (length === 2 || length === 5) {
      const rs: string = this.inputElement.value + '/';
      this.inputElement.value = rs;
      this.changeNewDate.emit(rs);
    }

  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    // const pastedInput: string = event.clipboardData.getData('text/plain');
    event.preventDefault();
  }

  @HostListener('change')
  onChange(): void {
    console.log('in change InputTextFilterDirective');
  }

  replaceAt(value: string, idx: number, replacement: string): string {
    const left: string = value.substring(0, idx);
    const right: string = value.substring(idx + 1, value.length);
    return left + replacement + right;
  }

  ngAfterViewInit(): void {
    if (this.valueDefaultDate) {
      this.inputElement.value = this.valueDefaultDate;
    }
  }
}
