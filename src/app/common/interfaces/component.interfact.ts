import { ExportTool } from '../tools/export.tool';
import { IBusiness } from './bussiness.interface';
import { IExportConverter } from './converter.interface';
import { IModel } from './model.interface';

export interface IComponent<TModel extends IModel, TViewModel> {
  business: IBusiness<TModel, TViewModel>;
}
export interface IExportComponent<T> {
  exports: ExportTool;
  exportConverter: IExportConverter<T>;
}
