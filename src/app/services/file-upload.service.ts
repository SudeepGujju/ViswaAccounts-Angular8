import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { fileUploadUrl } from '../urlConfig';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  // fileUploadUrl = 'http://localhost:8000/api/file/upload';

  constructor(private http: HttpClient) { }

  public upload(files: Set<File>): { [key: string]: { progress: Observable<number> } } {

    const status: { [key: string]: { progress: Observable<number> } } = {};

    files.forEach( (file) => {

      const formData = new FormData();
      formData.append('record', file, file.name);

      const req = new HttpRequest('POST', fileUploadUrl, formData, {
        reportProgress: true,
        responseType: 'text',
        headers: new HttpHeaders({[environment.hideLoader]: 'true'})
      });

      const progress = new Subject<number>();

      this.http.request(req).subscribe(event => {

        if (event.type === HttpEventType.UploadProgress) {

          const percentDone = Math.round( (100 * event.loaded) / event.total );

          progress.next(percentDone);

        } else if (event instanceof HttpResponse ) {

          progress.complete();

        }

      }, (error: HttpErrorResponse) => {

        progress.error(error);

      });

      status[file.name] = { progress: progress.asObservable() };
    });

    return status;
  }
}
