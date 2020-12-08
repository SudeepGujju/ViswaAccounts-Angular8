import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'app/guards';
import { GenVoucherListComponent } from './gen-voucher-list/gen-voucher-list.component';
import { GenVouchDetailsResolver } from 'app/resolvers/gen-voucher-details.resolver';
import { AccountDropdownResolver } from 'app/resolvers/account-dropdown.resolver';
import { Constants } from 'app/constants';
import { GenVoucherDetailsDialogComponent } from './gen-voucher-details/gen-voucher-details-dialog.component';
import { GenVouchNumberResolver } from 'app/resolvers/gen-voucher-number.resolver';


const routes: Routes = [
  {
    path: 'list',
    canActivate: [AuthGuard],
    component: GenVoucherListComponent,
  },
  {
    path: 'create',
    canActivate: [AuthGuard],
    data: {
      pageMode: Constants.PAGE_MODE.CREATE
    },
    component: GenVoucherDetailsDialogComponent,
    resolve: {
      accountList: AccountDropdownResolver,
      generalVoucherNumber: GenVouchNumberResolver
    }
  },
  {
    path: 'edit/:id',
    canActivate: [AuthGuard],
    data: {
      pageMode: Constants.PAGE_MODE.EDIT
    },
    component: GenVoucherDetailsDialogComponent,
    resolve: {
      details: GenVouchDetailsResolver,
      accountList: AccountDropdownResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralVoucherRoutingModule { }
