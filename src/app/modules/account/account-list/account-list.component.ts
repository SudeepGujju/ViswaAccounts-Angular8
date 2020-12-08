import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Permissions, Account } from '../../../data-model';
import { AlertService } from '../../alert';
import { AuthService } from '../../../services/auth.service';
import { AccountService } from '../../../services/account.service';
import { ExportService } from '../../../services/export.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shop-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
})
export class AccountListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<Account>;

  public shopsListDS: MatTableDataSource<Account>;
  private exportColumns: string[] = [
    'code',
    'firmName',
    'town',
    'proprietor',
    'phone',
    'gst',
    'opngBalAmt',
    'groupCode'
  ];

  public columnsToDisplay: string[] = [
    'code',
    'firmName',
    'town',
    'proprietor',
    'phone',
    'gst',
    'opngBalAmt',
    'groupCode'
  ]; // ,'dno', 'strtNo', 'area', 'town', 'gst', 'dl1', 'dl2', 'phone', 'mailid'

  public userPersmissions: Permissions = null;

  private accountListUpdateSubscription: Subscription;

  constructor(
    private accountSrvc: AccountService,
    private authSrvc: AuthService,
    private alrtSrvc: AlertService,
    private exportSrvc: ExportService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userPersmissions = this.authSrvc.userPersmissions;

    if (
      this.userPersmissions.editAccount ||
      this.userPersmissions.deleteAccount
    ) {
      this.columnsToDisplay.push('oprts');
    }

    this.shopsListDS = new MatTableDataSource<Account>();
    this.refresh();

    this.accountListUpdateSubscription = this.accountSrvc.listUpdate$.subscribe( () => {
      this.refresh();
    });
  }

  ngAfterViewInit() {
    this.shopsListDS.paginator = this.paginator;
    this.shopsListDS.sort = this.sort;
  }

  ngOnDestroy(){
    this.accountListUpdateSubscription.unsubscribe();
  }

  applyFilter(value: string) {
    this.shopsListDS.filter = value;
  }

  trackList(index, data) {
    return data._id;
  }

  refresh() {
    this.accountSrvc.getList().subscribe(
      (resp) => {
        this.shopsListDS.data = this.formatData(resp);
      },
      (error) => {
        this.alrtSrvc.showErrorAlert(error);
      }
    );
  }

  formatData(records: Account[]) {
    // if (records.length > 0) {
    //   records.forEach(element => {
    //     element.opngBalAmt = parseFloat(element.opngBalAmt).toFixed(2);
    //   });
    // }

    return records;
  }

  edit(account: Account) {
    this.router.navigate( [{outlets: { dialog: ['dialog', 'account', 'edit', account._id]}}], {relativeTo: this.route.root, skipLocationChange: true} );
  }

  delete(account: Account) {
    this.alrtSrvc
      .showConfirmAlert(`Do you want to delete ${account.code}`)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.accountSrvc.delete(account._id).subscribe(
            (resp) => {
              this.refresh();
            },
            (error) => {
              this.alrtSrvc.showErrorAlert(error);
            }
          );
        }
      });
  }

  getTblData() {
    const pageCount = this.paginator.getNumberOfPages();
    const initPage = this.paginator.pageIndex;

    let arr = [];

    arr = arr.concat(this.table._getRenderedRows(this.table._headerRowOutlet));

    this.paginator.pageIndex = 0;
    this.shopsListDS.paginator._changePageSize(this.paginator.pageSize);

    // console.log(pageCount);
    for (let i = 0; i < pageCount; i++) {
      arr = arr.concat(this.table._getRenderedRows(this.table._rowOutlet));

      if (this.paginator.hasNextPage()) {
        this.paginator.nextPage();
      }
    }

    this.paginator.pageIndex = initPage;
    this.shopsListDS.paginator._changePageSize(this.paginator.pageSize);

    return arr;
  }

  exportData() {
    const filename = this.authSrvc.user.username + '_accounts_' + Date.now();

    const headings = {
      code: 'Code',
      firmName: 'Firm Name',
      town: 'Town',
      proprietor: 'Proprietor',
      phone: 'Phone',
      gst: 'GST',
      opngBalAmt: 'Opening Balance',
      groupCode: 'Group Code'
    };

    const data = [].concat(headings).concat(this.shopsListDS.filteredData);
    this.exportSrvc.exportAsExcelFile(data, filename, {
      filterKeys: this.exportColumns,
      skipHeader: true
    });
  }
}
