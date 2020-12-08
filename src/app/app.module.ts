import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ErrorInterceptor, LoaderInterceptor, TokenInterceptor } from './interceptor';
import { AlertModule, MaterialModule } from './modules';
import { NavbarComponent } from './navbar/navbar.component';
import { SharedDirectives } from './utils/number-only.directive';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from './modules/shared/shared.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    FileUploadComponent,
    LoaderComponent
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
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  entryComponents: [
    FileUploadComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
