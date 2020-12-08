import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    loadChildren: () => import('./modules/login/login.module').then( m => m.LoginModule),
  },
  {
    path: 'dialog/group',
    canLoad: [AuthGuard],
    loadChildren: () => import('./modules/group/group.module').then( m => m.GroupModule),
    outlet: 'dialog'
  },
  {
    path: 'group',
    canLoad: [AuthGuard],
    loadChildren: () => import('./modules/group/group.module').then( m => m.GroupModule),
  },
  {
    path: 'dialog/account',
    canLoad: [AuthGuard],
    loadChildren: () => import('./modules/account/account.module').then( m => m.AccountModule),
    outlet: 'dialog'
  },
  {
    path: 'account',
    canLoad: [AuthGuard],
    loadChildren: () => import('./modules/account/account.module').then( m => m.AccountModule),
  },
  {
    path: 'bank',
    canLoad: [AuthGuard],
    loadChildren: () => import('./modules/bank/bank.module').then( m => m.BankModule),
  },
  {
    path: 'dialog/inventory',
    canLoad: [AuthGuard],
    loadChildren: () => import('./modules/inventory/inventory.module').then( m => m.InventoryModule),
    outlet: 'dialog'
  },
  {
    path: 'inventory',
    canLoad: [AuthGuard],
    loadChildren: () => import('./modules/inventory/inventory.module').then( m => m.InventoryModule),
  },
  {
    path: 'dialog/general-voucher',
    canLoad: [AuthGuard],
    loadChildren: () => import('./modules/general-voucher/general-voucher.module').then( m => m.GeneralVoucherModule),
    outlet: 'dialog'
  },
  {
    path: 'general-voucher',
    canLoad: [AuthGuard],
    loadChildren: () => import('./modules/general-voucher/general-voucher.module').then( m => m.GeneralVoucherModule),
  },
  {
    path: 'gst',
    canLoad: [AuthGuard],
    loadChildren: () => import('./modules/gst/gst.module').then( m => m.GstModule)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent,
  },
  {
    path: 'dialog/user',
    canLoad: [AuthGuard],
    loadChildren: () => import('./modules/users/users.module').then( m => m.UsersModule),
    outlet: 'dialog'
  },
  {
    path: 'user',
    canLoad: [AuthGuard],
    loadChildren: () => import('./modules/users/users.module').then( m => m.UsersModule)
  },
  // {
  //   path: 'ProductsList',
  //   canActivate: [AuthGuard],
  //   component: ProductListComponent,
  // },
  {
    path: 'product',
    canLoad: [AuthGuard],
    loadChildren: () => import('./modules/product/product.module').then( m => m.ProductModule),
  },
  {
    path: 'upload',
    canLoad: [AuthGuard],
    loadChildren: () => import('./modules/upload/upload.module').then( m => m.UploadModule),
    outlet: 'dialog'
  },
  {
    path: 'gl',
    canLoad: [AuthGuard],
    loadChildren: () => import('./modules/gl/gl.module').then( m => m.GlModule)
  },
  {
    path: 'order',
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
