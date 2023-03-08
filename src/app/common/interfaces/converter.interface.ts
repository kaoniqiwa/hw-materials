import { HowellExportModel } from '../tools/exports/hw-export.model';

export interface IConverter<T, R> {
  convert(source: T, ...res: any[]): R;
}

export interface IPromiseConverter<T, R> {
  convert(source: T, ...res: any[]): Promise<R>;
}

export interface IExportConverter<T> {
  convert(source: T, ...res: any[]): HowellExportModel;
}
