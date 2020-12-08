import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'app/guards';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { GroupDetailsDialogComponent } from './group-details/group-dailog-details.component';
import { GroupDetailsResolver } from 'app/resolvers/group-details.resolver';
import { Constants } from 'app/constants';

const routes: Routes = [
  {
    path: 'list',
    canActivate: [AuthGuard],
    component: GroupsListComponent,
  },
  {
    path: 'create',
    canActivate: [AuthGuard],
    data: {
      pageMode: Constants.PAGE_MODE.CREATE
    },
    component: GroupDetailsDialogComponent
  },
  {
    path: 'edit/:id',
    canActivate: [AuthGuard],
    data: {
      pageMode: Constants.PAGE_MODE.EDIT
    },
    component: GroupDetailsDialogComponent,
    resolve: {
      details: GroupDetailsResolver
    }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupRoutingModule { }
