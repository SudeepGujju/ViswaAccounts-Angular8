import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Breadcrumb } from '../breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent implements OnInit {

  @Input('config') steps: Breadcrumb[];
  @Input('activeItemIdx') activeIdx = 1;

  constructor() { }

  ngOnInit() {
  }

}
