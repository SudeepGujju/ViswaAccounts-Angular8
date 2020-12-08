import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeneralVoucher } from '../data-model';
import { genVouchNxtRecIDUrl, genVouchUrl } from '../urlConfig';

@Injectable({
  providedIn: 'root'
})
export class GeneralVouchersService {

  private listUpdateSubject: Subject<boolean> = new Subject();
  public listUpdate$: Observable<boolean>;

  constructor(private http: HttpClient) { 
    this.listUpdate$ = this.listUpdateSubject.asObservable();
  }

  notifyToUpdateList(){
    this.listUpdateSubject.next(true);
  }

  getList(): Observable<GeneralVoucher[]> {
    return this.http.get<GeneralVoucher[]>(genVouchUrl);
  }

  get(id: string): Observable<GeneralVoucher> {
    return this.http.get<GeneralVoucher>(genVouchUrl + '/' + id);
  }

  getNextId(): Observable<number> {
    return this.http.get<{nextRecId: number}>(genVouchNxtRecIDUrl, {headers: {[environment.hideLoader]: 'true'}}).pipe(
      map(resp => resp.nextRecId )
    );
  }

  save(genVoucher: GeneralVoucher): Observable<any> {
    return this.http.post(genVouchUrl, genVoucher, {responseType: 'text'});
  }

  update(id: string, genVoucher: GeneralVoucher): Observable<any> {
    return this.http.put(genVouchUrl + '/' + id, genVoucher, {responseType: 'text'} );
  }

  delete(id: string) {
    return this.http.delete(genVouchUrl + '/' + id, {responseType: 'text'});
  }

}
