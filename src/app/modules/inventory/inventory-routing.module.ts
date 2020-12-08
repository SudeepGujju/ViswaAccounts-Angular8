import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'app/guards';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { Constants } from 'app/constants';
import { AccountDropdownResolver } from 'app/resolvers/account-dropdown.resolver';
import { InventoryDetailsDialogComponent } from './inventory-details/inventory-details-dialog.component';
import { InventoryDetailsResolver } from 'app/resolvers/inventory-details.resolver';


const routes: Routes = [
  {
    path: 'list',
    canActivate: [AuthGuard],
    component: InventoryListComponent
  },
  {
    path: 'create',
    canActivate: [AuthGuard],
    data: {
      pageMode: Constants.PAGE_MODE.CREATE
    },
    component: InventoryDetailsDialogComponent,
    resolve: {
      accountList: AccountDropdownResolver
    }
  },
  {
    path: 'edit/:id',
    canActivate: [AuthGuard],
    data: {
      pageMode: Constants.PAGE_MODE.EDIT
    },
    component: InventoryDetailsDialogComponent,
    resolve: {
      details: InventoryDetailsResolver,
      accountList: AccountDropdownResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
