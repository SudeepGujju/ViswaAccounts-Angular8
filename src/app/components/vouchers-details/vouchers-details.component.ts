import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { map, startWith, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Shop } from '../../data-model';
import { AuthService, DisplayService, ShopService, VoucherService } from '../../services';
import { DateValidator } from '../../utils/date-validate';
import { getDefaultDate } from '../../utils/number-only.directive';

@Component({
  selector: 'app-vouchers-details',
  templateUrl: './vouchers-details.component.html',
  styleUrls: ['./vouchers-details.component.scss']
})
export class VouchersDetailsComponent implements OnInit, OnDestroy {

  voucherDtlsForm: FormGroup;
  recordID: string;
  pageMode = 'Create';
  filteredFromOptions: Observable<Shop[]>;
  filteredToOptions: Observable<Shop[]>;
  isSmallScrn = false;
  private isSmallScrnSubscription: Subscription;

  public defaultAmount = '0.00';
  public defaultDate = getDefaultDate();
  private shopsList: Shop[] = [];

  @ViewChild('fromCodeFirmName', {static: false}) fromCodeFirmEle: ElementRef;
  @ViewChild('toCodeFirmName', {static: false}) toCodeFirmEle: ElementRef;

  constructor(public fb: FormBuilder, private dispSrvc: DisplayService, private vouchSrvc: VoucherService, private shpSrvc: ShopService, private authSrvc: AuthService, private dialogRef: MatDialogRef<VouchersDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {

    this.isSmallScrnSubscription = this.dispSrvc.isHandSet$.subscribe(
      (ismall) => {this.isSmallScrn = ismall; },
      (error) => {}
    );

    if (this.data && this.data.pageMode && this.data.pageMode.trim().length > 0) {
      this.pageMode = this.data.pageMode.toLowerCase();
    } else {
        this.pageMode = this.pageMode.toLowerCase();
    }

    this.voucherDtlsForm = this.fb.group({
      SL: [this.vouchSrvc.getList().length + 1, [Validators.required, Validators.maxLength(50)]],
      date: [this.defaultDate, [Validators.required, Validators.maxLength(14), DateValidator(this.authSrvc.finYearStart, this.authSrvc.finYearEnd)]],
      fromCode: ['', {validators: [Validators.required, Validators.maxLength(10)]}],
      toCode: ['', [Validators.required, Validators.maxLength(10)]],
      billChNo: ['', Validators.maxLength(10)],
      desc: ['', [Validators.required, Validators.maxLength(50)]],
      receipt: [this.defaultAmount, Validators.maxLength(15)],
      payment: [this.defaultAmount, Validators.maxLength(15)]
    });

    if (this.pageMode !== 'create') {
      this.recordID = this.data.record.SL;
      this.voucherDtlsForm.patchValue(this.data.record);
      setTimeout(() => {
        this.validateNSetFromCode(this.data.record.fromCode);
        this.validateNSetToCode(this.data.record.toCode);
      });
    }

    // this.shopsList = this.shpSrvc.getList();

    this.filteredFromOptions = this.fromCode.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          startWith(''),
          map(value => value ? this._filter(value) : this.shopsList.slice())
        );

    this.filteredToOptions = this.toCode.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          startWith(''),
          map(firmName => firmName ? this._filter(firmName) : this.shopsList.slice())
        );
  }

  ngOnDestroy() {
    this.isSmallScrnSubscription.unsubscribe();
  }

  onSelectFromCode({option}) {
    this.validateNSetFromCode(option.value);
  }

  onSelectToCode({option}) {
    this.validateNSetToCode(option.value);
  }

  validateNSetFromCode(code: string) {

    this.fromCodeFirmEle.nativeElement.value = '';

    const shop = this.shopsList.find(x => x.code.toLowerCase() === code.toLowerCase());
    if (shop) {
      this.fromCodeFirmEle.nativeElement.value = shop.firmName;
    } else {
      this.fromCode.setErrors({InvalidCode: true});
    }

  }

  validateNSetToCode(code: string) {

    this.toCodeFirmEle.nativeElement.value = '';

    const shop = this.shopsList.find(x => x.code.toLowerCase() === code.toLowerCase());
    if (shop) {
      this.toCodeFirmEle.nativeElement.value = shop.firmName;
    } else {
      this.toCode.setErrors({InvalidCode: true});
    }

  }

  get isReceiptReq(): boolean {
    return (this.payment.value === '' || parseInt(this.payment.value, 10) <= 0);
  }

  get isPaymentReq(): boolean {
    return (this.receipt.value === '' || parseInt(this.receipt.value, 10) <= 0 );
  }

  private _filter(value: string): Shop[] {
    const filterValue = value.toLowerCase();

    return this.shopsList.filter(shop => shop.firmName.toLowerCase().includes(filterValue) || shop.code.toLowerCase().includes(filterValue));
  }

  get SL() {
    return this.voucherDtlsForm.get('SL') as FormControl;
  }
  get date() {
    return this.voucherDtlsForm.get('date') as FormControl;
  }
  get fromCode() {
    return this.voucherDtlsForm.get('fromCode') as FormControl;
  }
  get toCode() {
    return this.voucherDtlsForm.get('toCode') as FormControl;
  }
  get billChNo() {
    return this.voucherDtlsForm.get('billChNo') as FormControl;
  }

  get desc() {
    return this.voucherDtlsForm.get('desc') as FormControl;
  }

  get receipt() {
    return this.voucherDtlsForm.get('receipt') as FormControl;
  }
  get payment() {
    return this.voucherDtlsForm.get('payment') as FormControl;
  }

  save() {
    if (!this.voucherDtlsForm.valid) {
      return false;
    }

    if (this.pageMode === 'create') {
      const saveStatus = this.vouchSrvc.saveVoucher(this.voucherDtlsForm.value);

      if (!saveStatus) {
        this.SL.setErrors({alreadyExists: true});
        return false;
      }
    } else {
      this.vouchSrvc.updateVoucher(this.recordID, this.voucherDtlsForm.value);
    }

    this.dialogRef.close('saved');
  }
}
