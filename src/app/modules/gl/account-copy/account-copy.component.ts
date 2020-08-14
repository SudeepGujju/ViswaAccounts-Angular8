import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../../../services/auth.service';
import { CustomErrorStateMatcher } from '../../../utils/CustomErrorStateMatcher';
import { DateValidator, FromToDateValidation } from '../../../utils/date-validate';
import { getDefaultDate } from '../../../utils/number-only.directive';
import { ShopService } from '../../../services/shop.service';
import { Shop } from '../../../data-model';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, map } from 'rxjs/operators';
import { GlService } from '../gl.service';
import { AlertService } from '../../';

@Component({
  selector: 'app-account-copy',
  templateUrl: './account-copy.component.html',
  styleUrls: ['./account-copy.component.scss']
})
export class AccountCopyComponent implements OnInit {

  public accountCopyForm: FormGroup;
  public inProgress: Boolean;
  public dateErrorStateMatcher: ErrorStateMatcher;
  private shopsList: Shop[] = [];
  public filteredOption: Observable<Shop[]>;
  public recordsList = null;
  public defaultDate = getDefaultDate();

  constructor(public fb: FormBuilder, private authSrvc: AuthService, private shpSrvc: ShopService, private glSrvc: GlService, private alrtSrvc: AlertService){}

  ngOnInit() {

    this.shpSrvc.getDropdownList().subscribe(
      (resp) => {
        this.shopsList = resp;
      },
      (error) => {
        console.log(error);
      }
    );

    this.dateErrorStateMatcher = new CustomErrorStateMatcher('errorFromToDate');

    this.accountCopyForm = this.fb.group({
      fromDate: [
        "01/04/2019",
        [
          Validators.required,
          Validators.maxLength(14),
          DateValidator(this.authSrvc.finYearStart, this.authSrvc.finYearEnd),
        ],
      ],
      toDate: [
        "30/03/2020",
        [
          Validators.required,
          Validators.maxLength(14),
          DateValidator(this.authSrvc.finYearStart, this.authSrvc.finYearEnd),
        ],
      ],
      code: ['', [ Validators.required, Validators.maxLength(10)]],
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
  }

  get fromDate() {
    return this.accountCopyForm.get('fromDate') as FormControl;
  }

  get toDate() {
    return this.accountCopyForm.get('toDate') as FormControl;
  }

  get code() {
    return this.accountCopyForm.get('code') as FormControl;
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

    this.glSrvc
      .getAccountCopyList(this.fromDate.value, this.toDate.value, this.code.value)
      .subscribe(
        (resp) => {
          this.inProgress = false;
          this.recordsList = resp;
        },
        (error) => {
          this.inProgress = false;
          this.recordsList = null;
          this.alrtSrvc.showErrorAlert(error);
        }
      );
  }
}
