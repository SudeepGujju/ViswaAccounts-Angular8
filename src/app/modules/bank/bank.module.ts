import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankRoutingModule } from './bank-routing.module';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { BankListComponent } from './bank-list/bank-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { SharedDirectives } from '../../utils/number-only.directive';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [
    BankDetailsComponent,
    BankListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMaskModule.forChild({
      specialCharacters: ['/']
    }),
    SharedDirectives,
    BankRoutingModule
  ]
})
export class BankModule { }
