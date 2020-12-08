import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'app/guards';
import { GstReportsComponent } from './gst-reports/gst-reports.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: GstReportsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GstRoutingModule { }
