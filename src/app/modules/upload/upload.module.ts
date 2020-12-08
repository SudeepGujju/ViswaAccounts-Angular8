import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { UploadDialogComponent } from './upload-dialog/upload-dialog.component';
import { UploadRoutingModule } from './upload-routing.module';
import { UploadComponent } from './upload.component';
import { UploadService } from './upload.service';
import { AlertModule } from '../alert';

@NgModule({
  declarations: [UploadComponent, UploadDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UploadRoutingModule,
    MaterialModule,
    AlertModule
  ],
  entryComponents: [UploadDialogComponent],
  providers: [UploadService],
})
export class UploadModule {}
