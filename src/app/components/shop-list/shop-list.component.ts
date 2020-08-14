import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { Permissions, Shop } from '../../data-model';
import { AlertService } from '../../modules/alert';
import { AuthService } from '../../services/auth.service';
import { ShopService } from '../../services/shop.service';
import { ExportService } from '../../services/export.service';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss'],
})
export class ShopListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<Shop>;

  public shopsListDS: MatTableDataSource<Shop>;
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

  constructor(
    private shpSrvc: ShopService,
    private authSrvc: AuthService,
    private alrtSrvc: AlertService,
    private exportSrvc: ExportService,
    private dlgSrvc: DialogService
  ) {}

  ngOnInit() {
    this.userPersmissions = this.authSrvc.userPersmissions;

    if (
      this.userPersmissions.editAccount ||
      this.userPersmissions.deleteAccount
    ) {
      this.columnsToDisplay.push('oprts');
    }

    this.shopsListDS = new MatTableDataSource<Shop>();
    this.refresh();
  }

  ngAfterViewInit() {
    this.shopsListDS.paginator = this.paginator;
    this.shopsListDS.sort = this.sort;
  }

  applyFilter(value: string) {
    this.shopsListDS.filter = value;
  }

  trackList(index, data) {
    return data._id;
  }

  refresh() {
    this.shpSrvc.getList().subscribe(
      (resp) => {
        this.shopsListDS.data = this.formatData(resp);
      },
      (error) => {
        this.alrtSrvc.showErrorAlert(error);
      }
    );
  }

  formatData(records: Shop[]) {
    // if (records.length > 0) {
    //   records.forEach(element => {
    //     element.opngBalAmt = parseFloat(element.opngBalAmt).toFixed(2);
    //   });
    // }

    return records;
  }

  edit(account: Shop) {
    this.dlgSrvc.openAccountDialog(account._id);

    // dialogRef.afterClosed().subscribe((resp) => {
    //   if (resp == 'saved') {
    //     this.refresh();
    //   }
    // });
  }

  delete(account: Shop) {
    this.alrtSrvc
      .showConfirmAlert(`Do you want to delete ${account.code}`)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.shpSrvc.delete(account._id).subscribe(
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
