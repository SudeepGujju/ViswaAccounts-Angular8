import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../data-model';
import { purchaseUrl } from 'app/urlConfig';


@Injectable()
export class OrderService {

  constructor(private http: HttpClient) { }

  purchase(order: Order) {
    return this.http.post(purchaseUrl, order);
  }
}
