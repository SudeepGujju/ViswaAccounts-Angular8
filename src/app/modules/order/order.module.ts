import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { PurchaseComponent } from './purchase/purchase.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersResolver } from './resolver/user.resolve';
import { BreadcrumbModule } from '../breadcrumb/breadcrumb.module';
import { SharedModule } from '../shared/shared.module';
import { AlertModule } from '../alert';

@NgModule({
  declarations: [PurchaseComponent],
  imports: [
    CommonModule,
    OrderRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    BreadcrumbModule,
    SharedModule,
    AlertModule
  ],
  providers: [UsersResolver]
})
export class OrderModule { }
