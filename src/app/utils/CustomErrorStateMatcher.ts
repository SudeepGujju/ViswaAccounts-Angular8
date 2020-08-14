import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class CustomErrorStateMatcher implements ErrorStateMatcher {

  constructor(private errorName: string){}

  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ) {
    const isSubmitted = form && form.submitted;
    return (
      !!(
        control &&
        control.invalid &&
        (control.dirty || control.touched || isSubmitted)
      ) || !!(form && form.errors && form.errors[this.errorName])
    );
  }
}
