import { Injectable, Optional, SkipSelf } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertComponent } from './alert.component';
import { DialogConfig, DialogType, AlertType } from './constants';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private dialog: MatDialog, @Optional() @SkipSelf() parent?: AlertService) {
    if (parent) {
      throw Error(
        `[AlertService]: trying to create multiple instances, but this service should be a singleton.`
      );
    }
  }

  private openDialog(config: DialogConfig): MatDialogRef<AlertComponent> {

    return this.dialog.open(AlertComponent, {
      minWidth: 200,
      data: config
    });
  }

  public showSuccessAlert(message: string, title: string = 'Success'): MatDialogRef<AlertComponent> {

    const config = {
      message,
      title,
      dialogType: DialogType.Alert,
      alertType: AlertType.Success
    };

    return this.openDialog(config);

  }

  public showWarningAlert(message: string, title: string = 'Warning'): MatDialogRef<AlertComponent> {

    const config = {
      message,
      title,
      dialogType: DialogType.Alert,
      alertType: AlertType.Warning
    };

    return this.openDialog(config);

  }

  public showErrorAlert(message: string, title: string = 'Error'): MatDialogRef<AlertComponent> {

    const config = {
      message,
      title,
      dialogType: DialogType.Alert,
      alertType: AlertType.Error
    };

    return this.openDialog(config);

  }

  public showConfirmAlert(message: string = 'Do you want to proceed?'): MatDialogRef<AlertComponent> {

    const config = {
      message,
      title: 'Confirmation',
      dialogType: DialogType.Confirm,
      okBtnLabel: 'PROCEED',
      cancelBtnLabel: 'CANCEL'
    };

    return this.openDialog(config);

  }

}
