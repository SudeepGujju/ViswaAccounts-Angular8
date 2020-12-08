import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class ServiceWorkerLoggerService {

  constructor(swUpdate: SwUpdate) {

    swUpdate.available.subscribe( (event) => {

      alert('New update of app is available.');

      swUpdate.activateUpdate()
                .then( () => { alert('App updated. Now page will reload.'); document.location.reload(); })
                .catch( () => {
                  console.warn('Error while updating service worker');
                });
    });

    swUpdate.activated.subscribe( (event) => {
      console.log('Service Worker update activated -> ' + event.type);
    });
  }
}
