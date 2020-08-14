import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserStatus } from '../../data-model';
import { AlertService } from '../../modules/alert';
import { UserService } from '../../services';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  public userStatus = UserStatus;
  public registrationForm: FormGroup;
  public pageMode = 'create';
  public inProgress = false;
  public passwordErrorStateMatcher;

  constructor(private fb: FormBuilder, private userSrvc: UserService, private alrtSrvc: AlertService, private dialogRef: MatDialogRef<RegistrationComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

    this.passwordErrorStateMatcher = new PasswordErrorStateMatcher();

    if (this.data && this.data.pageMode && this.data.pageMode.trim().length > 0) {
      this.pageMode = this.data.pageMode.toLowerCase();
    } else {
      this.pageMode = this.pageMode.toLowerCase();
    }

    this.registrationForm = this.fb.group({
      _id: [''],
      username: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      loginID: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
      cpassword: ['', [Validators.required]], // Validators.minLength(8), Validators.maxLength(15)
      finYear: ['2020-2021', [Validators.required]],
      status: [this.userStatus.Active, [Validators.required]]
    }, {
      validators: [this.comaprePassword('password', 'cpassword')]
    });

    if (this.pageMode !== 'create') {
      this.registrationForm.patchValue(this.data.record);
    }

  }

  get username() {
    return this.registrationForm.get('username') as FormControl;
  }

  get loginID() {
    return this.registrationForm.get('loginID') as FormControl;
  }

  get phone() {
    return this.registrationForm.get('phone') as FormControl;
  }

  get password() {
    return this.registrationForm.get('password') as FormControl;
  }

  get cpassword() {
    return this.registrationForm.get('cpassword') as FormControl;
  }

  get finYear() {
    return this.registrationForm.get('finYear') as FormControl;
  }

  get status() {
    return this.registrationForm.get('status') as FormControl;
  }

  save() {

    if (!this.registrationForm.valid) {
      return false;
    }

    this.inProgress = true;

    const credentials = Object.assign({}, this.registrationForm.value);

    const recordID = credentials._id;

    delete credentials.cpassword;
    delete credentials._id;

    if (this.pageMode === 'create') {

      this.userSrvc.save(credentials).subscribe(
        (resp) => {
          this.inProgress = false;

          this.alrtSrvc.showSuccessAlert(resp).afterClosed().subscribe(() => {
            this.dialogRef.close('saved');
          });
        },
        (error) => {

          this.inProgress = false;

          if (error.includes('Login ID already exists')) {
            this.loginID.setErrors({ userAlreadyExists: true });
          } else {
            this.alrtSrvc.showErrorAlert(error);
          }
        }
      );

    } else {

      this.userSrvc.update(recordID, credentials).subscribe(
        (resp) => {
          this.inProgress = false;

          this.alrtSrvc.showSuccessAlert(resp).afterClosed().subscribe(() => {
            this.dialogRef.close('saved');
          });

        },
        (error) => {

          this.inProgress = false;
          this.alrtSrvc.showErrorAlert(error);

        }
      );

    }

  }

  comaprePassword(passwordFldNm, cpasswordFldNm): ValidatorFn {

    return (group: FormGroup): ValidationErrors | null => {

      const passwordFld = (group.get(passwordFldNm) as FormControl);
      const cpasswordFld = (group.get(cpasswordFldNm) as FormControl);

      if (passwordFld.value && cpasswordFld.value && passwordFld.value !== cpasswordFld.value) {
        return { pswdNotMatch: true };
      }

      return null;
    };
  }
}

export class PasswordErrorStateMatcher implements ErrorStateMatcher {

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null) {
    const isSubmitted = form && form.submitted;
    return !!( control && control.invalid && (control.dirty || control.touched || isSubmitted) ) || !!( form && form.errors && form.errors.pswdNotMatch);
  }

}
