import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  public exportAsExcelFile(data: any[], filename: string, config: filterConfig = {filterKeys: [], skipHeader: false}): void {

    if (config.filterKeys.length > 0) {
      data = this.filterData(data, config.filterKeys);
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, {skipHeader: config.skipHeader});

    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet},
      SheetNames: ['data']
    };

    const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', bookSST: false, type: 'array'});
    this.saveAsExcelFile(excelBuffer, filename);
  }

  public exportTableAsExcelFile(tableDiv: any, filename: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tableDiv);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet},
      SheetNames: ['data']
    };

    const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', bookSST: false, type: 'array'});
    this.saveAsExcelFile(excelBuffer, filename);
  }

  private saveAsExcelFile(buffer, filename) {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocuments.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_XLSX = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });

    FileSaver.saveAs(data, filename + EXCEL_XLSX);
  }

  private filterData(data: any[], filterKeys: any[]) {
    return data.map( (record) => {

      const obj: any = {};

      filterKeys.forEach( x => obj[x] = record[x]);

      return obj;
    });
  }

  private filterColumns(tableDiv) {
    const table = tableDiv.getElementsByTagName('table')[0].cloneNode(true);

    for (let i = 0; i < table.rows.length; i++) {
      const cells = table.rows[i].cells;

      for (let i = 0; i < cells.length; i++) {
        const exportCell = cells[i].getAttribute('data-export') || 'true';

        if (exportCell == 'false') {
          cells[i].remove();
        }
      }
    }

    return table;
  }
}

interface filterConfig {
  filterKeys: any[];
  skipHeader: boolean;
  // colHeading: any[]
}
