import { Transform } from 'class-transformer';
import { IObjectModel } from 'src/app/common/interfaces/model.interface';
import { MaterialCategoryType } from 'src/app/enum/material-category-type.enum';
import { transformDateTime } from './transform.model';

export class Material implements IObjectModel {
  /**	Int32	物料ID：	M	*/
  Id!: number;
  /**	String	名称	M	*/
  Name!: string;
  /**	Int32	类别	M	*/
  Category!: MaterialCategoryType;
  /**	String	备注	O	*/
  Description?: string;
  /**	DateTime	创建时间	O	*/
  @Transform(transformDateTime)
  CreationTime?: Date;
  /**	DateTime	更新时间	O	*/
  @Transform(transformDateTime)
  UpdateTime?: Date;
  /**	Int64	库存数量	M */
  Quantity!: number;
}
