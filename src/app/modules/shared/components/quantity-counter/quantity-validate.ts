import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function QuantityValidation(errorValue): ValidatorFn {

return (AC: AbstractControl): ValidationErrors | null => {

    if (AC.value == errorValue) {
        return { errorQuantity: true };
    }

    return null;

};
}
