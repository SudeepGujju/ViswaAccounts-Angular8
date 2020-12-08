import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Account } from '../data-model';
import { accountCodeAvailUrl, accountUrl, accountDropdownUrl, accountOpenBalUrl, accountUploadUrl } from '../urlConfig';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private listUpdateSubject: Subject<boolean> = new Subject();
  public listUpdate$: Observable<boolean>;

  constructor(private http: HttpClient) { 
    this.listUpdate$ = this.listUpdateSubject.asObservable();
  }

  notifyToUpdateList(){
    this.listUpdateSubject.next(true);
  }

  getList(): Observable<Account[]> {
    return this.http.get<Account[]>(accountUrl);
  }

  getDropdownList(): Observable<Account[]> {
    return this.http.get<Account[]>(accountDropdownUrl);
  }

  get(id: string): Observable<Account> {
    return this.http.get<Account>(accountUrl + '/' + id);
  }

  save(account: Account): Observable<any> {
    return this.http.post(accountUrl, account, {responseType: 'text'});
  }

  // upload(file: File): Observable<any> {

  //   const formData = new FormData();
  //   formData.append('file', file, file.name);

  //   return this.http.post(accountUploadUrl, formData);
  // }

  update(id: string, account: Account): Observable<any> {
    return this.http.put(accountUrl + '/' + id, account, {responseType: 'text'} );
  }

  delete(id: string) {
    return this.http.delete(accountUrl + '/' + id, {responseType: 'text'});
  }

  isCodeAvail(code: string): Observable<boolean> {

    return this.http.get<{codeAvailable: boolean}>(accountCodeAvailUrl + '/' + code, {headers: {[environment.hideLoader]: 'true'}}).pipe(
      map(resp => resp.codeAvailable )
    );
  }

  getOpenTrailBalList() {
    return this.http.get<Account[]>(accountOpenBalUrl);
  }

}
