export interface IExcelColumnValue {
  column: number;
  value: string | number;
}
export interface IExcelValue extends IExcelColumnValue {
  row: number;
}

export class HowellExportModel {
  title: string = '';
  headers: string[] = [];
  datas: Array<string | number>[] = [];
  headIndex?: number;
  dataIndex?: number[];
}
