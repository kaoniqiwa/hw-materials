import { IModel } from 'src/app/interface/model.interface';

/**	摄像机	*/
export class Division implements IModel {
  /**	String	区划ID，	M	*/ Id!: string;
  /**	String	区划名称	M	*/ Name!: string;
  /**	String	父区划ID，如果是根区域节点，则该ID为空	O	*/ ParentId?: string;
  /**	String	路径	O	*/ Path?: string;
  /**	String	缩写名称	O	*/ AbbrName?: string;
}
