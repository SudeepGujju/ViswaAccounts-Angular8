import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function AccountCodeValidation(fromAccControlName: string, toAccControlName: string ): ValidatorFn {

  return (AC: AbstractControl): ValidationErrors | null => {

    if (AC.get(fromAccControlName).value === AC.get(toAccControlName).value) {
      return { errorSameAccountCode: true };
    }

    return null;

  };
}
