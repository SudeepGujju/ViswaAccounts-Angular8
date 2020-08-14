import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Permissions, Voucher } from '../../data-model';
import { AuthService } from '../../services';
import { VoucherService } from '../../services';

@Component({
  selector: 'app-vouchers-list',
  templateUrl: './vouchers-list.component.html',
  styleUrls: ['./vouchers-list.component.scss']
})
export class VouchersListComponent implements OnInit, AfterViewInit {

  public voucherListDS: MatTableDataSource<Voucher>;
  public columnsToDisplay: string[] = ['SL', 'date', 'fromCode', 'toCode', 'billChNo', 'desc', 'receipt', 'payment', 'oprts'];

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  public userPersmissions: Permissions = null;

  constructor(private vochSrvc: VoucherService, private authSrvc: AuthService) { }

  ngOnInit() {

    this.userPersmissions = this.authSrvc.userPersmissions;

    if (this.userPersmissions.editVoucher || this.userPersmissions.deleteVoucher) {
      this.columnsToDisplay.push('oprts');
    }

    this.voucherListDS = new MatTableDataSource<Voucher>(this.vochSrvc.getList());

  }

  ngAfterViewInit() {
    this.voucherListDS.paginator = this.paginator;
    this.voucherListDS.sort = this.sort;
  }

  applyFilter(value: string) {
    this.voucherListDS.filter = value;
  }

  trackList(index, data) {
    return data.SL;
  }

  refresh() {
    this.voucherListDS.data = this.vochSrvc.getList();
  }

  edit(voucher: Voucher) {
    const dialogRef = this.vochSrvc.openVoucherDtlsPage(voucher.SL);

    dialogRef.afterClosed().subscribe((resp) => {
      if (resp === 'saved') {
        this.refresh();
      }
    });
  }

  delete(voucher: Voucher) {
    this.vochSrvc.deleteVoucher(voucher.SL);
    this.refresh();
  }
}
