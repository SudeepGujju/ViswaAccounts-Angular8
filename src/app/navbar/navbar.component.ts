import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Permissions, User } from '../data-model';
import { AuthService, DisplayService } from '../services';
import { DialogService } from '../services/dialog.service';
import { MODULE_TYPE } from '..//constants';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav, { static: false })
  public sidenav: MatSidenav;

  @ViewChild('contentDiv', { static: false }) contentDiv: ElementRef;

  public isSmallScrn = false;
  private isSmallScrnSubscription: Subscription;

  public displayScrollTop = false;
  public isLoggedIn = false;
  public userObservableSubscription: Subscription;
  public userPersmissions: Permissions = null;
  public userName: String = null;

  public reportsArr = [
    { linkName: 'New', type: 'New' },
    { linkName: 'GSTR2A', type: 'GSTR2A' },
    { linkName: 'GSTR2A (Invoice)', type: 'GSTR2A-Invoice' },
    { linkName: 'GSTR2A (Summary)', type: 'GSTR2A-Summary' },
    { linkName: 'Tax Wise', type: 'TAXWISE' },
  ];

  public MODULE_TYPE = MODULE_TYPE;

  constructor(
    private dispSrvc: DisplayService,
    private authSrvc: AuthService,
    private dlgSrvc: DialogService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isSmallScrnSubscription = this.dispSrvc.isHandSet$.subscribe(
      (ismall) => {
        this.isSmallScrn = ismall;
      },
      (error) => { }
    );

    this.userObservableSubscription = this.authSrvc.userObservable$.subscribe(
      (user: User) => {
        if (user) {
          this.isLoggedIn = true;
          this.userPersmissions = user.permissions;
          this.userName = user.username;
        } else {
          this.isLoggedIn = false;
          this.userPersmissions = null;
          this.userName = null;
        }
      }
    );
  }

  ngOnDestroy() {
    this.isSmallScrnSubscription.unsubscribe();
    this.userObservableSubscription.unsubscribe();
  }

  scrollToTop() {
    this.contentDiv.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onContentScroll(event) {
    if (event.target.scrollTop > 50) {
      this.displayScrollTop = true;
    } else {
      this.displayScrollTop = false;
    }
  }

  openDialog(pageName: string) {
    if (pageName === 'createAccnt') {
      this.dlgSrvc.openAccountDialog();
    } else if (pageName === 'createUser') {
      this.dlgSrvc.openUserDialog();
    } else if (pageName === 'createGroup') {
      this.dlgSrvc.openGroupDialog();
    } else if (pageName === 'createInvntry') {
      this.dlgSrvc.openInventoryDialog();
    } else if (pageName === 'createGenVchr') {
      this.dlgSrvc.openGeneralVocuerDialog();
    } else {
      this.dlgSrvc.openDialog(pageName);
    }
  }

  logout() {
    this.authSrvc.logout(true);
    this.router.navigate(['login']);
  }
}
