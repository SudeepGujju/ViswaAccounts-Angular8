import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'app/guards';
import { UsersListComponent } from './users-list/users-list.component';
import { Constants } from 'app/constants';
import { UserDetailsDialogComponent } from './user-details/user-details-dialog.component';
import { UserDetailsResolver } from 'app/resolvers/user-details.resolver';
import { UserPermissionResolver } from 'app/resolvers/user-permission.resolver';
import { UserPermissionDialogComponent } from './user-permissions/user-permisssion-dialog.component';

const routes: Routes = [
  {
    path: 'list',
    canActivate: [AuthGuard],
    component: UsersListComponent
  },
  {
    path: 'create',
    canActivate: [AuthGuard],
    data: {
      pageMode: Constants.PAGE_MODE.CREATE
    },
    component: UserDetailsDialogComponent
  },
  {
    path: 'edit/:id',
    canActivate: [AuthGuard],
    data: {
      pageMode: Constants.PAGE_MODE.EDIT
    },
    component: UserDetailsDialogComponent,
    resolve: {
      details: UserDetailsResolver
    }
  },
  {
    path: 'permission/:id',
    canActivate: [AuthGuard],
    component: UserPermissionDialogComponent,
    resolve: {
      details: UserPermissionResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
