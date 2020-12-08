import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute, ParamMap} from '@angular/router';
import { UploadDialogComponent } from './upload-dialog/upload-dialog.component';

@Component({
    template: ''
})
export class UploadComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {

    this.route.queryParamMap.subscribe( (queryparamMap: ParamMap) => {
        this.openDialog(+queryparamMap.get('ModuleType'));
    });

  }

  public openDialog(ModuleType: number) {

    const dialogRef = this.dialog.open(UploadDialogComponent, {
      minHeight: '150px',
      minWidth: '500px',
      restoreFocus: false,
      disableClose: true,
      role: 'dialog',
      hasBackdrop: true,
      data: {
        ModuleType
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.router.navigate(["/"], { relativeTo: this.route });
      this.router.navigate([{ outlets: { dialog: null }}]);
    });
  }
}
