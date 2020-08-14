import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BankDetailsComponent } from './components/bank-details/bank-details.component';
import { BankListComponent } from './components/bank-list/bank-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { GenVoucherDetailsComponent } from './components/gen-voucher-details/gen-voucher-details.component';
import { GenVoucherListComponent } from './components/gen-voucher-list/gen-voucher-list.component';
import { GroupDetailsComponent } from './components/group-details/group-details.component';
import { GroupsListComponent } from './components/groups-list/groups-list.component';
import { InventoryDetailsComponent } from './components/inventory-details/inventory-details.component';
import { InventoryListComponent } from './components/inventory-list/inventory-list.component';
import { LoaderComponent } from './components/loader/loader.component';
import { LoginComponent } from './components/login/login.component';
import { RecordsComponent } from './components/records/records.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ShopDetailsComponent } from './components/shop-details/shop-details.component';
import { ShopListComponent } from './components/shop-list/shop-list.component';
import { UserPermissionsComponent } from './components/user-permissions/user-permissions.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { VouchersDetailsComponent } from './components/vouchers-details/vouchers-details.component';
import { VouchersListComponent } from './components/vouchers-list/vouchers-list.component';
import { ErrorInterceptor, LoaderInterceptor, TokenInterceptor } from './interceptor';
import { AlertModule, MaterialModule } from './modules';
import { NavbarComponent } from './navbar/navbar.component';
import { SharedDirectives } from './utils/number-only.directive';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from './modules/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegistrationComponent,
    DashboardComponent,
    ShopDetailsComponent,
    ShopListComponent,
    VouchersListComponent,
    VouchersDetailsComponent,
    InventoryDetailsComponent,
    GroupDetailsComponent,
    InventoryListComponent,
    GroupsListComponent,
    GenVoucherDetailsComponent,
    GenVoucherListComponent,
    FileUploadComponent,
    RecordsComponent,
    UsersListComponent,
    UserPermissionsComponent,
    BankDetailsComponent,
    LoaderComponent,
    BankListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
    AlertModule,
    SharedDirectives,
    SharedModule,
    NgxMaskModule.forRoot({
      dropSpecialCharacters: false
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  entryComponents: [
    FileUploadComponent,
    RegistrationComponent,
    ShopDetailsComponent,
    VouchersDetailsComponent,
    InventoryDetailsComponent,
    GroupDetailsComponent,
    GenVoucherDetailsComponent,
    UserPermissionsComponent,
    BankDetailsComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
