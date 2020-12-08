import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'app/modules';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Bank, Account } from '../../../data-model';
import { AuthService } from '../../../services/auth.service';
import { BankService } from '../../../services/bank.service';
import { ExportService } from '../../../services/export.service';
import { AccountService } from '../../../services/account.service';
import { DateValidator, FromToDateValidation } from '../../../utils/date-validate';
import { getDefaultDate } from '../../../utils/number-only.directive';
import { CustomErrorStateMatcher } from '../../../utils/CustomErrorStateMatcher';

@Component({
  selector: 'app-bank-list',
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.scss'],
})
export class BankListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public bankForm: FormGroup;
  private shopsList: Account[] = [];
  public bankListDS: MatTableDataSource<Bank>;
  public inProgress: boolean;
  public filteredOption: Observable<Account[]>;

  public defaultDate = getDefaultDate();

  private exportColumns: string[] = [
    'SL',
    'date',
    'fromCode',
    'toCode',
    'chNo',
    'desc',
    'payment',
    'receipt'
  ];

  public columnsToDisplay: string[] = [
    'SL',
    'date',
    'fromCode',
    'toCode',
    'chNo',
    'desc',
    'payment',
    'receipt'
  ];

  public dateErrorStateMatcher: ErrorStateMatcher;

  constructor(
    public fb: FormBuilder,
    private bankSrvc: BankService,
    private accountSrvc: AccountService,
    private authSrvc: AuthService,
    private alrtSrvc: AlertService,
    private exportSrvc: ExportService
  ) {}

  ngOnInit() {

    this.accountSrvc.getDropdownList().subscribe(
      (resp) => {
        this.shopsList = resp;
      },
      (error) => {
        console.log(error);
      }
    );

    this.dateErrorStateMatcher = new CustomErrorStateMatcher('errorFromToDate');

    this.bankForm = this.fb.group({
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

    this.bankListDS = new MatTableDataSource<Bank>();
  }

  ngAfterViewInit() {
    this.bankListDS.paginator = this.paginator;
    this.bankListDS.sort = this.sort;
  }

  trackList(index, data) {
    return data._id;
  }

  get fromDate() {
    return this.bankForm.get('fromDate') as FormControl;
  }

  get toDate() {
    return this.bankForm.get('toDate') as FormControl;
  }

  get code() {
    return this.bankForm.get('code') as FormControl;
  }

  private _filter(value: string): Account[] {
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

    this.bankSrvc
      .getSearchList(this.fromDate.value, this.toDate.value, this.code.value)
      .subscribe(
        (resp) => {
          this.inProgress = false;
          this.bankListDS.data = this.formatData(resp);
        },
        (error) => {
          this.inProgress = false;
          this.alrtSrvc.showErrorAlert(error);
        }
      );
  }

  formatData(records: Bank[]) {
    // if (records.length > 0) {
    //   records.forEach(element => {
    //     element.opngBalAmt = parseFloat(element.opngBalAmt).toFixed(2);
    //   });
    // }

    return records;
  }

  exportData() {
    const filename = this.authSrvc.user.username + '_bank_' + Date.now();

    const headings = {
      SL: 'SL',
      date: 'Date',
      fromCode: 'From Code',
      toCode: 'To Code',
      chNo: 'Check No',
      desc: 'Desc',
      payment: 'Payment',
      receipt: 'Receipt'
    };

    const data = [].concat(headings).concat(this.bankListDS.filteredData);
    this.exportSrvc.exportAsExcelFile(data, filename, {
      filterKeys: this.exportColumns,
      skipHeader: true
    });
  }
}
