import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GlRoutingModule } from './gl-routing.module';
import { AccountCopyComponent } from './account-copy/account-copy.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { GlService } from './gl.service';
import { PrepareComponent } from './prepare/prepare.component';
import { SharedDirectives } from 'app/utils/number-only.directive';
import { NgxMaskModule } from 'ngx-mask';
import { TrailBalanceComponent } from './trail-balance/trail-balance.component';
import { FinancialComponent } from './financial/financial.component';


@NgModule({
  declarations: [AccountCopyComponent, PrepareComponent, TrailBalanceComponent, FinancialComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedDirectives,
    GlRoutingModule,
    NgxMaskModule.forChild({
      dropSpecialCharacters: false
    })
  ],
  providers: [GlService]
})
export class GlModule { }
