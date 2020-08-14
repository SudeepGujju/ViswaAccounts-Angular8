import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GlRoutingModule } from './gl-routing.module';
import { AccountCopyComponent } from './account-copy/account-copy.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { GlService } from './gl.service';
import { PrepareComponent } from './prepare/prepare.component';
import { SharedDirectives } from 'app/utils/number-only.directive';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
  declarations: [AccountCopyComponent, PrepareComponent],
  imports: [
    CommonModule,
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
