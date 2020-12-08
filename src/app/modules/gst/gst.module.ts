import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GstRoutingModule } from './gst-routing.module';
import { GstReportsComponent } from './gst-reports/gst-reports.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    GstReportsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    GstRoutingModule
  ]
})
export class GstModule { }
