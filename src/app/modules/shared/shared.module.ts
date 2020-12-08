import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { NgxMaskModule } from 'ngx-mask';
import { ReactiveFormsModule } from '@angular/forms';
import { QuantityCounterComponent } from './components/quantity-counter/quantity-counter.component';

@NgModule({
  declarations: [QuantityCounterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMaskModule.forChild({
      specialCharacters: ['/']
    })
  ],
  exports: [QuantityCounterComponent]
})
export class SharedModule { }
