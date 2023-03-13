import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExportType } from 'src/app/enum/export-type.enum';
import { IConverter } from '../interfaces/converter.interface';
import { HowellExportChart } from './exports/hw-export-chart';
import { HowellCSV } from './exports/hw-export-csv';
import { HowellExcel } from './exports/hw-export-excel';
import { HowellExportModel } from './exports/hw-export.model';

export interface IExport<T> {
  data: T;
  tool: ExportTool;
  export(title: string, row: number): number;
  completed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ExportTool {
  constructor(private http: HttpClient) {}

  export<T>(
    type: ExportType,
    title: string,
    headers: string[],
    datas: T,
    converter: IConverter<T, HowellExportModel>,
    ...args: any[]
  ) {
    switch (type) {
      case ExportType.excel:
        this.excel(title, headers, datas, converter, ...args);
        break;
      case ExportType.csv:
        this.csv(title, headers, datas, converter, ...args);
        break;
      case ExportType.chart:
        this.chart(title, headers, datas, converter, ...args);
        break;
      default:
        break;
    }
  }

  excel<T>(
    title: string,
    headers: string[],
    datas: T,
    converter: IConverter<T, HowellExportModel>,
    ...args: any[]
  ) {
    let excel = new HowellExcel();
    let model = converter.convert(datas, ...args);
    model.headers = headers;
    model.title = title;
    excel.setData(model);
    excel.save(title);
  }
  csv<T>(
    title: string,
    headers: string[],
    datas: T,
    converter: IConverter<T, HowellExportModel>,
    ...args: any[]
  ) {
    let model = converter.convert(datas, ...args);
    model.title = title;
    model.headers = headers;
    HowellCSV.writeFile(title, model);
  }

  chart<T>(
    title: string,
    headers: string[],
    datas: T,
    converter: IConverter<T, HowellExportModel>,
    ...args: any[]
  ) {
    let excel = new HowellExcel();
    let model = converter.convert(datas, ...args);
    model.headers = headers;
    model.title = title;
    excel.setData(model);

    let chart = new HowellExportChart(this.http);
    chart.setData(model, excel, model.headIndex!, model.dataIndex!);
  }
}
