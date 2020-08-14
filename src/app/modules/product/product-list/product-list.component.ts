import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'app/modules';
import { Product } from '../../shared/models/product';
import { AuthService } from '../../../services/auth.service';
import { ExportService } from '../../../services/export.service';
import { FacedService } from 'app/modules/shared/services/faced.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public productForm: FormGroup;
  public productListDS: MatTableDataSource<Product>;
  public inProgress: Boolean;

  public exportColumns: string[] = [
    'name',
    'packing',
    'company',
    'qty',
    'mrp',
    'username',
    'phone',
  ];
  public columnsToDisplay: string[] = [
    'name',
    'packing',
    'company',
    'qty',
    'mrp',
    'username',
    'phone',
  ];

  constructor(
    public fb: FormBuilder,
    private facedSrvc: FacedService,
    private authSrvc: AuthService,
    private alrtSrvc: AlertService,
    private exportSrvc: ExportService
  ) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      myProdsOnly: [],
    });

    this.productListDS = new MatTableDataSource<Product>();
  }

  ngAfterViewInit() {
    this.productListDS.paginator = this.paginator;
    this.productListDS.sort = this.sort;
  }

  trackList(index, data) {
    return data.name;
  }

  get name() {
    return this.productForm.get('name') as FormControl;
  }

  get myProdsOnly() {
    return this.productForm.get('myProdsOnly') as FormControl;
  }

  search() {
    this.inProgress = true;

    this.facedSrvc
      .getProductsList(this.name.value, this.myProdsOnly.value ? '1' : '0')
      .subscribe(
        (resp) => {
          this.inProgress = false;
          this.productListDS.data = this.formatData(resp);
        },
        (error) => {
          this.inProgress = false;
          this.alrtSrvc.showErrorAlert(error);
        }
      );
  }

  formatData(records: Product[]) {
    // if (records.length > 0) {
    //   records.forEach(element => {
    //     element.opngBalAmt = parseFloat(element.opngBalAmt).toFixed(2);
    //   });
    // }

    return records;
  }

  exportData() {
    const filename = this.authSrvc.user.username + '_products_' + Date.now();

    const headings = {
      name: 'Name',
      packing: 'Packing',
      company: 'Company',
      qty: 'Quantity',
      mrp: 'MRP',
      username: 'Username',
      phone: 'Phone',
    };

    const data = [].concat(headings).concat(this.productListDS.filteredData);
    this.exportSrvc.exportAsExcelFile(data, filename, {
      filterKeys: this.exportColumns,
      skipHeader: true,
    });
  }
}
