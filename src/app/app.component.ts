import { Component } from '@angular/core';
import { SocketService } from './services/socket.service';
import { ServiceWorkerLoggerService } from './services/service-worker-logger.service';
import { ActivatedRoute, Router, Event, NavigationStart, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ViswaAccounts';

  constructor(public sck: SocketService, public svrc: ServiceWorkerLoggerService) {}
}
