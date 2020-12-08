import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupDetailsComponent } from './group-details.component';
import { Constants } from 'app/constants';

@Component({
  template: ''
})
export class GroupDetailsDialogComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {

    if (this.route.snapshot.data.pageMode === Constants.PAGE_MODE.CREATE) {
      this.openCreateDialog();
    } else {
      this.openEditDialog();
    }
  }

  public openCreateDialog() {

    const dialogRef = this.dialog.open(GroupDetailsComponent, {
      width: '550px',
      role: 'dialog',
      hasBackdrop: true,
      disableClose: true,
      restoreFocus: false,
      data: {
        pageMode: Constants.PAGE_MODE.CREATE
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.router.navigate(["/"], { relativeTo: this.route });
      this.router.navigate([{ outlets: { dialog: null } }]);
    });
  }

  public openEditDialog() {

    const dialogRef = this.dialog.open(GroupDetailsComponent, {
      width: '550px',
      role: 'dialog',
      hasBackdrop: true,
      disableClose: true,
      restoreFocus: false,
      data: {
        pageMode: Constants.PAGE_MODE.EDIT,
        details: this.route.snapshot.data.details
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.router.navigate(["/"], { relativeTo: this.route });
      this.router.navigate([{ outlets: { dialog: null } }]);
    });
  }
}
