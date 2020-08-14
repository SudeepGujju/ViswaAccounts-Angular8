import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { forkJoin, of } from 'rxjs';
import { FileUploadService } from '../../services';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  @ViewChild('file', {static: false}) file;

  public files: Set<File> = new Set();

  /*
   0 - none
   1 - Inprogress
   2 - success
   3 - error
  */
  public uploadStatus: number;
  public primaryButtonText: string;
  public progress;

  constructor(private fileSrvc: FileUploadService, private dialogRef: MatDialogRef<FileUploadComponent>) { }

  ngOnInit() {
    this.primaryButtonText = 'Upload';
    this.uploadStatus = 0;
  }

  onFileSelect() {
    const files: { [key: string]: File } = this.file.nativeElement.files;

    for (const key in files) {
      if (!isNaN(parseInt(key, 10))) {
        this.files.add(files[key]);
      }
    }
  }

  addFiles() {
    this.file.nativeElement.click();
  }

  uploadFiles() {

    if (this.uploadStatus === 1) {
      return false;
    }

    this.uploadStatus = 1;
    this.primaryButtonText = 'Uploading...';

    this.progress = this.fileSrvc.upload(this.files);

    const allProgressObservables = [];

    for (const key in this.progress) {

      // this.progress[key].progress.pipe(
      //   catchError( (error) =>{
      //     console.log(error);
      //     return of();
      //   })
      // );//.subscribe((val) => console.log(val) );

      allProgressObservables.push(this.progress[key].progress);
    }

    forkJoin(allProgressObservables).subscribe(end => {

      this.uploadStatus = 2;
      this.primaryButtonText = 'Uploaded';

    }, (error) => {
      // alert('error -> ' + error);
      this.uploadStatus = 3;
      this.primaryButtonText = 'Upload';
    });
  }
}
