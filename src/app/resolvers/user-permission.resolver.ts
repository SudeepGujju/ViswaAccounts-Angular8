import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from 'app/data-model';
import { UserService } from 'app/services';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserPermissionResolver implements Resolve<any> {

    constructor(private userSrvc: UserService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

        const id = route.paramMap.get('id');
        return  this.userSrvc.getPersmission(id)
                            .pipe(
                                catchError( () => of(null) )
                            );
    }

}
