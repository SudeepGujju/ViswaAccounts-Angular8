import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountCopyComponent } from './account-copy/account-copy.component';
import { PrepareComponent } from './prepare/prepare.component';
import { TrailBalanceComponent } from './trail-balance/trail-balance.component';
import {GroupType } from '../../data-model';
import { FinancialComponent } from './financial/financial.component';

const routes: Routes = [
  {
    path: 'prepare',
    component: PrepareComponent
  },
  {
    path: 'account',
    component: AccountCopyComponent
  },
  {
    path: 'trail-balance',
    component: TrailBalanceComponent
  },
  {
    path: 'financials',
    component: FinancialComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlRoutingModule { }
