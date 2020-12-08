import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GeneralVoucher, Permissions } from '../../../data-model';
import { AlertService } from '../../alert';
import { AuthService } from '../../../services/auth.service';
import { GeneralVouchersService } from '../../../services/general-voucher.service';
import { ExportService } from '../../../services/export.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gen-voucher-list',
  templateUrl: './gen-voucher-list.component.html',
  styleUrls: ['./gen-voucher-list.component.scss'],
})
export class GenVoucherListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public genVoucherListDS: MatTableDataSource<GeneralVoucher>;
  public exportColumns: string[] = ['No', 'date', 'totDbAmt', 'totCrAmt'];
  public columnsToDisplay: string[] = ['No', 'date', 'totDbAmt', 'totCrAmt'];

  public userPersmissions: Permissions = null;
  private generalVoucherListUpdateSubscription: Subscription;

  constructor(
    private genVouchSrvc: GeneralVouchersService,
    private authSrvc: AuthService,
    private alrtSrvc: AlertService,
    private exportSrvc: ExportService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userPersmissions = this.authSrvc.userPersmissions;

    if (
      this.userPersmissions.editGenVoucher ||
      this.userPersmissions.deleteGenVoucher
    ) {
      this.columnsToDisplay.push('oprts');
    }

    this.genVoucherListDS = new MatTableDataSource<GeneralVoucher>();
    this.refresh();

    this.generalVoucherListUpdateSubscription = this.genVouchSrvc.listUpdate$.subscribe( () => {
      this.refresh();
    });
  }

  ngAfterViewInit() {
    this.genVoucherListDS.paginator = this.paginator;
    this.genVoucherListDS.sort = this.sort;
  }

  ngOnDestroy(){
    this.generalVoucherListUpdateSubscription.unsubscribe();
  }

  applyFilter(value: string) {
    this.genVoucherListDS.filter = value;
  }

  trackList(index, data) {
    return data._id;
  }

  refresh() {
    this.genVouchSrvc.getList().subscribe(
      (resp) => {
        this.genVoucherListDS.data = this.formatData(resp);
      },
      (error) => {
        this.alrtSrvc.showErrorAlert(error);
      }
    );
  }

  formatData(records: GeneralVoucher[]) {
    // if (records.length > 0) {
    //   records.forEach(element => {
    //     element.opngBalAmt = parseFloat(element.opngBalAmt).toFixed(2);
    //   });
    // }

    return records;
  }

  edit(genVoucher: GeneralVoucher) {
    this.router.navigate( [{outlets: { dialog: ['dialog', 'general-voucher', 'edit', genVoucher._id]}}], {relativeTo: this.route.root, skipLocationChange: true} );
  }

  delete(genVoucher: GeneralVoucher) {
    this.alrtSrvc
      .showConfirmAlert(`Do you want to delete ${genVoucher.No}`)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.genVouchSrvc.delete(genVoucher._id).subscribe(
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

  exportData() {
    const filename = this.authSrvc.user.username + '_gen-voucher_' + Date.now();

    const headings = {
      No: 'No',
      date: 'Date',
      totDbAmt: 'Debit Amount',
      totCrAmt: 'Credit Amount',
    };

    const data = [].concat(headings).concat(this.genVoucherListDS.filteredData);
    this.exportSrvc.exportAsExcelFile(data, filename, {
      filterKeys: this.exportColumns,
      skipHeader: true,
    });
  }
}
