import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Permissions, User, UserStatus } from '../../data-model';
import { AlertService } from '../../modules/alert';
import { AuthService, UserService } from '../../services';
import { DialogService } from '../../services/dialog.service';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, AfterViewInit {

  userStatus = UserStatus;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public usersListDS: MatTableDataSource<User>;
  public columnsToDisplay: string[] = ['loginID', 'username', 'password', 'status'];

  public userPersmissions: Permissions = null;

  constructor(private userSrvc: UserService, private authSrvc: AuthService, private alrtSrvc: AlertService, private dlgSrvc: DialogService) { }

  ngOnInit() {

    this.userPersmissions = this.authSrvc.userPersmissions;

    if (this.userPersmissions.editUserPersmissions || this.userPersmissions.editUser || this.userPersmissions.deleteUser) {
      this.columnsToDisplay.push('oprts');
    }

    this.usersListDS = new MatTableDataSource<User>();
    this.refresh();
  }

  ngAfterViewInit() {
    this.usersListDS.paginator = this.paginator;
    this.usersListDS.sort = this.sort;
  }

  applyFilter(value: string) {
    this.usersListDS.filter = value;
  }

  trackList(index, data) {
    return data._id;
  }

  refresh() {
    this.userSrvc.getList().subscribe(
      (resp) => {
        this.usersListDS.data = resp;
      },
      (error) => {
        this.alrtSrvc.showErrorAlert(error);
      }
    );
  }

  edit(user: User) {

    this.dlgSrvc.openUserDialog(user._id);

    // dialogRef.afterClosed().subscribe((resp) => {
    //   if (resp == 'saved') {
    //     this.refresh();
    //   }
    // });
  }

  editPermissions(user: User) {

    this.dlgSrvc.openUserPermissionDialog(user._id, user.username);

    // const dialogRef = this.dlgSrvc.openUserPermissionDialog(user.id, user.username);

    // dialogRef.afterClosed().subscribe((resp) => {
    //   if (resp == 'saved') {
    //     this.refresh();
    //   }
    // });
  }

  delete(user: User) {

    this.alrtSrvc.showConfirmAlert(`Do you want to delete ${user.username}`).afterClosed().subscribe((confirm) => {

      if (confirm) {
        this.userSrvc.delete(user._id).subscribe(
          (resp) => {
            this.refresh();
          },
          (error) => {
            this.alrtSrvc.showErrorAlert(error);
          }
        );
      }

    });

  }

}
