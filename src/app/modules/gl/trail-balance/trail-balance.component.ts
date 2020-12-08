import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AlertService } from '../../';
import { GlService } from '../gl.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { AuthService, ExportService } from 'app/services';

@Component({
  selector: 'app-trail-balance',
  templateUrl: './trail-balance.component.html',
  styleUrls: ['./trail-balance.component.scss']
})
export class TrailBalanceComponent implements OnInit, AfterViewInit {

  // @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  public exportColumns: string[] = [
    'code',
    'firmName',
    'town',
    'Credit',
    'Debit'
  ];

  public columnsToDisplay: string[] = [
    'code',
    'firmName',
    'town',
    'Credit',
    'Debit'
  ];

  public trailBalanceListDS: MatTableDataSource<any>;

  public totalCredit = 0;
  public totalDebit = 0;

  constructor(private glSrvc: GlService, private alrtSrvc: AlertService, private exportSrvc: ExportService, private authSrvc: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.trailBalanceListDS = new MatTableDataSource<any>();
    this.refresh();
  }

  ngAfterViewInit() {
    // this.trailBalanceListDS.paginator = this.paginator;
    this.trailBalanceListDS.sort = this.sort;
  }

  trackList(index, data) {
    return data.code;
  }

  applyFilter(value: string) {
    this.trailBalanceListDS.filter = value;
  }

  exportData() {
    const filename = this.authSrvc.user.username + '_opening_trail_bal_' + Date.now();

    const headings = {
      code: 'Code',
      firmName: 'Firm Name',
      town: 'Town',
      credit: 'Credit',
      debit: 'Debit'
    };

    const footer = {
      code: '',
      firmName: '',
      town: '',
      credit: this.totalCredit,
      debit: this.totalDebit
    };

    const data = [].concat(headings).concat(this.trailBalanceListDS.filteredData).concat(footer);
    this.exportSrvc.exportAsExcelFile(data, filename, {
      filterKeys: this.exportColumns,
      skipHeader: true
    });
  }

  refresh() {

    this.glSrvc.getTrailBalanceList().subscribe(
      (resp: []) => {
        this.trailBalanceListDS.data = this.formatData(resp);
      },
      (error) => {
        this.alrtSrvc.showErrorAlert(error);
      }
    );
  }

  formatData(records: any[]) {
    records.forEach( (value, idx) => {

      this.totalCredit = +this.totalCredit.toFixed(2) + value.credit;
      this.totalDebit = +this.totalDebit.toFixed(2) + value.debit;
    });
    return records;
  }
}
