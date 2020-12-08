import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from 'app/modules/alert';
import { GlService } from '../gl.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
// import { trigger, state, transition, animate, animateChild, query, style, keyframes } from '@angular/animations';

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.scss'],
  // animations:[
  //   // trigger('runChildAnims', [
  //   //     transition('* <=> void', [
  //   //         query("@*", [animateChild()])
  //   //     ]),
  //   // ]),
  //   trigger('slideInRight', [
  //     transition(":enter",[
  //       animate("1s", keyframes(
  //         [
  //           style({transform: 'translateX(100%)', 'visibility': 'visible' , offset: 0}),
  //           style({transform: 'translateX(0)', offset: 1}),
  //         ])
  //       )
  //     ]),
  //     transition(":leave",[
  //       animate("1s", keyframes(
  //         [
  //           style({transform: 'translateX(0)', offset: 0}),
  //           style({visibility: 'hidden', transform: 'translateX(-100%)', offset: 1}),
  //         ])
  //       )
  //     ])
  //   ])
  // ]
})
export class FinancialComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) set matPaginator(paginator) {
    if (paginator) {
      this.financialListDS.paginator = paginator;
    }
  }

  @ViewChild(MatSort, { static: false }) set matSort(sort) {
    if (sort) {
      this.financialListDS.sort = sort;
    }
  }

  public columnsToDisplay: string[] = [
    'DbCode',
    'DbAccName',
    'DbAmount',
    'CrCode',
    'CrAccName',
    'CrAmount',
  ];

  public footerColumnsToDisplay: string[] = [
    'Profit',
    'ProfitAmount',
    'Loss',
    'LossAmount'
  ];

  public currentReport = 0; // 0- ,1- ,2- ,3- ,4-
  public currentReportName = '';

  public profitLabel = '';
  public profitAmount = '';
  public lossLabel = '';
  public lossAmount = '';

  public closingStock = '0.00';
  public financialListDS: MatTableDataSource<any>;

  public totalCredit = '';
  public totalDebit = '';
  public grossLoss = '';
  public grossProfit = '';
  public netLoss = '';
  public netProfit = '';

  constructor(private glSrvc: GlService, private alrtSrvc: AlertService) { }

  ngOnInit() {
    this.financialListDS = new MatTableDataSource<any>();
  }

  changeClosingStock() {
    this.gotoReport(0);
  }

  getTradingList() {
    this.glSrvc.getTradingList(this.closingStock).subscribe(
      (resp: any) => {
        this.financialListDS.data = this.formatData(resp.tradingList);
        this.totalDebit = resp.totalDebit;
        this.totalCredit = resp.totalCredit;
        this.grossProfit = resp.grossProfit;
        this.grossLoss = resp.grossLoss;

        this.profitLabel = 'Gross Profit';
        this.profitAmount = '' + this.grossProfit;
        this.lossLabel = 'Gross Loss';
        this.lossAmount = '' + this.grossLoss;

        this.footerColumnsToDisplay = [
          'Profit',
          'ProfitAmount',
          'Loss',
          'LossAmount'
        ];

        this.gotoReport(1);
      },
      (error) => {
        this.alrtSrvc.showErrorAlert(error);
      }
    );
  }

  getProfitNLossList() {

    this.glSrvc.getProfitNLossList(this.grossLoss, this.grossProfit).subscribe(
      (resp: any) => {
        this.financialListDS.data = this.formatData(resp.profitNLossList);
        this.totalDebit = resp.totalDebit;
        this.totalCredit = resp.totalCredit;
        this.netProfit = resp.netProfit;
        this.netLoss = resp.netLoss;

        this.profitLabel = 'Net Profit';
        this.profitAmount = '' + this.netProfit;
        this.lossLabel = 'Net Loss';
        this.lossAmount = '' + this.netLoss;

        this.footerColumnsToDisplay = [
          'Profit',
          'ProfitAmount',
          'Loss',
          'LossAmount'
        ];

        this.gotoReport(2);
      },
      (error) => {
        this.alrtSrvc.showErrorAlert(error);
      }
    );
  }

  getBalanceSheetList() {

    this.glSrvc.getBalanceSheetList(this.closingStock).subscribe(
      (resp: any) => {
        this.financialListDS.data = this.formatData(resp.balanceSheetList);

        this.totalDebit = resp.totalDebit;
        this.totalCredit = resp.totalCredit;

        this.profitLabel = this.profitAmount = this.lossLabel = this.lossAmount = '';

        this.footerColumnsToDisplay = [];

        this.gotoReport(3);
      },
      (error) => {
        this.alrtSrvc.showErrorAlert(error);
      }
    );
  }

  formatData(records: any[]) {
    return records;
  }

  gotoReport(changeTo: number) {

    this.currentReport = changeTo; // 0- ,1- ,2- ,3- ,4-

    switch (changeTo) {
      case 1: this.currentReportName = 'Trading'; break;
      case 2: this.currentReportName = 'Profit And Loss'; break;
      case 3: this.currentReportName = 'Balance Sheet'; break;
      // default: this.currentReportName=""; break;
    }

  }

}
