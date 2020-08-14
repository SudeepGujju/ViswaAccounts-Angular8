import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Product } from 'app/modules/shared/models/product';
import { ProductService } from './product.service';

@Injectable({
  providedIn: "root",
})
export class FacedService {
    constructor(private productSrvc: ProductService){}

    getProductsList(name: string, myProdsOnly: string): Observable<Product[]> {
        return this.productSrvc.getList(name, myProdsOnly);
    }

    getUserProductsList(name: string, userId: string): Observable<Product[]> {
        return this.productSrvc.getUserProductsList(name, userId);
    }
}
