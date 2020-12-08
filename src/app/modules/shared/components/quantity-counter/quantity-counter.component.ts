import { Component, OnInit, Input, Optional, AfterViewInit } from '@angular/core';
import { ControlContainer, AbstractControl, Validators } from '@angular/forms';
import { QuantityValidation } from './quantity-validate';

@Component({
  selector: 'quantity-counter',
  templateUrl: './quantity-counter.component.html',
  styleUrls: ['./quantity-counter.component.scss']
})
export class QuantityCounterComponent implements OnInit {

  @Input() controlName: string;
  @Input() step = 1;
  @Input() initialValue = 0;
  @Input() allowEmpty = false;
  @Input() errorIfZero = true;
  public control: AbstractControl;

  constructor(private container: ControlContainer) { }

  ngOnInit() {
    this.control = this.container.control.get(this.controlName);

    setTimeout(() => {

      const validators = [];
      if (!this.allowEmpty) {
        validators.push(Validators.required);
      }

      if (this.errorIfZero) {
        validators.push(QuantityValidation(0));
      }

      this.control.setValidators(validators);
      this.control.updateValueAndValidity();

      this.control.setValue(this.initialValue);
    });
  }

  increment() {
    if (this.control.value == '') {
      this.control.setValue(this.initialValue);
    } else {
      this.control.setValue(parseInt(this.control.value, 10) + this.step);
    }
  }

  decrement() {

    if (this.control.value == '') {
      this.control.setValue(this.initialValue);
    } else {
      const value = parseInt(this.control.value, 10) - this.step;

      if (value >= 0) {
        this.control.setValue(value);
      }
    }
  }

}
