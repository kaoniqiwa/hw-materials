import { IModel } from 'src/app/common/interfaces/model.interface';

/** 物料项 */
export class MaterialItem implements IModel {
  /**	Int32	物料ID	M	*/
  Id!: number;
  /**	String	名称	M	*/
  Name!: string;
  /**	Int32	数量	M	*/
  Number: number = 0;
}

export class MaterialRecordItem extends MaterialItem {
  /**	Int64	库存数量(本单出入库后的库存数量)，出入库记录上需要，其他协议上不会提供	M */
  Quantity!: number;
}
