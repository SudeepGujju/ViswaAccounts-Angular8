import { Component, Inject, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of, Subscription, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { DisplayService, GroupService } from 'app/services';
import { AlertService } from 'app/modules/alert';
import { Group, GroupType } from 'app/data-model';
import { Constants } from 'app/constants';

@Component({
  selector: '',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupDetailsComponent implements OnInit, OnDestroy {

  public groupType = GroupType;
  public groupDtlsForm: FormGroup;
  public pageMode = '';
  public isCreateMode = false;
  public inProgress = false;
  public isSmallScrn = false;

  private isSmallScrnSubscription: Subscription;

  constructor(public fb: FormBuilder, private dispSrvc: DisplayService, private grpSrvc: GroupService, private alrtSrvc: AlertService, private dialogRef: MatDialogRef<GroupDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {

    this.isSmallScrnSubscription = this.dispSrvc.isHandSet$.subscribe(
      (ismall) => { this.isSmallScrn = ismall; },
      (error) => {}
    );

    this.pageMode = Constants.PageModeMapping(this.data.pageMode);

    if (this.data.pageMode === Constants.PAGE_MODE.CREATE) {
      this.isCreateMode = true;
    }

    this.groupDtlsForm = this.fb.group({
      _id: [''],
      code: ['',
      {
        validators: [Validators.required, Validators.maxLength(10)],
        asyncValidators: (this.isCreateMode ? [this.isCodeUnique()] : [] )
      }],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      grpType: [this.groupType.Trading, [Validators.required]]
    });

    if (!this.isCreateMode) {
      this.groupDtlsForm.patchValue(this.data.details);
    }
  }

  ngOnDestroy() {
    this.isSmallScrnSubscription.unsubscribe();
  }

  get code() {
    return this.groupDtlsForm.get('code') as FormControl;
  }

  get name() {
    return this.groupDtlsForm.get('name') as FormControl;
  }

  get grpType() {
    return this.groupDtlsForm.get('grpType') as FormControl;
  }

  save() {

    if (!this.groupDtlsForm.valid) {
      return false;
    }

    if (this.isCreateMode) {
      this.createGroup();
    } else {
      this.editGroup();
    }
  }

  createGroup() {

    this.inProgress = true;

    const group: Group = Object.assign({}, this.groupDtlsForm.value);

    delete group._id;

    this.grpSrvc.save(group).subscribe((resp) => {
      this.inProgress = false;

      this.alrtSrvc.showSuccessAlert(resp).afterClosed().subscribe(() => {
        this.dialogRef.close();
        this.grpSrvc.notifyToUpdateList();
      });
    },
    (error) => {

      this.inProgress = false;

      if (error.includes('already exists')) {
        this.code.setErrors({alreadyExists: true});
      } else {
        this.alrtSrvc.showErrorAlert(error);
      }

    });

  }

  editGroup() {

    this.inProgress = true;

    const group: Group = Object.assign({}, this.groupDtlsForm.value);

    const recordID = group._id;

    delete group._id;

    this.grpSrvc.update(recordID, group).subscribe((resp) => {

      this.inProgress = false;

      this.alrtSrvc.showSuccessAlert(resp).afterClosed().subscribe(() => {
        this.dialogRef.close();
        this.grpSrvc.notifyToUpdateList();
      });

    },
    (error) => {

      this.inProgress = false;
      this.alrtSrvc.showErrorAlert(error);

    });

  }

  isCodeUnique(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {

      return timer(500).pipe(
        switchMap(() => {
          return this.grpSrvc.isCodeAvail(control.value);
        }),
        map(resp => resp ? null : {alreadyExists: true} ),
        catchError(() => of(null))
      );
    };
  }

}
