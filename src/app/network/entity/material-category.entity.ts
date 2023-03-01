import { IModel } from 'src/app/common/interfaces/model.interface';

/**	物料分类	*/
export class MaterialCategory implements IModel {
  /**	Int32	分类类型	M	*/
  Id!: number;
  /**	String	分类名称	M	*/
  Name!: string;
}
