import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Group } from 'app/data-model';
import { GroupService } from 'app/services';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GroupDropdownResolver implements Resolve<Group> {

    constructor(private grpSrvc: GroupService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Group> {

        return  this.grpSrvc.getDropdownList()
                            .pipe(
                                catchError( () => of(null) )
                            );
    }

}
