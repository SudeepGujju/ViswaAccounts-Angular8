import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { glPrepareUrl, glAccountCopyUrl, glTrailBalanceUrl, glTradingUrl, glProfitNLossUrl, glBalanceSheetUrl } from '../../urlConfig';
import { Observable } from 'rxjs';

@Injectable()
export class GlService {

  constructor(private http: HttpClient) { }

  prepare() {
    return this.http.get(glPrepareUrl);
  }

  getAccountCopyList(fromDate: string, toDate: string, code: string): Observable<any[]> {
    return this.http.get<any[]>(glAccountCopyUrl, {params: {fromDate, toDate, code} });
  }

  getTrailBalanceList(): Observable<any[]> {
    return this.http.get<any[]>(glTrailBalanceUrl);
  }

  getTradingList(closingStock: string) {
    return this.http.get<object>(glTradingUrl, {params: {closingStock}});
  }

  getProfitNLossList(grossLoss: string, grossProfit: string) {
    return this.http.get<object>(glProfitNLossUrl, {params: {grossLoss, grossProfit}});
  }

  getBalanceSheetList(closingStock: string) {
    return this.http.get<object>(glBalanceSheetUrl, {params: {closingStock}});
  }

}
