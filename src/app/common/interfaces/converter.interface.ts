import { HowellExportModel } from '../tools/exports/hw-export.model';

export interface IConverter<T, R> {
  Convert(source: T, ...res: any[]): R;
}

export interface IPromiseConverter<T, R> {
  Convert(source: T, ...res: any[]): Promise<R>;
}

export interface IExportConverter<T> {
  Convert(source: T, ...res: any[]): HowellExportModel;
}
