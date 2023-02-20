import { HttpClient } from '@angular/common/http';
import { ExcelData } from './hw-excel-v1/data';
import { HowellExcelV1 } from './hw-excel-v1/hw-excel-v1';
import { HowellExcel } from './hw-export-excel';
import { HowellExportModel } from './hw-export.model';

export class HowellExportChart {
  constructor(private http: HttpClient) {}

  setData(
    model: HowellExportModel,
    excel: HowellExcel,
    yDataIndex: number,
    xDataIndex: number[]
  ) {
    this.http
      .get('/assets/xlsx/column.xlsx', {
        responseType: 'arraybuffer',
      })
      .subscribe((x) => {
        let data = new ExcelData();
        data.titles = [model.title];
        data.chartTitle = model.title;
        data.dataLen = model.rowValues.length + yDataIndex;
        data.dataKey = xDataIndex.map((x) => model.headers[x]);
        data.fields = model.rowValues.map((x) => x[yDataIndex].toString());
        data.data = new Object();
        xDataIndex.forEach((index) => {
          let head = model.headers[index];
          if (!data.data[head]) data.data[head] = {};
          model.rowValues.forEach((x) => {
            data.data[head][x[yDataIndex]] = x[index];
          });
        });

        let v1 = new HowellExcelV1(data);
        v1.loadZip(x).then(() => {
          var sheetArr: any;
          /**图表 数据 */
          v1.read({ file: 'xl/worksheets/sheet1.xml' }, (err: any, o: any) => {
            sheetArr = {
              $: o.worksheet.$,
              sheetViews: o.worksheet.sheetViews,
              drawing: o.worksheet.drawing,
            };
            excel.getBuffer().then((buffer) => {
              v1.generate(buffer, model.title, 2, 4, true, sheetArr);
            });
          });
        });
      });
  }
}
