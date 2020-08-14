import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Group } from '../data-model';
import { groupCodeAvailUrl, groupUrl, groupDropdownUrl, groupUploadUrl } from '../urlConfig';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) {}

  getDropdownList(): Observable<Group[]> {
    return this.http.get<Group[]>(groupDropdownUrl);
  }

  getList(): Observable<Group[]> {
    return this.http.get<Group[]>(groupUrl);
  }

  get(id: string): Observable<Group> {
    return this.http.get<Group>(groupUrl + '/' + id);
  }

  save(group: Group): Observable<any> {
    return this.http.post(groupUrl, group, {responseType: 'text'});
  }

  // upload(file: File): Observable<any> {

  //   const formData = new FormData();
  //   formData.append('file', file, file.name);

  //   return this.http.post(groupUploadUrl, formData);
  // }

  update(id: string, group: Group): Observable<any> {
    return this.http.put(groupUrl + '/' + id, group, {responseType: 'text'} );
  }

  delete(id: string) {
    return this.http.delete(groupUrl + '/' + id, {responseType: 'text'});
  }

  isCodeAvail(code: string): Observable<boolean> {

    return this.http.get<{codeAvailable: boolean}>(groupCodeAvailUrl + '/' + code, {headers: {[environment.hideLoader]: 'true'} } ).pipe(
      map(resp => resp.codeAvailable )
    );
  }
}
