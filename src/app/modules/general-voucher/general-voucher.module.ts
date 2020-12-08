import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralVoucherRoutingModule } from './general-voucher-routing.module';
import { GenVoucherListComponent } from './gen-voucher-list/gen-voucher-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { GenVoucherDetailsComponent } from './gen-voucher-details/gen-voucher-details.component';
import { GenVoucherDetailsDialogComponent } from './gen-voucher-details/gen-voucher-details-dialog.component';
import { SharedDirectives } from 'app/utils/number-only.directive';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
  declarations: [
    GenVoucherListComponent,
    GenVoucherDetailsComponent,
    GenVoucherDetailsDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    GeneralVoucherRoutingModule,
    SharedDirectives,
    NgxMaskModule.forChild({
      specialCharacters: ['/']
    })
  ],
  entryComponents: [GenVoucherDetailsComponent]
})
export class GeneralVoucherModule { }
