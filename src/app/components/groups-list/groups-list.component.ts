import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Group, GroupType, GroupTypeMapping, Permissions } from '../../data-model';
import { AlertService } from '../../modules/alert';
import { AuthService } from '../../services/auth.service';
import { GroupService } from '../../services/group.service';
import { ExportService } from '../../services/export.service';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss'],
})
export class GroupsListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public groupType = GroupType;
  public groupListDS: MatTableDataSource<Group>;
  private exportColumns: string[] = ['code', 'name', 'groupName'];
  public columnsToDisplay: string[] = ['code', 'name', 'groupName'];

  public userPersmissions: Permissions = null;

  constructor(
    private grpSrvc: GroupService,
    private authSrvc: AuthService,
    private alrtSrvc: AlertService,
    private dlgSrvc: DialogService,
    private exportSrvc: ExportService
  ) {}

  ngOnInit() {
    this.userPersmissions = this.authSrvc.userPersmissions;

    if (this.userPersmissions.editGroup || this.userPersmissions.deleteGroup) {
      this.columnsToDisplay.push('oprts');
    }

    this.groupListDS = new MatTableDataSource<Group>();
    this.refresh();
  }

  ngAfterViewInit() {
    this.groupListDS.paginator = this.paginator;
    this.groupListDS.sort = this.sort;
  }

  applyFilter(value: string) {
    this.groupListDS.filter = value;
  }

  trackList(index, data) {
    return data._id;
  }

  refresh() {
    this.grpSrvc.getList().subscribe(
      (resp) => {
        this.groupListDS.data = this.formatData(resp);
      },
      (error) => {
        this.alrtSrvc.showErrorAlert(error);
      }
    );
  }

  formatData(records: Group[]) {
    if (records.length > 0) {
      records.forEach(x => x.groupName = GroupTypeMapping(x.grpType));
    }

    return records;
  }

  edit(group: Group) {
    this.dlgSrvc.openGroupDialog(group._id);

    // dialogRef.afterClosed().subscribe((resp) => {
    //   if (resp == 'saved') {
    //     this.refresh();
    //   }
    // });
  }

  delete(group: Group) {
    this.alrtSrvc
      .showConfirmAlert(`Do you want to delete ${group.code}`)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.grpSrvc.delete(group._id).subscribe(
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

  exportData() {
    const filename = this.authSrvc.user.username + '_group_' + Date.now();

    const headings = {
      code: 'Code',
      name: 'Name',
      groupName: 'Type'
    };

    const data = [].concat(headings).concat(this.groupListDS.filteredData);
    this.exportSrvc.exportAsExcelFile(data, filename, {
      filterKeys: this.exportColumns,
      skipHeader: true
    });
  }
}
