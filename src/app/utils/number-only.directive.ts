import { Directive, ElementRef, HostListener, Input, NgModule } from '@angular/core';
import { NgControl } from '@angular/forms';

export interface NumberConfig {

  allowDecimal?: boolean;
  allowNegative?: boolean;
  setDefaultValue?: boolean;
}

@Directive({
  selector: 'input[numbersOnly]'
})
export class NumberDirective {

  @Input() numbersOnly: NumberConfig;

  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event']) onInputChange(event) {

    let finalValue = this.control.control.value;

    let numberRegExp;
    if (this.numbersOnly.allowDecimal && this.numbersOnly.allowNegative) {
      numberRegExp = new RegExp(/[^0-9\.\-]*/g);
    } else if (this.numbersOnly.allowDecimal) {
      numberRegExp = new RegExp(/[^0-9\.]*/g);
    } else if (this.numbersOnly.allowNegative) {
      numberRegExp = new RegExp(/[^0-9\-]*/g);
    } else {
      numberRegExp = new RegExp(/[^0-9]*/g);
    }

    finalValue = finalValue.replace(numberRegExp, '');

    if (this.numbersOnly.allowDecimal || this.numbersOnly.allowNegative) {
      if (this.numbersOnly.allowNegative) {
        const startIdx = finalValue.indexOf('-');
        const isMultiple = ((finalValue.match(/\-/g) || []).length > 1);

        if (startIdx !== 0 || isMultiple) {
          finalValue = finalValue.replace(/\-/g, '');
        }

        if (startIdx === 0 && isMultiple) {
          finalValue = '-' + finalValue;
        }
      }

      if (this.numbersOnly.allowDecimal && (finalValue.match(/\./g) || []).length > 1) {
        finalValue = parseFloat(finalValue);
      }
    }

    this.control.control.setValue(finalValue);

  }

  @HostListener('blur', ['$event'])onBlur(event) {
    if (!this.numbersOnly.setDefaultValue) {
      return;
    }

    const initalValue = this.control.control.value; // this._el.nativeElement.value;

    if (this.numbersOnly.allowDecimal) {
      if (initalValue && !isNaN(initalValue)) {
        this.control.control.setValue(parseFloat(initalValue).toFixed(2));
      } else if (!initalValue || initalValue === '-') {
        this.control.control.setValue('0.00');
      } else {
        console.error('NumberDirective - Number case not handled If> ' + initalValue);
      }
    } else {
      if (initalValue && !isNaN(initalValue)) {
        this.control.control.setValue(parseInt(initalValue, 10));
      } else if (!initalValue || initalValue === '-') {
        this.control.control.setValue('0');
      } else {
        console.error('NumberDirective - Number case not handled Else> ' + initalValue);
      }
    }
  }

}

@Directive({
  selector: 'input[dateOnly]'
})
export class DateDirective {

  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event']) onInputChange(event) {

    const initalValue = this.control.control.value; // this._el.nativeElement.value;

    this.control.control.setValue(formatDate(initalValue));
/*
    let finalValue = initalValue;
    if (/\D\/$/.test(finalValue)) finalValue = finalValue.substr(0, finalValue.length - 3);
    var values = finalValue.split('/').map(function(v) {
      return v.replace(/\D/g, '')
    });
    if (values[0]) values[0] = checkValue(values[0], 31);
    if (values[1]) values[1] = checkValue(values[1], 12);
    var output = values.map(function(v, i) {
      return v.length == 2 && i < 2 ? v + ' / ' : v;
    });
    finalValue = output.join('').substr(0, 14);
*/

    // if ( initalValue !== this._el.nativeElement.value) {
    //   event.stopPropagation();
    // }

  }
}

export function formatDate(finalValue): string {

  if (/\D\/$/.test(finalValue)) { finalValue = finalValue.substr(0, finalValue.length - 3); }
  const values = finalValue.split('/').map((v) => v.replace(/\D/g, ''));

  if (values[0]) { values[0] = checkValue(values[0], 31); }
  if (values[1]) { values[1] = checkValue(values[1], 12); }
  const output = values.map((v, i) => v.length === 2 && i < 2 ? v + ' / ' : v );
  finalValue = output.join('').substr(0, 14);

  return finalValue;
}

function checkValue(str, max): string {
  if (str.charAt(0) !== '0' || str === '00') {
    let num = parseInt(str, 10);
    if (isNaN(num) || num <= 0 || num > max) { num = 1; }
    str = num > parseInt(max.toString().charAt(0), 10)
           && num.toString().length === 1 ? '0' + num : num.toString();
  }
  return str;
}

export function getDefaultDate() {

  const todayDate = new Date();

  let date = '' + todayDate.getDate();
  let month = '' + (todayDate.getMonth() + 1);
  const year = '' + todayDate.getFullYear();

  if (parseInt(date, 10) < 10) {
    date = '0' + date;
  }

  if (parseInt(month, 10) < 10) {
    month = '0' + month;
  }

  return date + '/' + month + '/' + year;

}

@Directive({
  selector: 'input[uppercase]'
})
export class UpperCaseDirective {

  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event'])onInputChange(event) {

    const value = this.control.control.value;

    if (value && value !== value.toUpperCase()) {
      this.control.control.setValue(this.control.control.value.toUpperCase());
    }
  }
}

@NgModule({
  declarations: [
    NumberDirective,
    DateDirective,
    UpperCaseDirective
  ],
  exports: [
    NumberDirective,
    DateDirective,
    UpperCaseDirective
  ]
})
export class SharedDirectives{}