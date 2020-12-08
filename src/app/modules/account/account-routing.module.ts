import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountOpenBalListComponent } from './account-opening-list/account-open-bal-list.component';
import { AuthGuard } from 'app/guards';
import { Constants } from 'app/constants';
import { AccountDetailsDialogComponent } from './account-details/account-details-dialog.component';
import { AccountDetailsResolver } from 'app/resolvers/account-details.resolver';
import { GroupDropdownResolver } from 'app/resolvers/group-dropdown.resolver';


const routes: Routes = [
  {
    path: 'list',
    canActivate: [AuthGuard],
    component: AccountListComponent
  },
  {
    path: 'open-balance',
    canActivate: [AuthGuard],
    component: AccountOpenBalListComponent
  },
  {
    path: 'create',
    canActivate: [AuthGuard],
    data: {
      pageMode: Constants.PAGE_MODE.CREATE
    },
    component: AccountDetailsDialogComponent,
    resolve: {
      groupList: GroupDropdownResolver
    }
  },
  {
    path: 'edit/:id',
    canActivate: [AuthGuard],
    data: {
      pageMode: Constants.PAGE_MODE.EDIT
    },
    component: AccountDetailsDialogComponent,
    resolve: {
      details: AccountDetailsResolver,
      groupList: GroupDropdownResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
