import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Shop, User } from 'app/data-model';
import { Observable, of } from 'rxjs';
import { ShopService, UserService } from 'app/services';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UsersResolver implements Resolve<User[]>{

    constructor(private userSrvc: UserService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User[]>{
        return this.userSrvc.getList(true)
            .pipe( catchError(()=> of([]) ) );
    }

}