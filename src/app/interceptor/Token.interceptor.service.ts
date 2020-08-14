import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http/';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, filter, take, tap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken() || null;

    if (token) {
      req = this.addToken(req);
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>) {

    const token = this.authService.getAccessToken();

    return request.clone({
      setHeaders: {
        [this.authService.AUTH_HEADER]: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {

    if (!this.authService.isRefreshing) {

      this.authService.isRefreshing = true;
      this.authService.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {

        this.authService.setAccessToken(token.accessToken);
        this.authService.isRefreshing = false;
        this.authService.refreshTokenSubject.next(true);
        return next.handle(this.addToken(request));
        })
      );

    } else {

      return this.authService.refreshTokenSubject.pipe(
        filter((unblock) => unblock != null),
        take(1),
        switchMap((unblock) => {
          return next.handle(this.addToken(request));
        })
      );
    }
  }
}
