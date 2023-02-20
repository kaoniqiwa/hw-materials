export interface IExcelColumnValue {
  column: number;
  value: string | number;
}
export interface IExcelValue extends IExcelColumnValue {
  row: number;
}

export class HowellExportModel {
  /** 标题 */
  title: string = '';
  /** 表格表头 */
  headers: string[] = [];
  /** 行数据 */
  rowValues: Array<string | number>[] = [];
  /** 用于定位图表标题 */
  headIndex?: number;
  /** 用于定位图表数据，列序号 */
  dataIndex?: number[];
}

export interface HowellExportRowModel {
  row: number;
  column: number;
  value: string | number;
}
