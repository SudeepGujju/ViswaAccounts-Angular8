import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { glPrepareUrl, glAccountCopyUrl } from '../../urlConfig';
import { Observable } from 'rxjs';

@Injectable()
export class GlService {

  constructor(private http: HttpClient) { }

  prepare(){
    return this.http.get(glPrepareUrl);
  }

  getAccountCopyList(fromDate: string, toDate: string, code: string): Observable<any[]> {
    return this.http.get<any[]>(glAccountCopyUrl, {params: {fromDate, toDate, code}});
  }
}
