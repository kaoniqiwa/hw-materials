import { IModel } from 'src/app/interface/model.interface';

export class MaterialItem implements IModel {
  /**	Int32	物料ID	M	*/ Id!: number;
  /**	String	名称	M	*/ Name!: string;
  /**	Int32	数量	M	*/ Number!: number;
}
