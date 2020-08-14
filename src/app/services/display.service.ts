import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DisplayService {

  public isHandSet$: Observable<boolean>;
  private loaderSubject: Subject<boolean>;
  public loader$: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isHandSet$ = breakpointObserver.observe([Breakpoints.XSmall]).pipe(
      map((result) => result.matches),
      shareReplay()// Find Usage
    );

    this.loaderSubject = new Subject();
    this.loader$ = this.loaderSubject.asObservable();

  }

  public showLoader() {
    this.loaderSubject.next(true);
  }

  public hideLoader() {
    this.loaderSubject.next(false);
  }
}
