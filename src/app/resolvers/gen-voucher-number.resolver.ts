import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Group } from 'app/data-model';
import { GeneralVouchersService } from 'app/services';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GenVouchNumberResolver implements Resolve<Group> {

    constructor(private genVouchSrvc: GeneralVouchersService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Group> {

        return  this.genVouchSrvc.getNextId()
                            .pipe(
                                catchError( () => of(null) )
                            );
    }

}
