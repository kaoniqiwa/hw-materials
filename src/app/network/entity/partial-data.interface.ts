import { IIdModel } from 'src/app/common/interfaces/model.interface';

export interface IPartialData extends IIdModel {}

export class PartialData implements IPartialData {
  Id!: string;
  [key: string]: any;
}

export class StatePartialData extends PartialData {
  ProfileState!: number;
}
