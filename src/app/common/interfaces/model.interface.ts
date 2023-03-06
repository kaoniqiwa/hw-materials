export interface IModel {}
export interface IIdModel extends IModel {
  Id: string;
}
export interface IObjectModel extends IModel {
  Id: string | number;
  Name: string;
}
