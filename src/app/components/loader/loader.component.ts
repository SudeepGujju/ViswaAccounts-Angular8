import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { DisplayService } from '../../services';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('spinner', {static: false})private spinner: TemplateRef<any>;

  private overlayRef: OverlayRef = null;
  private templatePortal: TemplatePortal = null;
  private loaderSubscription: Subscription;

  constructor(private overlaySrvc: Overlay, private viewContainerRef: ViewContainerRef, private dispSrvc: DisplayService) {}

  ngOnInit() {
    this.overlayRef = this.overlaySrvc.create({
                        hasBackdrop: true,
                        positionStrategy: this.overlaySrvc.position().global().centerVertically().centerHorizontally()
                      });

    this.dispSrvc.loader$.subscribe((show) => {
      if (show) {
        this.showLoader();
      } else {
        this.hideLoader();
      }
    }, (error) => {
      this.hideLoader();
    });
  }

  ngAfterViewInit() {
    this.templatePortal = new TemplatePortal(this.spinner, this.viewContainerRef);
  }

  ngOnDestroy() {
    this.loaderSubscription.unsubscribe();
  }

  showLoader() {
    if (!this.overlayRef.hasAttached()) {
      this.overlayRef.attach(this.templatePortal);
    }

  }

  hideLoader() {

    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
  }
}
