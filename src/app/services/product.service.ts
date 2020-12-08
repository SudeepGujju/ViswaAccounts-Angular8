import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../data-model/';
import { productUploadUrl, productSearchUrl, productUserSearchUrl } from 'app/urlConfig';
import { environment } from 'environments/environment';

@Injectable()
export class ProductService {

  constructor(private http: HttpClient) { }

  /*
  ** Use this to get list of all products of all users.
  */
  getList(name: string, myProdsOnly: string): Observable<Product[]> {

    return this.http.get<Product[]>(productSearchUrl, { params: {name, myProdsOnly} });
  }

  /*
  ** Use this to get list of products of specific user.
  */
  getUserProductsList(name: string, userId: string): Observable<Product[]> {
    return this.http.get<Product[]>(productUserSearchUrl, { params: {name, userId}, headers: {[environment.hideLoader]: 'true'} });
  }

  // uploadList(file: File): Observable<any> {

  //   const formData = new FormData();
  //   formData.append('file', file, file.name);

  //   return this.http.post(productUploadUrl, formData);
  // }
}
