import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ExportService, RecordService } from '../../services';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) set matPaginator(paginator) {

    if (paginator) {
      this.tableDS.paginator = paginator;
    }
  }

  @ViewChild(MatSort, {static: false}) set matSort(sort) {

    if (sort) {
      this.tableDS.sort = sort;
    }
  }

  public filesList: string[] = [];

  public tableDS: MatTableDataSource<any> = null;
  public columnsToDisplay = [];
  public columns          = [];
  public displayTable     = false;
  public reportType;

  constructor(private rcrdSrvc: RecordService, private route: ActivatedRoute, private exportSrvc: ExportService) { }

  ngOnInit() {

    this.route.queryParamMap.pipe(
      switchMap((queryparamMap) => {
        this.reportType = queryparamMap.get('reportType');

        this.filesList = [];
        this.destroyTable();

        return this.rcrdSrvc.getFilesList();
      })
    ).subscribe((data: string[]) => {
      this.filesList = data;
    }, (error) => {
      console.log(error);
    });
  }

  loadFile(filename: string) {

    if (!filename) {
      alert('Please select file name');
      return false;
    }

    this.destroyTable();

    this.rcrdSrvc.getFileData(filename, this.reportType).subscribe((data: []) => {

      this.generateTable(data);

    }, (error) => {
      console.log(error);
    });
  }

  generateTable(list: any[]) {
    //const amountFlds = ['INVAMT', 'TAXABUL', 'IGST', 'CGST', 'SGST', 'CSS', 'DIFF'];

    const excludeFlds = ["BillCount"];

    if (list.length > 0) {
      const columns = [];

      const record = list[0];
      const keys = Object.keys(record);

      keys.forEach((data, index) => {

        columns.push({
          columnDef: data,
          header: data.toUpperCase(),
          cell: (element) => ( excludeFlds.indexOf(data) >= 0 || isNaN(element[data]) ) ? `${element[data]}` : parseFloat(element[data]).toFixed(2),
          align: 'left'
          // align: amountFlds.indexOf(data) == -1 ? "left" : "right",
        });
      });

      this.columns = columns;
      this.columnsToDisplay = columns.map( x => x.columnDef);

      // console.log(list);

      this.tableDS = new MatTableDataSource(list);
      // this.tableDS.sort = this.sort;
      // this.tableDS.paginator = this.paginator;
      this.displayTable = true;
    //   this.tableDS.filterPredicate = function(data: any, filtersJSON: string){

    //     const matchFilter = [];
    //     const filters = JSON.parse(filtersJSON);

    //     filters.forEach(filter => {
    //       const val = data[filter.id] === null ? '' : data[filter.id];

    //       if(filter.multiple)
    //         matchFilter.push(val.toLowerCase().includes(filter.value.toLowerCase()));
    //       else
    //         matchFilter.push(val.toLowerCase().includes(filter.value.toLowerCase()));

    //     });

    //     return matchFilter.every(Boolean);
    //   }

    }
  }

  // applyFilter(gst: string, supplier: string)
  // {
  //   const tableFilters = [];

  //   tableFilters.push({
  //     id: "GSTIN",
  //     value: gst
  //   });

  //   tableFilters.push({
  //     id: "SUPPLIER",
  //     value: supplier
  //   });

  //   this.tableDS.filter = JSON.stringify(tableFilters);

  //   if (this.tableDS.paginator) {
  //     this.tableDS.paginator.firstPage();
  //   }
  // }

  applyFilter(value: string) {
    this.tableDS.filter = value;
  }

  destroyTable() {
    this.displayTable = false;
    this.tableDS = null;
  }

  exportData() {
    const filename = this.reportType + '_' + Date.now();
    this.exportSrvc.exportAsExcelFile(this.tableDS.filteredData, filename);
  }
}
