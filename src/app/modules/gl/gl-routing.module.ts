import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountCopyComponent } from './account-copy/account-copy.component';
import { PrepareComponent } from './prepare/prepare.component';

const routes: Routes = [
  {
    path: "account",
    component: AccountCopyComponent
  },
  {
    path: "prepare",
    component: PrepareComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlRoutingModule { }
