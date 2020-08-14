import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of, Subscription, timer } from 'rxjs';
import { catchError, map, startWith, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Group, Shop } from '../../data-model';
import { AlertService } from '../../modules/alert';
import { DisplayService, GroupService, ShopService } from '../../services';
import { DialogService } from '../../services/dialog.service';


@Component({
  selector: 'app-shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.scss'],
})
export class ShopDetailsComponent implements OnInit, OnDestroy {

  public accountDtlsForm: FormGroup;
  public pageMode = 'Create';
  public inProgress = false;

  public defaultAmount = '0.00';
  public filteredGroupOptions: Observable<Group[]>;
  public isSmallScrn = false;
  private isSmallScrnSubscription: Subscription;
  private groupsList: Group[] = [];

  @ViewChild('groupCodeFirmName', { static: false }) groupCodeFirmEle: ElementRef;

  constructor(public fb: FormBuilder, private dispSrvc: DisplayService, private shpSrvc: ShopService, private grpSrvc: GroupService, private alrtSrvc: AlertService, private dlgSrvc: DialogService, private dialogRef: MatDialogRef<ShopDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

    this.groupsList = this.data.groupList || [];

    this.isSmallScrnSubscription = this.dispSrvc.isHandSet$.subscribe(
      (ismall) => { this.isSmallScrn = ismall; },
      (error) => { }
    );

    if (this.data && this.data.pageMode && this.data.pageMode.trim().length > 0) {
      this.pageMode = this.data.pageMode.toLowerCase();
    } else {
      this.pageMode = this.pageMode.toLowerCase();
    }

    this.accountDtlsForm = this.fb.group({
      _id: [''],
      code: ['',
        {
          validators: [Validators.required, Validators.maxLength(10)],
          asyncValidators: (this.pageMode === 'create' ? [this.isCodeUnique()] : [])
        }],
      firmName: ['', [Validators.required, Validators.maxLength(50)]],
      proprietor: ['', [Validators.maxLength(50)]],
      phone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      dno: ['', Validators.maxLength(30)],
      strtNo: ['', Validators.maxLength(30)],
      area: ['', Validators.maxLength(50)],
      town: ['', Validators.maxLength(50)],
      dl1: ['', Validators.maxLength(50)],
      dl2: ['', Validators.maxLength(50)],
      gst: ['', [Validators.minLength(2), Validators.maxLength(15)]],
      mailid: ['', [Validators.email, Validators.maxLength(50)]],
      opngBalAmt: [this.defaultAmount, Validators.maxLength(15)],
      groupCode: ['', [Validators.required, Validators.maxLength(10)]]
    });

    if (this.pageMode !== 'create') {

      this.accountDtlsForm.patchValue(this.data.record);
      setTimeout(() => {
        this.validateNSetgroupCode(this.data.record.groupCode);
      });
    }

    this.filteredGroupOptions = this.groupCode.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        startWith(''),
        map(value => value ? this._filter(value) : this.groupsList.slice())
      );
  }

  ngOnDestroy() {
    this.isSmallScrnSubscription.unsubscribe();
  }

  onSelectgroupCode({ option }) {
    this.validateNSetgroupCode(option.value);
  }

  validateNSetgroupCode(code: string) {

    this.groupCodeFirmEle.nativeElement.value = '';

    const group = this.groupsList.find(x => x.code.toLowerCase() === code.toLowerCase());
    if (group) {
      this.groupCodeFirmEle.nativeElement.value = group.name;
    } else {
      this.groupCode.setErrors({ InvalidCode: true });
    }

  }

  private _filter(value: string): Group[] {
    const filterValue = value.toLowerCase();

    return this.groupsList.filter(group => group.name.toLowerCase().includes(filterValue) || group.code.toLowerCase().includes(filterValue));
  }

  get code() {
    return this.accountDtlsForm.get('code') as FormControl;
  }

  get firmName() {
    return this.accountDtlsForm.get('firmName') as FormControl;
  }

  get proprietor() {
    return this.accountDtlsForm.get('proprietor') as FormControl;
  }

  get phone() {
    return this.accountDtlsForm.get('phone') as FormControl;
  }

  get dno() {
    return this.accountDtlsForm.get('dno') as FormControl;
  }

  get strtNo() {
    return this.accountDtlsForm.get('strtNo') as FormControl;
  }

  get area() {
    return this.accountDtlsForm.get('area') as FormControl;
  }

  get town() {
    return this.accountDtlsForm.get('town') as FormControl;
  }

  get dl1() {
    return this.accountDtlsForm.get('dl1') as FormControl;
  }

  get dl2() {
    return this.accountDtlsForm.get('dl2') as FormControl;
  }

  get gst() {
    return this.accountDtlsForm.get('gst') as FormControl;
  }

  get mailid() {
    return this.accountDtlsForm.get('mailid') as FormControl;
  }

  get opngBalAmt() {
    return this.accountDtlsForm.get('opngBalAmt') as FormControl;
  }

  get groupCode() {
    return this.accountDtlsForm.get('groupCode') as FormControl;
  }

  save() {

    if (!this.accountDtlsForm.valid) {
      return false;
    }

    this.inProgress = true;

    const account: Shop = Object.assign({}, this.accountDtlsForm.value);

    const recordID = account._id;

    delete account._id;

    if (this.pageMode === 'create') {

      this.shpSrvc.save(account).subscribe(
        (resp) => {

          this.inProgress = false;

          this.alrtSrvc.showSuccessAlert(resp).afterClosed().subscribe(() => {
            this.dialogRef.close('saved');
          });
        },
        (error) => {

          this.inProgress = false;

          if (error.includes('already exists')) {
            this.code.setErrors({ alreadyExists: true });
          } else {
            this.alrtSrvc.showErrorAlert(error);
          }
        }
      );

    } else {

      this.shpSrvc.update(recordID, account).subscribe(
        (resp) => {
          this.inProgress = false;

          this.alrtSrvc.showSuccessAlert(resp).afterClosed().subscribe(() => {
            this.dialogRef.close('saved');
          });
        },
        (error) => {

          this.inProgress = false;
          this.alrtSrvc.showErrorAlert(error);
        }
      );
    }
  }

  isCodeUnique(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {

      return timer(500).pipe(
        switchMap(() => {
          return this.shpSrvc.isCodeAvail(control.value);
        }),
        map(resp => resp ? null : { alreadyExists: true }),
        catchError(() => of(null))
      );
    };
  }

  createGroup() {
    const ref = this.dlgSrvc.openGroupDialog();

    if (ref) {
      ref.afterClosed().subscribe((status) => {
        if (status) {
          this.grpSrvc.getList().subscribe((list) => {
            if (list) {
              this.groupsList = list;
            }
          });
        }
      });
    }
  }

}
