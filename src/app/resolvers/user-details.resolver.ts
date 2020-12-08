import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from 'app/data-model';
import { UserService } from 'app/services';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserDetailsResolver implements Resolve<User> {

    constructor(private userSrvc: UserService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {

        const id = route.paramMap.get('id');
        return  this.userSrvc.get(id)
                            .pipe(
                                catchError( () => of(null) )
                            );
    }

}
