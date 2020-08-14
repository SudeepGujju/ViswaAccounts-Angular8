import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UploadService {

  constructor(private http: HttpClient) { }

  upload(file: File, url: string ): Observable<any> {

    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(url, formData);
  }
}

