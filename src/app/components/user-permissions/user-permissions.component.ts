import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../services';

@Component({
  selector: 'app-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.scss']
})
export class UserPermissionsComponent implements OnInit {

  public userPermForm: FormGroup;
  public recordId: string;
  public username: string;
  public inProgress: boolean;
  public errMsg: string;

  constructor(private fb: FormBuilder, private userSrvc: UserService, private dialogRef: MatDialogRef<UserPermissionsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.userPermForm = this.fb.group({
      createAccount: this.fb.control(false),
      editAccount: this.fb.control(false),
      deleteAccount: this.fb.control(false),
      viewListAccount: this.fb.control(false),
      createVoucher: this.fb.control(false),
      editVoucher: this.fb.control(false),
      deleteVoucher: this.fb.control(false),
      viewListVoucher: this.fb.control(false),
      createInventory: this.fb.control(false),
      editInventory: this.fb.control(false),
      deleteInventory: this.fb.control(false),
      viewListInventory: this.fb.control(false),
      createGroup: this.fb.control(false),
      editGroup: this.fb.control(false),
      deleteGroup: this.fb.control(false),
      viewListGroup: this.fb.control(false),
      createGenVoucher: this.fb.control(false),
      editGenVoucher: this.fb.control(false),
      deleteGenVoucher: this.fb.control(false),
      viewListGenVoucher: this.fb.control(false),
      createUser: this.fb.control(false),
      editUser: this.fb.control(false),
      deleteUser: this.fb.control(false),
      viewListUser: this.fb.control(false),
      editUserPersmissions: this.fb.control(false),
      generateReports: this.fb.control(false),
      uploadFile: this.fb.control(false),
      createBank: this.fb.control(false),
      editBank: this.fb.control(false),
      deleteBank: this.fb.control(false),
      viewListBank: this.fb.control(false),
      createProduct: this.fb.control(false),
      viewListProduct: this.fb.control(false),
    });

    this.recordId = this.data.record.id;
    this.username = this.data.record.username;

    if (this.data.record.permissions) {
      this.userPermForm.patchValue(this.data.record.permissions);
    }
  }

  save() {

    this.errMsg = '';

    if (!this.userPermForm.valid) {
      return false;
    }

    this.inProgress = true;

    this.userSrvc.updatePersmission(this.recordId, this.userPermForm.value).subscribe((resp) => {
      this.inProgress = false;
      this.dialogRef.close('saved');
    },
    (error) => {

      this.inProgress = false;
      this.errMsg = error;
      return false;
    });

  }
}
