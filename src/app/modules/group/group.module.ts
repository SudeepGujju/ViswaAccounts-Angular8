import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupRoutingModule } from './group-routing.module';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { GroupDetailsDialogComponent  } from './group-details/group-dailog-details.component';
import { GroupDetailsComponent } from './group-details/group-details.component';


@NgModule({
  declarations: [
    GroupsListComponent,
    GroupDetailsComponent,
    GroupDetailsDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    GroupRoutingModule
  ],
  entryComponents: [GroupDetailsComponent]
})
export class GroupModule { }
