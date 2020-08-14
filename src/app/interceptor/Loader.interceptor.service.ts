import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { DisplayService } from '../services/display.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

    constructor(private dispSrvc: DisplayService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const hideLoader = req.headers.get(environment.hideLoader);

        if (!hideLoader) {
            this.dispSrvc.showLoader();
            return next.handle(req).pipe(finalize( () => {
                this.dispSrvc.hideLoader();
            }));
        }

        return next.handle(req.clone({
            headers: req.headers.delete(environment.hideLoader)
        }));
    }

}
