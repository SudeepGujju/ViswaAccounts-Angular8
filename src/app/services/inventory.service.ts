import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Inventory } from '../data-model';
import { inventoryNxtRecIDUrl, inventoryUrl, inventoryUploadUrl, inventorySearchUrl } from '../urlConfig';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http: HttpClient) {}

  getSearchList(inventoryType: string, fromDate: string, toDate: string, code: string): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(inventorySearchUrl, {params: {inventoryType, fromDate, toDate, code}});
  }

  getList(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(inventoryUrl);
  }

  get(id: string): Observable<Inventory> {
    return this.http.get<Inventory>(inventoryUrl + '/' + id);
  }

  getNextId(inventoryType: string): Observable<number> {
    return this.http.get<{nextRecId: number}>(inventoryNxtRecIDUrl, {params: {inventoryType}, headers: {[environment.hideLoader]: 'true'}}).pipe(
      map(resp => resp.nextRecId )
    );
  }

  save(inventory: Inventory): Observable<any> {
    return this.http.post(inventoryUrl, inventory, {responseType: 'text'});
  }

  // upload(file: File): Observable<any> {

  //   const formData = new FormData();
  //   formData.append('file', file, file.name);

  //   return this.http.post(inventoryUploadUrl, formData);
  // }

  update(id: string, inventory: Inventory): Observable<any> {
    return this.http.put(inventoryUrl + '/' + id, inventory, {responseType: 'text'} );
  }

  delete(id: string) {
    return this.http.delete(inventoryUrl + '/' + id, {responseType: 'text'});
  }
}
