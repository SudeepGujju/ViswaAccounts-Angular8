import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';

export function DateValidator(minDate?: Date, maxDate?: Date): ValidatorFn {

  return (AC: AbstractControl): ValidationErrors | null => {

    if (AC && AC.value) {
      const momentDate = moment(AC.value, 'DD/MM/YYYY', true);

      if (!momentDate.isValid()) {
        return { errorDateValue: true };
      }

      if (minDate && maxDate && !momentDate.isBetween(minDate, maxDate, null, '[]')) {
        return { errorDateRange: true };
      }

    }

    return null;
  };
}

export function FromToDateValidation(fromDateControlName: string, toDateControlName: string ): ValidatorFn {

  return (AC: AbstractControl): ValidationErrors | null => {

    const fromDate = moment(AC.get(fromDateControlName).value, 'DD/MM/YYYY', true);
    const toDate = moment(AC.get(toDateControlName).value, 'DD/MM/YYYY', true);

    if (fromDate.isAfter(toDate)) {
      return { errorFromToDate: true };
    }

    return null;

  };
}
