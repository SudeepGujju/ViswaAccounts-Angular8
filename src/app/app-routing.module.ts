import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankDetailsComponent } from './components/bank-details/bank-details.component';
import { BankListComponent } from './components/bank-list/bank-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GenVoucherListComponent } from './components/gen-voucher-list/gen-voucher-list.component';
import { GroupsListComponent } from './components/groups-list/groups-list.component';
import { InventoryListComponent } from './components/inventory-list/inventory-list.component';
import { LoginComponent } from './components/login/login.component';
import { RecordsComponent } from './components/records/records.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ShopListComponent } from './components/shop-list/shop-list.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { VouchersListComponent } from './components/vouchers-list/vouchers-list.component';
import { AuthGuard } from './guards';

const routes: Routes = [
  {
    path: 'register',
    canActivate: [AuthGuard],
    component: RegistrationComponent,
  },
  {
    path: 'login',
    canActivate: [AuthGuard],
    component: LoginComponent,
  },
  {
    path: 'AccountsList',
    canActivate: [AuthGuard],
    component: ShopListComponent,
  },
  {
    path: 'VouchersList',
    canActivate: [AuthGuard],
    component: VouchersListComponent,
  },
  {
    path: 'InventoryList',
    canActivate: [AuthGuard],
    component: InventoryListComponent,
  },
  {
    path: 'GroupsList',
    canActivate: [AuthGuard],
    component: GroupsListComponent,
  },
  {
    path: 'GeneralVouchersList',
    canActivate: [AuthGuard],
    component: GenVoucherListComponent,
  },
  {
    path: 'Records',
    canActivate: [AuthGuard],
    component: RecordsComponent,
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent,
  },
  {
    path: 'UsersList',
    canActivate: [AuthGuard],
    component: UsersListComponent
  },
  {
    path: 'CreateBank',
    canActivate: [AuthGuard],
    component: BankDetailsComponent
  },
  {
    path: 'BanksList',
    canActivate: [AuthGuard],
    component: BankListComponent
  },
  // {
  //   path: 'ProductsList',
  //   canActivate: [AuthGuard],
  //   component: ProductListComponent,
  // },
  {
    path: 'product',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    loadChildren: () => import('./modules/product/product.module').then( m => m.ProductModule),
  },
  {
    path: 'upload',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    loadChildren: () => import('./modules/upload/upload.module').then( m => m.UploadModule),
    outlet: 'dialog'
  },
  {
    path: 'GL',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    loadChildren: () => import('./modules/gl/gl.module').then( m => m.GlModule)
  },
  {
    path: 'order',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    loadChildren: () => import('./modules/order/order.module').then( m => m.OrderModule )
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}