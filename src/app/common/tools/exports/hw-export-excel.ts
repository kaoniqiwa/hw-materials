import { Buffer, Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver';
import {
  HowellExportModel,
  IExcelColumnValue,
  IExcelValue,
} from './hw-export.model';

export class HowellExcelJS {
  private _book?: Workbook;
  public get book(): Workbook {
    if (!this._book) {
      this._book = new Workbook();
    }
    return this._book;
  }

  addWorksheet(sheetName: string) {
    return this.book.addWorksheet(sheetName);
  }

  getWorksheet(sheetName: string) {
    return this.book.getWorksheet(sheetName);
  }

  load(data: Buffer) {
    return this.book.xlsx.load(data);
  }

  setCellValue(
    worksheet: Worksheet,
    row: number,
    column: number,
    val: string | number
  ) {
    const cell = worksheet.getCell(row, column);
    cell.value = val;
  }

  mergeCells(
    worksheet: Worksheet,
    top: number,
    left: number,
    bottom: number,
    right: number
  ) {
    return worksheet.mergeCells([top, left, bottom, right]);
  }

  addImageToBook(base64Image: string) {
    return this.book.addImage({
      base64: base64Image,
      extension: 'png',
    });
  }

  addImageToSheet(worksheet: Worksheet, imageId: number, cell: string) {
    worksheet.getCell(cell).fill = {
      type: 'pattern',
      pattern: 'darkTrellis',
      bgColor: { argb: 'FF0C1127' },
    };
    return worksheet.addImage(imageId, cell);
  }

  writeFile(filename: string, extension: string = '') {
    extension = extension || '.xlsx';
    this.book.xlsx.writeBuffer().then((x) => {
      let blob = new Blob([x], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, filename + extension);
    });
  }

  getBuffer(): Promise<Buffer> {
    return this.book.xlsx.writeBuffer();
  }
}

export class HowellExcel {
  excel = new HowellExcelJS();
  private readonly SheetName = 'Table';

  getBuffer(): Promise<Buffer> {
    return this.excel.getBuffer();
  }

  setValues(datas: Array<IExcelValue>) {
    let sheet = this.excel.addWorksheet(this.SheetName);
    for (let i = 0; i < datas.length; i++) {
      const data = datas[i];
      this.excel.setCellValue(sheet, data.row, data.column, data.value);
    }
  }
  setRowValues(row: number, datas: IExcelColumnValue[]) {
    let values = datas.map((x) => {
      return {
        ...x,
        row: row,
      };
    });
    this.setValues(values);
  }

  setData(model: HowellExportModel) {
    let sheet = this.excel.addWorksheet('Table');
    let rowOffset = 1;
    if (model.title) {
      this.excel.setCellValue(sheet, rowOffset, 2, model.title);
      rowOffset++;
    }
    if (model.headers) {
      for (let i = 0; i < model.headers.length; i++) {
        let column = i + 1;
        this.excel.setCellValue(sheet, rowOffset, column, model.headers[i]);
      }
      rowOffset++;
    }
    if (model.rowValues) {
      for (let i = 0; i < model.rowValues.length; i++) {
        const rowData = model.rowValues[i];
        for (let j = 0; j < rowData.length; j++) {
          let column = j + 1;
          const data = rowData[j];
          this.excel.setCellValue(sheet, rowOffset, column, data);
        }
        rowOffset++;
      }
    }
  }

  save(filename: string) {
    this.excel.writeFile(filename, '.xlsx');
  }
}
