import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Shop } from '../data-model';
import { accountCodeAvailUrl, accountUrl, accountDropdownUrl, accountUploadUrl } from '../urlConfig';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(private http: HttpClient) { }

  getList(): Observable<Shop[]> {
    return this.http.get<Shop[]>(accountUrl);
  }

  getDropdownList(): Observable<Shop[]> {
    return this.http.get<Shop[]>(accountDropdownUrl);
  }

  get(id: string): Observable<Shop> {
    return this.http.get<Shop>(accountUrl + '/' + id);
  }

  save(account: Shop): Observable<any> {
    return this.http.post(accountUrl, account, {responseType: 'text'});
  }

  // upload(file: File): Observable<any> {

  //   const formData = new FormData();
  //   formData.append('file', file, file.name);

  //   return this.http.post(accountUploadUrl, formData);
  // }

  update(id: string, account: Shop): Observable<any> {
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

}
