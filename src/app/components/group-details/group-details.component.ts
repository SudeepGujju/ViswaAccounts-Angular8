import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of, Subscription, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Group, GroupType } from '../../data-model';
import { AlertService } from '../../modules/alert';
import { DisplayService } from '../../services';
import { GroupService } from '../../services';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent implements OnInit, OnDestroy {

  public groupType = GroupType;
  public groupDtlsForm: FormGroup;
  public pageMode = 'Create';
  public inProgress = false;
  public isSmallScrn = false;

  private isSmallScrnSubscription: Subscription;

  constructor(public fb: FormBuilder, private dispSrvc: DisplayService, private grpSrvc: GroupService, private alrtSrvc: AlertService, private dialogRef: MatDialogRef<GroupDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

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

    this.groupDtlsForm = this.fb.group({
    _id: [''],
      code: ['',
      {
        validators: [Validators.required, Validators.maxLength(10)],
        asyncValidators: (this.pageMode === 'create' ? [this.isCodeUnique()] : [] )
      }],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      grpType: [this.groupType.Trading, [Validators.required]]
    });

    if (this.pageMode !== 'create') {
      this.groupDtlsForm.patchValue(this.data.record);
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

    this.inProgress = true;

    const group: Group = Object.assign({}, this.groupDtlsForm.value);

    const recordID = group._id;

    delete group._id;

    if (this.pageMode === 'create') {

      this.grpSrvc.save(group).subscribe((resp) => {
        this.inProgress = false;

        this.alrtSrvc.showSuccessAlert(resp).afterClosed().subscribe(() => {
          this.dialogRef.close('saved');
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

    } else {

      this.grpSrvc.update(recordID, group).subscribe((resp) => {
        this.inProgress = false;

        this.alrtSrvc.showSuccessAlert(resp).afterClosed().subscribe(() => {
          this.dialogRef.close('saved');
        });
      },
      (error) => {

        this.inProgress = false;
        this.alrtSrvc.showErrorAlert(error);
      });
    }
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
