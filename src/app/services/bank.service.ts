import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bank } from '../data-model';
import { bankNxtRecIDUrl, bankUrl, bankSearchUrl } from '../urlConfig';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  constructor(private http: HttpClient) { }

  getSearchList(fromDate: string, toDate: string, code: string): Observable<Bank[]> {
    return this.http.get<Bank[]>(bankSearchUrl, {params: {fromDate, toDate, code}});
  }

  getList(code: string, date: string): Observable<Bank[]> {
    return this.http.get<Bank[]>(bankUrl, {params: {code, date}});
  }

  get(id: string): Observable<Bank> {
    return this.http.get<Bank>(bankUrl + '/' + id);
  }

  save(account: Bank): Observable<any> {
    return this.http.post(bankUrl, account, {responseType: 'text'});
  }

  update(id: string, account: Bank): Observable<any> {
    return this.http.put(bankUrl + '/' + id, account, {responseType: 'text'} );
  }

  delete(id: string) {
    return this.http.delete(bankUrl + '/' + id, {responseType: 'text'});
  }

  getNextId(code: string, date: string): Observable<number> {
    return this.http.get<{nextRecId: number}>(bankNxtRecIDUrl, {params: {code, date}, headers: {[environment.hideLoader]: 'true'}}).pipe(
      map(resp => resp.nextRecId )
    );
  }

}
