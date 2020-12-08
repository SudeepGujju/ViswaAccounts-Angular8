import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AccountService, ExportService, AuthService } from 'app/services';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Account } from 'app/data-model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AlertService } from 'app/modules';

@Component({
  selector: 'account-open-bal-list',
  templateUrl: './account-open-bal-list.component.html',
  styleUrls: ['./account-open-bal-list.component.scss']
})
export class AccountOpenBalListComponent implements OnInit, AfterViewInit {

  // @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<Account>;

  private exportColumns: string[] = [
    'code',
    'firmName',
    'town',
    'credit',
    'debit'
  ];

  public columnsToDisplay: string[] = [
    'code',
    'firmName',
    'town',
    'credit',
    'debit'
  ];

  public totalCredit = 0;
  public totalDebit = 0;

  public accountOpenBalListDS: MatTableDataSource<Account>;

  constructor(private accountSrvc: AccountService, private alrtSrvc: AlertService, private exportSrvc: ExportService, private authSrvc: AuthService) { }

  ngOnInit() {
    this.accountOpenBalListDS = new MatTableDataSource<Account>();
    this.refresh();
  }

  ngAfterViewInit() {
    // this.accountOpenBalListDS.paginator = this.paginator;
    this.accountOpenBalListDS.sort = this.sort;
  }

  trackList(index, data) {
    return data.code;
  }

  applyFilter(value: string) {
    this.accountOpenBalListDS.filter = value;
  }

  exportData() {
    const filename = this.authSrvc.user.username + '_opening_bal_' + Date.now();

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

    const data = [].concat(headings).concat(this.accountOpenBalListDS.filteredData).concat(footer);
    this.exportSrvc.exportAsExcelFile(data, filename, {
      filterKeys: this.exportColumns,
      skipHeader: true
    });
  }

  refresh() {
    this.accountSrvc.getOpenTrailBalList().subscribe(
      (resp) => {
        this.accountOpenBalListDS.data = this.formatData(resp);
      },
      (error) => {
        this.alrtSrvc.showErrorAlert(error);
      }
    );
  }

  formatData(records: Account[]) {

    records.forEach( (value, idx) => {
      value.credit = value.credit * -1;

      this.totalCredit = +this.totalCredit.toFixed(2) + value.credit;
      this.totalDebit = +this.totalDebit.toFixed(2) + value.debit;
    });
    return records;
  }
}
