import { AfterViewInit, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Permissions, User, UserStatus } from '../../../data-model';
import { AlertService } from '../../alert';
import { AuthService, UserService } from '../../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, AfterViewInit, OnDestroy {

  userStatus = UserStatus;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public usersListDS: MatTableDataSource<User>;
  public columnsToDisplay: string[] = ['loginID', 'username', 'password', 'status'];

  public userPersmissions: Permissions = null;

  private userListUpdateSubscription: Subscription;

  constructor(private userSrvc: UserService, private authSrvc: AuthService, private alrtSrvc: AlertService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    this.userPersmissions = this.authSrvc.userPersmissions;

    if (this.userPersmissions.editUserPersmissions || this.userPersmissions.editUser || this.userPersmissions.deleteUser) {
      this.columnsToDisplay.push('oprts');
    }

    this.usersListDS = new MatTableDataSource<User>();
    this.refresh();

    this.userListUpdateSubscription = this.userSrvc.listUpdate$.subscribe( () => {
      this.refresh();
    });
  }

  ngAfterViewInit() {
    this.usersListDS.paginator = this.paginator;
    this.usersListDS.sort = this.sort;
  }

  ngOnDestroy(){
    this.userListUpdateSubscription.unsubscribe();
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

    this.router.navigate( [{outlets: { dialog: ['dialog', 'user', 'edit', user._id]}}], {relativeTo: this.route.root, skipLocationChange: true} );

  }

  editPermissions(user: User) {

    this.router.navigate( [{outlets: { dialog: ['dialog', 'user', 'permission', user._id]}}], {relativeTo: this.route.root, skipLocationChange: true} );
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
