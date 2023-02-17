import { Transform } from 'class-transformer';
import { IModel } from 'src/app/interface/model.interface';
import { transformDateTime } from './transform.model';

/**	人员标签	*/
export class Label implements IModel {
  /**	Int32	ID，最低2位是子标签0-99。	M	*/
  Id!: number;
  /**	String	名称	M	*/
  Name!: string;
  /**	Int32	状态，0-正常，1-注销	M	*/
  State!: number;
  /**	Int32	类别，用于区分不同类别的标签	O	*/
  Category?: number;
  /**	DateTime	创建时间	M	*/
  @Transform(transformDateTime)
  CreationTime!: Date;
}
