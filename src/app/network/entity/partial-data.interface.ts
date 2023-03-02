import { IPropertyModel } from 'src/app/common/interfaces/model.interface';

export interface IPartialData extends IPropertyModel {}

export class PartialData implements IPartialData {
  Id!: string;
  [key: string]: any;
}
