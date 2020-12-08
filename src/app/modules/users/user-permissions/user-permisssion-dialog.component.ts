import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { UserPermissionsComponent } from './user-permissions.component';

@Component({
  template: ''
})
export class UserPermissionDialogComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
      this.openEditDialog();
  }

  public openEditDialog() {

    const dialogRef = this.dialog.open(UserPermissionsComponent, {
      width: '800px',
      role: 'dialog',
      hasBackdrop: true,
      disableClose: true,
      restoreFocus: false,
      data: {
        details: this.route.snapshot.data.details
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.router.navigate(["/"], { relativeTo: this.route });
      this.router.navigate([{ outlets: { dialog: null } }]);
    });
  }
}
