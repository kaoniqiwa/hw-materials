import { IConverter, IPromiseConverter } from './converter.interface';

export interface IBusiness<IModel, IViewModel = IModel> {
  Converter?:
    | IConverter<IModel, IViewModel>
    | IPromiseConverter<IModel, IViewModel>;
  load(...args: any): Promise<IViewModel>;
  getData(...args: any): Promise<IModel>;
}

export interface IRemoveBusiness<IModel, IViewModel>
  extends IBusiness<IModel, IViewModel> {
  remove(id: string): Promise<any>;
}
export interface ICreate<T> {
  create(...args: any[]): Promise<T>;
}
export interface IUpdate<T> {
  update(...args: any[]): Promise<T>;
}
export interface IDelete<T> {
  delete(...args: any[]): Promise<T>;
}
export interface IGet<T> {
  get(...args: any[]): Promise<T>;
}
export interface IUpload {
  upload(...args: any[]): Promise<any>;
}
export interface IDownload {
  download(...args: any[]): Promise<any>;
}
