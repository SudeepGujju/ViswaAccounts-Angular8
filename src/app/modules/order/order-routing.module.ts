import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseComponent } from './purchase/purchase.component';
import { UsersResolver } from './resolver/user.resolve';


const routes: Routes = [
  {
    path: 'purchase',
    component: PurchaseComponent,
    resolve: {
      users: UsersResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
