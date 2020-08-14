import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DateValidator, FromToDateValidation } from 'app/utils/date-validate';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { CashRCreditType, CashRCreditTypeMapping, InventorTypeMapping, Inventory, InventoryType, Permissions, Shop } from '../../data-model';
import { AlertService } from '../../modules/alert';
import { AuthService } from '../../services/auth.service';
import { DialogService } from '../../services/dialog.service';
import { ExportService } from '../../services/export.service';
import { InventoryService } from '../../services/inventory.service';
import { ShopService } from '../../services/shop.service';
import { CustomErrorStateMatcher } from '../../utils/CustomErrorStateMatcher';
import { getDefaultDate } from '../../utils/number-only.directive';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
})
export class InventoryListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public inventoryType = InventoryType;
  public cashRCreditType = CashRCreditType;

  public inventorySrchForm: FormGroup;
  private shopsList: Shop[] = [];
  public inventoryListDS: MatTableDataSource<Inventory>;
  public inProgress: Boolean;
  public filteredOption: Observable<Shop[]>;

  public defaultDate = getDefaultDate();

  public exportColumns: string[] = [
    'invntryName',
    'SL',
    'date',
    'fromCode',
    'toCode',
    'CashRCreditName',
    'invcNo',
    'invcDate',
    'totalAmt',
    'totalPerAmt',
    'roundingAmt',
    'totalInvcAmt'
  ];

  public columnsToDisplay: string[] = [
    'invntryName',
    'SL',
    'date',
    'fromCode',
    'toCode',
    'CashRCreditName',
    'invcNo',
    'invcDate',
    'totalAmt',
    'totalPerAmt',
    'roundingAmt',
    'totalInvcAmt'
  ];

  public userPersmissions: Permissions = null;
  public dateErrorStateMatcher: ErrorStateMatcher;

  constructor(
    public fb: FormBuilder,
    private invtrySrvc: InventoryService,
    private shpSrvc: ShopService,
    private authSrvc: AuthService,
    private alrtSrvc: AlertService,
    private dlgSrvc: DialogService,
    private exportSrvc: ExportService
  ) {}

  ngOnInit() {

    this.dateErrorStateMatcher = new CustomErrorStateMatcher('errorFromToDate');

    this.shpSrvc.getDropdownList().subscribe(
      (resp) => {
        this.shopsList = resp;
      },
      (error) => {
        console.log(error);
      }
    );

    this.userPersmissions = this.authSrvc.userPersmissions;

    if (
      this.userPersmissions.editInventory ||
      this.userPersmissions.deleteInventory
    ) {
      this.columnsToDisplay.push('oprts');
    }

    this.inventorySrchForm = this.fb.group({
      invntryType: [InventoryType.Sale, [Validators.required]],
      fromDate: [
        this.defaultDate,
        [
          Validators.required,
          Validators.maxLength(14),
          DateValidator(this.authSrvc.finYearStart, this.authSrvc.finYearEnd),
        ],
      ],
      toDate: [
        this.defaultDate,
        [
          Validators.required,
          Validators.maxLength(14),
          DateValidator(this.authSrvc.finYearStart, this.authSrvc.finYearEnd),
        ],
      ],
      code: [''],
    },
    {
      validators: [FromToDateValidation('fromDate', 'toDate')]
    });

    this.filteredOption = this.code.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith(''),
      map((value) => (value ? this._filter(value) : this.shopsList.slice()))
    );

    this.inventoryListDS = new MatTableDataSource<Inventory>();
  }

  ngAfterViewInit() {
    this.inventoryListDS.paginator = this.paginator;
    this.inventoryListDS.sort = this.sort;
  }

  applyFilter(value: string) {
    this.inventoryListDS.filter = value;
  }

  trackList(index, data) {
    return data._id;
  }

  get invntryType() {
    return this.inventorySrchForm.get('invntryType') as FormControl;
  }

  get fromDate() {
    return this.inventorySrchForm.get('fromDate') as FormControl;
  }

  get toDate() {
    return this.inventorySrchForm.get('toDate') as FormControl;
  }

  get code() {
    return this.inventorySrchForm.get('code') as FormControl;
  }

  private _filter(value: string): Shop[] {
    const filterValue = value.toLowerCase();

    return this.shopsList.filter(
      (shop) =>
        shop.firmName.toLowerCase().includes(filterValue) ||
        shop.code.toLowerCase().includes(filterValue)
    );
  }

  validateNSetCode(
    code: string,
    control: AbstractControl,
    firmNameFld: HTMLInputElement
  ) {
    firmNameFld.value = '';

    const shop = this.shopsList.find(
      (x) => x.code.toLowerCase() === code.toLowerCase()
    );
    if (shop) {
      firmNameFld.value = shop.firmName;
    } else if (code != '') {
      control.setErrors({ InvalidCode: true });
    }
  }

  search() {
    this.inProgress = true;

    this.invtrySrvc
      .getSearchList(this.invntryType.value, this.fromDate.value, this.toDate.value, this.code.value)
      .subscribe(
        (resp) => {
          this.inProgress = false;
          this.inventoryListDS.data = this.formatData(resp);
        },
        (error) => {
          this.inProgress = false;
          this.alrtSrvc.showErrorAlert(error);
        }
      );
  }

  formatData(records: Inventory[]) {
    if (records.length > 0) {
      records.forEach(element => {
        element.invntryName = InventorTypeMapping(element.invntryType);
        element.CashRCreditName = CashRCreditTypeMapping(element.cashRcredit);
      });
    }

    return records;
  }

  edit(inventory: Inventory) {
    this.dlgSrvc.openInventoryDialog(inventory._id);

    // dialogRef.afterClosed().subscribe((resp) => {
    //   if (resp === 'saved') {
    //     this.refresh();
    //   }
    // });
  }

  delete(inventory: Inventory) {
    this.alrtSrvc
      .showConfirmAlert(`Do you want to delete ${inventory.SL}`)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.invtrySrvc.delete(inventory._id).subscribe(
            (resp) => {
              this.search();
            },
            (error) => {
              this.alrtSrvc.showErrorAlert(error);
            }
          );
        }
      });
  }

  exportData() {
    const filename = this.authSrvc.user.username + '_inventory_' + Date.now();

    const headings = {
      invntryName: 'Type',
      SL: 'SL',
      date: 'Date',
      fromCode: 'From Code',
      toCode: 'To Code',
      CashRCreditName: 'Cash/Credit',
      invcNo: 'Invoice Number',
      invcDate: 'Invoice Date',
      totalAmt: 'Taxable Amount',
      totalPerAmt: 'GST Amount',
      roundingAmt: 'Rounding Amount',
      totalInvcAmt: 'Invoice Amount'
    };

    const data = [].concat(headings).concat(this.inventoryListDS.filteredData);
    this.exportSrvc.exportAsExcelFile(data, filename, {
      filterKeys: this.exportColumns,
      skipHeader: true
    });
  }
}
