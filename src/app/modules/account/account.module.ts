import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountOpenBalListComponent } from './account-opening-list/account-open-bal-list.component';
import { AccountListComponent } from './account-list/account-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { AccountDetailsDialogComponent } from './account-details/account-details-dialog.component';
import { SharedDirectives } from 'app/utils/number-only.directive';


@NgModule({
  declarations: [
    AccountOpenBalListComponent,
    AccountListComponent,
    AccountDetailsComponent,
    AccountDetailsDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    AccountRoutingModule,
    SharedDirectives
  ],
  entryComponents: [AccountDetailsComponent]
})
export class AccountModule { }
