import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { reportFilesUrl, reportFileDataUrl } from '../urlConfig';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  private url = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) { }

  getFilesList() {
    return this.http.get(reportFilesUrl);
  }

  getFileData(filename: string, reportType: string) {
    return this.http.get(reportFileDataUrl + '?filename=' + filename + '&reportType=' + reportType);
  }
}
