import { Component, OnInit } from '@angular/core';
import { GlService } from '../gl.service';

@Component({
  selector: 'app-prepare',
  templateUrl: './prepare.component.html',
  styleUrls: ['./prepare.component.scss'],
})
export class PrepareComponent implements OnInit {

  public glPrepareStatus = 0;

  constructor(private glSrvc: GlService) {}

  ngOnInit() {
    this.glSrvc.prepare().subscribe(
      (resp) => {
        this.glPrepareStatus = 1;
      },
      (error) => {
        console.log(error);
        this.glPrepareStatus = 2;
      }
    );
  }
}
