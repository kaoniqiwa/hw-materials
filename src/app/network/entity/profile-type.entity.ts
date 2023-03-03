import { IObjectModel } from 'src/app/common/interfaces/model.interface';

export class ProfileType implements IObjectModel {
  /**	Int32	分类类型	M */
  Id!: number;
  /**	String	分类名称	M */
  Name!: string;
}
