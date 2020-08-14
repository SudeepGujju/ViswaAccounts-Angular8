import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http/';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Observable, EMPTY } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../modules';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private alrtSrvc: AlertService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      // tap(
      //   (e) => { console.log('Success Interceptor > tap - ' , e); },
      //   (e) => { console.log('Error Interceptor > tap - ' , e); },
      // ),

      catchError( (err: HttpErrorResponse) => {
        let error = '';

        if (err.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          error = 'Unable To Connect';
          console.log(err.error);
        } else {
          switch (err.status) {
            case 0: {
              error = 'Unable To Connect';
              break;
            }
            case 400: {
              error = err.error || err.statusText || 'Bad Request';
              break;
            }
            case 401: {

              error = err.error || err.statusText || 'Unauthorized Access';

              if (!req.url.endsWith('refresh')) {
                return throwError(err);
              } else {
                this.alrtSrvc.showErrorAlert(error).afterClosed().subscribe(() => {
                  this.authService.logout(true);
                });

                return EMPTY;
              }

              // location.reload(true);
              // break;
            }
            case 403: {
              error = err.error || err.statusText || 'Forbidden';
              break;
            }
            case 404: {
              error = err.error || err.statusText || 'Requested Resource Not Found';
              break;
            }
            case 500: {
              error = err.error || err.statusText || 'Internal Server Error';
              break;
            }
            default: {
              error = `Error Code: ${err.status}. Unknown Error`;
            }
          }
        }

        return throwError(error);
      })
    );
  }
}
