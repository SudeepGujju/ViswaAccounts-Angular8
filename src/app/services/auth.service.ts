import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../data-model';
import { LoginUrl, RefreshTokenUrl, LogoutUrl } from '../urlConfig';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userBehaviourSubject: BehaviorSubject<User>;
  public userObservable$: Observable<User>;
  private currentUser: User = null;
  public finYearStart: Date = null;
  public finYearEnd: Date = null;

  public AUTH_HEADER = 'X-Auth-Token';
  private CURRENT_USER = 'CURRENT_USER';
  public isRefreshing = false;
  public refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private router: Router, private dlgSrvc: DialogService) {

    this.currentUser = this.getUserInStorage();
    this.userBehaviourSubject = new BehaviorSubject(this.currentUser);
    this.userObservable$ = this.userBehaviourSubject.asObservable();

    if (this.currentUser) {
      this.setFinYear(this.currentUser.finYear);
    }

  }

  private setFinYear(finYear: string) {
    const startDate = new Date(parseInt(finYear.split('-')[0], 10), 3, 1);
    const endDate = new Date(parseInt(finYear.split('-')[1], 10), 2, 31);

    this.finYearStart = startDate;
    this.finYearEnd = endDate;
  }

  public get user() {
    return this.currentUser;
  }

  public get userID() {
    return this.currentUser._id;
  }

  public get userPersmissions() {
    return this.currentUser.permissions;
  }

  public getAccessToken() {
    return this.currentUser && this.currentUser.accessToken;
  }

  private getRefreshToken() {
    return this.currentUser && this.currentUser.refreshToken;
  }

  public setAccessToken(token) {
    this.currentUser.accessToken = token;
    this.setUserInStorage(this.currentUser);
  }

  public login(loginID: string, password: string) {

    return this.http.post<User>(LoginUrl, { loginID, password }).pipe(
      map(response => {
        try {

          const token = response.accessToken; // response.headers.get(this.AUTH_HEADER);

          if (token) {

            const user = response;

            this.currentUser = user;
            this.userBehaviourSubject.next(user);
            this.setFinYear(user.finYear);
            this.setUserInStorage(user);

            return true;
          }

          return false;
        } catch (e) {
          console.log('Error in auth service');
        }
      }));
  }

  public logout(redirect?: boolean) {

    if (redirect) {
      this.http.post(LogoutUrl, {refreshToken: this.getRefreshToken()}, {responseType: 'text'}).subscribe(
        () => {
          this.dlgSrvc.closeAllDialogs();
          this.router.navigate([{ outlets: { dialog: null } }]);
          this.router.navigate(['/login']);
          this.clearUserDetails();
        },
        () => {
          this.dlgSrvc.closeAllDialogs();
          this.router.navigate([{ outlets: { dialog: null } }]);
          this.router.navigate(['/login']);
          this.clearUserDetails();
        }
      );
    } else {
      this.clearUserDetails();
    }

    return true;
  }

  private clearUserDetails() {
    this.removeUserInStorage();
    this.isRefreshing = false;
    this.refreshTokenSubject.next(null);
    this.userBehaviourSubject.next(null);
    this.currentUser = null;
    this.finYearStart = this.finYearEnd = null;
  }

  public refreshToken() {
    return this.http.post<{accessToken: any}>(RefreshTokenUrl, {refreshToken: this.getRefreshToken()}); // .pipe(catchError( (error) => { console.log('auth'); return error; }));
  }

  private setUserInStorage(user) {
    localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
  }

  private getUserInStorage() {
    return JSON.parse(localStorage.getItem(this.CURRENT_USER)) || null;
  }

  private removeUserInStorage() {
    localStorage.removeItem(this.CURRENT_USER);
  }
}
