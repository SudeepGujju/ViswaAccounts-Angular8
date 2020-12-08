import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public inProgress = false;
  public loginForm: FormGroup;
  public errMsg: string;

  constructor(private fb: FormBuilder, private authSrvc: AuthService, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      loginID: ['admin', Validators.required],
      password: ['123456789', Validators.required]
    });
  }

  get loginID() {
    return this.loginForm.get('loginID') as FormControl;
  }

  get password() {
    return this.loginForm.get('password') as FormControl;
  }

  login() {

    this.errMsg = '';

    if (!this.loginForm.valid) {
      return false;
    }

    this.errMsg = '';
    this.inProgress = true;
    this.authSrvc.login(this.loginForm.value.loginID, this.loginForm.value.password)
      .subscribe(
        (resp) => {

          this.inProgress = false;

          if (resp) {
            this.router.navigate(['/dashboard']);
          }
        },
        (error) => {

          this.inProgress = false;
          this.errMsg = error;
        }
      );
  }

}
