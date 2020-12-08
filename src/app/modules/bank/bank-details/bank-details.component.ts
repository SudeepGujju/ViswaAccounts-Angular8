import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AccountCodeValidation } from 'app/utils/AccountCode-validate';
import { CustomErrorStateMatcher } from '../../../utils/CustomErrorStateMatcher';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Bank, Permissions, Account } from '../../../data-model';
import { AlertService } from '../../alert';
import { AuthService } from '../../../services/auth.service';
import { BankService } from '../../../services/bank.service';
import { AccountService } from '../../../services/account.service';
import { DateValidator } from '../../../utils/date-validate';
import { getDefaultDate } from '../../../utils/number-only.directive';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss'],
})
export class BankDetailsComponent implements OnInit {

  @ViewChild('date', {static: false})dateElement: ElementRef<HTMLInputElement>;

  @ViewChild('toCodeElement', {static: false})toCodeElement: ElementRef<HTMLInputElement>;
  @ViewChild('tofirmName', { static: false }) tofirmName: ElementRef<HTMLInputElement>;

  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator) {
    if (paginator) {
      this.bankListDS.paginator = paginator;
    }
  }

  @ViewChild(MatSort, { static: false }) set matSort(sort) {
    if (sort) {
      this.bankListDS.sort = sort;
    }
  }

  @ViewChild('dtlsForm', { static: false }) set bankDtlsFormElement(element) {
    if (element) {
      this.bankDtlsFormEle = element;
    }
  }

  public userPersmissions: Permissions = null;

  private bankDtlsFormEle;
  public bankForm: FormGroup;
  public bankDtlsForm: FormGroup;
  public pageMode = 'Create';
  public filteredOptions: Observable<Account[]>[] = [];
  public inProgress = false;

  public showList = false;
  public defaultAmount = '0.00';
  public defaultDate = getDefaultDate();
  private shopsList: Account[] = [];
  public bankListDS: MatTableDataSource<Bank>;
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
  public dataList = [];
  private defaultFldValues: any = {};
  public accCodeErrorStateMatcher: ErrorStateMatcher;

  constructor(
    public fb: FormBuilder,
    private authSrvc: AuthService,
    private accountSrvc: AccountService,
    private bankSrvc: BankService,
    private alrtSrvc: AlertService
  ) {}

  ngOnInit() {

    this.accCodeErrorStateMatcher = new CustomErrorStateMatcher('errorSameAccountCode');

    this.userPersmissions = this.authSrvc.userPersmissions;

    this.accountSrvc.getDropdownList().subscribe(
      (resp) => {
        this.shopsList = resp;
      },
      (error) => {
        console.log(error);
      }
    );

    if (
      this.userPersmissions.editBank ||
      this.userPersmissions.deleteBank
    ) {
      this.columnsToDisplay.push('oprts');
    }

    this.bankForm = this.fb.group({
      bankCode: [''],
      bankDate: [
        this.defaultDate,
        [
          Validators.required,
          Validators.maxLength(14),
          DateValidator(this.authSrvc.finYearStart, this.authSrvc.finYearEnd),
        ],
      ],
    });

    this.bankDtlsForm = this.fb.group({
      _id: [''],
      fromCode: ['', [Validators.required, Validators.maxLength(10)]],
      toCode: ['', [Validators.required, Validators.maxLength(10)]],
      SL: ['', [Validators.required, Validators.maxLength(50)]],
      date: [
        '',
        [
          Validators.required,
          Validators.maxLength(14),
          DateValidator(this.authSrvc.finYearStart, this.authSrvc.finYearEnd),
        ],
      ],
      chNo: ['', [Validators.maxLength(10)]],
      desc: ['', [Validators.required, Validators.maxLength(50)]],
      receipt: ['', Validators.maxLength(15)],
      payment: ['', Validators.maxLength(15)],
    }, {
        validators: [AccountCodeValidation('fromCode', 'toCode')]
    });

    this.filteredOptions[0] = this.bankCode.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith(''),
      map((value) => (value ? this._filter(value) : this.shopsList.slice()))
    );

    this.filteredOptions[1] = this.toCode.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith(''),
      map((value) => (value ? this._filter(value) : this.shopsList.slice()))
    );
  }

  get bankCode() {
    return this.bankForm.get('bankCode') as FormControl;
  }
  get bankDate() {
    return this.bankForm.get('bankDate') as FormControl;
  }
  get fromCode() {
    return this.bankDtlsForm.get('fromCode') as FormControl;
  }
  get toCode() {
    return this.bankDtlsForm.get('toCode') as FormControl;
  }
  get SL() {
    return this.bankDtlsForm.get('SL') as FormControl;
  }
  get date() {
    return this.bankDtlsForm.get('date') as FormControl;
  }
  get chNo() {
    return this.bankDtlsForm.get('chNo') as FormControl;
  }
  get desc() {
    return this.bankDtlsForm.get('desc') as FormControl;
  }
  get receipt() {
    return this.bankDtlsForm.get('receipt') as FormControl;
  }
  get payment() {
    return this.bankDtlsForm.get('payment') as FormControl;
  }

  resetValue(control: AbstractControl) {
    control.setValue(this.defaultAmount);
  }

  validateNSetCode(
    code: string,
    control: AbstractControl,
    firmNameFld: HTMLInputElement
  ) {

    firmNameFld.value = '';

    code = code.trim().toLowerCase();

    if (code.length > 0) {
      if (firmNameFld.id == 'tofirmName' && code == '1000') {
        control.setErrors({ CodeNotAllowed: true });
        return false;
      }

      const shop = this.shopsList.find(
        (x) => x.code.toLowerCase() === code.toLowerCase()
      );

      if (shop) {
        firmNameFld.value = shop.firmName;
        return true;
      }
    }

    control.setErrors({ InvalidCode: true });
  }

  private _filter(value: string): Account[] {
    const filterValue = value.toLowerCase();

    return this.shopsList.filter(
      (shop) =>
        shop.firmName.toLowerCase().includes(filterValue) ||
        shop.code.toLowerCase().includes(filterValue)
    );
  }

  search() {
    this.inProgress = true;

    this.bankSrvc.getList(this.bankCode.value, this.bankDate.value).subscribe(
      (resp) => {
        this.inProgress = false;
        this.dataList = resp;
        this.displayList();
      },
      (error) => {
        this.inProgress = false;
        this.alrtSrvc.showErrorAlert(error);
      }
    );
  }

  displayList() {
    this.bankForm.disable();
    this.bankListDS = new MatTableDataSource(this.dataList);
    this.showList = true;
    this.resetForm();
  }

  hideList() {
    this.showList = false;
    this.bankForm.enable();
    this.dateElement.nativeElement.focus();
  }

  trackList(index, data) {
    return data._id;
  }

  save() {
    if (!this.bankDtlsForm.valid) {
      return false;
    }

    this.inProgress = true;

    const bank: Bank = Object.assign({}, this.bankDtlsForm.value);

    const recordID = bank._id;

    delete bank._id;

    if (this.pageMode === 'Create') {
      this.bankSrvc.save(bank).subscribe(
        (resp) => {
          this.inProgress = false;

          this.alrtSrvc
            .showSuccessAlert(resp)
            .afterClosed()
            .subscribe(() => {
              this.search();
              this.resetForm();
            });
        },
        (error) => {
          this.inProgress = false;

          if (error.includes('already exists')) {
            this.SL.setErrors({ alreadyExists: true });
          } else {
            this.alrtSrvc.showErrorAlert(error);
          }
        }
      );
    } else {
      this.bankSrvc.update(recordID, bank).subscribe(
        (resp) => {
          this.inProgress = false;
          this.alrtSrvc
            .showSuccessAlert(resp)
            .afterClosed()
            .subscribe(() => {
              this.search();
              this.resetForm();
            });
        },
        (error) => {
          this.inProgress = false;
          this.alrtSrvc.showErrorAlert(error);
        }
      );
    }
  }

  resetForm() {
    this.pageMode = 'Create';

    this.defaultFldValues = {
      _id: '',
      fromCode: this.bankCode.value,
      toCode: '',
      SL: this.dataList.length + 1,
      date: this.bankDate.value,
      desc: '',
      chNo: '',
      payment: this.defaultAmount,
      receipt: this.defaultAmount,
    };

    if (this.bankDtlsFormEle) {
      this.bankDtlsFormEle.nativeElement.reset();
    }

    this.bankSrvc
      .getNextId(this.bankCode.value, this.bankDate.value)
      .subscribe((nextRecNum) => {
        this.defaultFldValues.SL = nextRecNum;
        this.bankDtlsForm.patchValue(this.defaultFldValues);
        this.toCodeElement.nativeElement.focus();
      });
  }

  edit(bank: Bank) {
    this.bankSrvc.get(bank._id).subscribe(
      (resp) => {
        this.pageMode = 'Edit';
        this.bankDtlsForm.patchValue(resp);
        this.validateNSetCode(
          this.toCode.value,
          this.toCode,
          this.tofirmName.nativeElement
        );
      },
      (error) => {
        this.alrtSrvc.showErrorAlert(error);
      }
    );
  }

  delete(bank: Bank) {
    this.alrtSrvc
      .showConfirmAlert(`Do you want to delete ${bank.SL}`)
      .afterClosed()
      .subscribe((confirm) => {

        if (confirm) {
          this.bankSrvc.delete(bank._id).subscribe(
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
}
