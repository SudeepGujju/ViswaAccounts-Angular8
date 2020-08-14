import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { FileUploadComponent } from '../components/file-upload/file-upload.component';
import { RegistrationComponent } from '../components/registration/registration.component';
import { ShopDetailsComponent } from '../components/shop-details/shop-details.component';
import { GroupDetailsComponent } from '../components/group-details/group-details.component';
import { UserPermissionsComponent } from '../components/user-permissions/user-permissions.component';
import { GeneralVouchersService } from './general-voucher.service';
import { GroupService } from './group.service';
import { InventoryService } from './inventory.service';
import { ShopService } from './shop.service';
import { UserService } from './user.service';
// import { VoucherService } from './vouchers.service';
import { InventoryDetailsComponent } from '../components/inventory-details/inventory-details.component';
import { GenVoucherDetailsComponent } from '../components/gen-voucher-details/gen-voucher-details.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(
    private shpSrvc: ShopService,
    // private vouchSrvc: VoucherService,
    private invtrySrvc: InventoryService,
    private grpSrvc: GroupService,
    private genVochSrvc: GeneralVouchersService,
    private userSrvc: UserService,
    private dialog: MatDialog
  ) {}

  closeAllDialogs() {
    this.dialog.closeAll();
  }

  openDialog(pageName: string, key?: string) {
    if (pageName === 'createVchr') {
      // this.vouchSrvc.openVoucherDtlsPage();
    } else if (pageName === 'uploadFile') {
      this.openUploadDialog();
    }
  }

  public openUserDialog(id?: string) {
    if (!id) {
      this.dialog.open(RegistrationComponent, {
        width: '500px',
        disableClose: true,
        role: 'dialog',
        hasBackdrop: true,
        data: {
          pageMode: 'Create',
        },
      });
    } else {
      this.userSrvc.get(id).subscribe((data) => {
        return this.dialog.open(RegistrationComponent, {
          width: '500px',
          disableClose: true,
          role: 'dialog',
          hasBackdrop: true,
          data: {
            pageMode: 'Edit',
            record: data,
          },
        });
      });
    }
  }

  public openUserPermissionDialog(id: string, username: string) {
    this.userSrvc.getPersmission(id).subscribe((data: any) => {
      this.dialog.open(UserPermissionsComponent, {
        width: '800px',
        disableClose: true,
        role: 'dialog',
        hasBackdrop: true,
        data: {
          record: { id, username, permissions: data.permissions },
        },
      });
    });
  }

  public openGroupDialog(
    id?: string
  ): MatDialogRef<GroupDetailsComponent> | undefined {
    if (!id) {
      return this.dialog.open(GroupDetailsComponent, {
        width: '550px',
        role: 'dialog',
        hasBackdrop: true,
        disableClose: true,
        restoreFocus: false,
        data: {
          pageMode: 'Create',
        },
      });
    } else {
      this.grpSrvc.get(id).subscribe((data) => {
        this.dialog.open(GroupDetailsComponent, {
          width: '550px',
          role: 'dialog',
          hasBackdrop: true,
          disableClose: true,
          restoreFocus: false,
          data: {
            pageMode: 'Edit',
            record: data,
          },
        });
      });
    }
  }
/*
  public openUploadGroupDialog() {
    this.dialog.open(GroupUploadComponent, {
      minHeight: '150px',
      minWidth: '500px',
      restoreFocus: false,
      disableClose: true,
      role: 'dialog',
      hasBackdrop: true,
    });
  }

  public openUploadAccountDialog() {
    this.dialog.open(AccountUploadComponent, {
      minHeight: '150px',
      minWidth: '500px',
      restoreFocus: false,
      disableClose: true,
      role: 'dialog',
      hasBackdrop: true,
    });
  }

  public openUploadProductDialog() {
    this.dialog.open(ProductUploadComponent, {
      minHeight: '150px',
      minWidth: '500px',
      restoreFocus: false,
      disableClose: true,
      role: 'dialog',
      hasBackdrop: true,
    });
  }

  public openUploadInventoryDialog() {
    this.dialog.open(InventoryUploadComponent, {
      minHeight: '150px',
      minWidth: '500px',
      restoreFocus: false,
      disableClose: true,
      role: 'dialog',
      hasBackdrop: true,
    });
  }
*/
  public openAccountDialog(id?: string) {
    if (!id) {
      this.grpSrvc.getDropdownList().subscribe((grpList) => {
        this.dialog.open(ShopDetailsComponent, {
          width: '550px',
          role: 'dialog',
          hasBackdrop: true,
          disableClose: true,
          restoreFocus: false,
          data: {
            pageMode: 'Create',
            groupList: grpList,
          },
        });
      });
    } else {
      forkJoin([
        this.shpSrvc.get(id),
        this.grpSrvc.getDropdownList()
      ]).subscribe(([account, grpList]) => {
        this.dialog.open(ShopDetailsComponent, {
          width: '550px',
          role: 'dialog',
          hasBackdrop: true,
          disableClose: true,
          restoreFocus: false,
          data: {
            pageMode: 'Edit',
            record: account,
            groupList: grpList,
          },
        });
      });
    }
  }

  openInventoryDialog(id?: string) {
    if (!id) {
      this.shpSrvc.getDropdownList().subscribe((accountsList) => {
        this.dialog.open(InventoryDetailsComponent, {
          width: '550px',
          role: 'dialog',
          hasBackdrop: true,
          disableClose: true,
          restoreFocus: false,
          data: {
            pageMode: 'Create',
            accountsList,
          }
        });
      });
    } else {
      forkJoin([
        this.invtrySrvc.get(id),
        this.shpSrvc.getDropdownList()
      ]).subscribe(([inventory, accountsList]) => {
        this.dialog.open(InventoryDetailsComponent, {
          width: '550px',
          role: 'dialog',
          hasBackdrop: true,
          disableClose: true,
          restoreFocus: false,
          data: {
            pageMode: 'Edit',
            record: inventory,
            accountsList,
          },
        });
      });
    }
  }

  openGeneralVocuerDialog(id?: string) {
    if (!id) {
      forkJoin([
        this.genVochSrvc.getNextId(),
        this.shpSrvc.getDropdownList()
      ]).subscribe(([No, accountsList]) => {
        this.dialog.open(GenVoucherDetailsComponent, {
          role: 'dialog',
          hasBackdrop: true,
          disableClose: true,
          restoreFocus: false,
          data: {
            pageMode: 'Create',
            accountsList,
            recordNo: No
          }
        });
      });
    } else {
      forkJoin([
        this.genVochSrvc.get(id),
        this.shpSrvc.getDropdownList()
      ]).subscribe(([genVoucher, accountsList]) => {
        this.dialog.open(GenVoucherDetailsComponent, {
          role: 'dialog',
          hasBackdrop: true,
          disableClose: true,
          restoreFocus: false,
          data: {
            pageMode: 'Edit',
            record: genVoucher,
            accountsList,
          },
        });
      });
    }
  }

  openUploadDialog() {
    this.dialog.open(FileUploadComponent, {
      minHeight: '150px',
      minWidth: '500px',
      restoreFocus: false,
      disableClose: true,
      role: 'dialog',
      hasBackdrop: true,
    });
  }
}
