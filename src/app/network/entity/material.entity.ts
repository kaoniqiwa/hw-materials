import { IModel } from 'src/app/interface/model.interface';

export class Material implements IModel {
  /**	Int32	物料ID：	M	*/
  Id!: number;
  /**	String	名称	M	*/
  Name!: string;
  /**	Int32	类别	O	*/
  Category?: number;
}
