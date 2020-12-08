import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'app/data-model/product';
import { ProductService } from './product.service';
import { OrderService } from './order.service';
import { Order } from '../data-model/order';

@Injectable({
  providedIn: 'root',
})
export class FacedService {

    private _productSrvc: ProductService;
    private _orderSrvc: OrderService;

    get productSrvc() {

        if (!this._productSrvc) {
            this._productSrvc = this.injector.get(ProductService);
        }

        return this._productSrvc;
    }

    get orderSrvc() {

        if (!this._orderSrvc) {
            this._orderSrvc = this.injector.get(OrderService);
        }

        return this._orderSrvc;
    }

    constructor(private injector: Injector) {}
    // constructor(private productSrvc: ProductService, private orderSrvc: OrderService){}

    getProductsList(name: string, myProdsOnly: string): Observable<Product[]> {
        return this.productSrvc.getList(name, myProdsOnly);
    }

    getUserProductsList(name: string, userId: string): Observable<Product[]> {
        return this.productSrvc.getUserProductsList(name, userId);
    }

    placeOrder(order: Order) {
        return this.orderSrvc.purchase(order);
    }
}
