export interface IModel {}
export interface IPropertyModel extends IModel {
  Id: string;
}
export interface IObjectModel extends IModel {
  Id: string | number;
  Name: string;
}
