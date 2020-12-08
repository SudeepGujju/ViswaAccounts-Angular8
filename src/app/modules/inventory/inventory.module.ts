import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NgxMaskModule } from 'ngx-mask';
import { InventoryDetailsDialogComponent } from './inventory-details/inventory-details-dialog.component';
import { InventoryDetailsComponent } from './inventory-details/inventory-details.component';
import { SharedDirectives } from 'app/utils/number-only.directive';


@NgModule({
  declarations: [
    InventoryListComponent,
    InventoryDetailsComponent,
    InventoryDetailsDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMaskModule.forChild({
      specialCharacters: ['/']
    }),
    InventoryRoutingModule,
    SharedDirectives
  ],
  entryComponents: [InventoryDetailsComponent]
})
export class InventoryModule { }
