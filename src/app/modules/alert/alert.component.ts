import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogConfig, DialogType, AlertType } from './constants';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styles: []
})
export class AlertComponent implements OnInit {

  public DialogType = DialogType;
  public AlertType = AlertType;

  public title: string;
  public message: string;
  public dlgType: DialogType;
  public alrtType: AlertType;
  public okBtnLabel: string;
  public cancelBtnLabel: string;

  constructor(private dialogRef: MatDialogRef<AlertComponent>, @Inject(MAT_DIALOG_DATA) private config: DialogConfig) { }

  ngOnInit() {
    this.title = this.config.title || '';
    this.message = this.config.message || '';
    this.dlgType = this.config.dialogType || this.DialogType.Alert;
    this.alrtType = this.config.alertType || this.AlertType.Success;
    this.okBtnLabel = this.config.okBtnLabel || 'OK';
    this.cancelBtnLabel = this.config.cancelBtnLabel || 'CANCEL';
  }

}
