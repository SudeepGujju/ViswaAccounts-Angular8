import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert.component';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [AlertComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [AlertComponent],
  entryComponents: [AlertComponent]
})
export class AlertModule { }
