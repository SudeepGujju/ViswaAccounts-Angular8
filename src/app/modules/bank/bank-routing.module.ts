import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'app/guards';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { BankListComponent } from './bank-list/bank-list.component';

const routes: Routes = [
  {
    path: 'create',
    canActivate: [AuthGuard],
    component: BankDetailsComponent
  },
  {
    path: 'list',
    canActivate: [AuthGuard],
    component: BankListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankRoutingModule { }
