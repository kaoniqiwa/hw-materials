import { IModel } from "src/app/common/interfaces/model.interface";

/**	属性数值	*/
export class PropertyValue<T = IModel> implements IModel {
  /**	String	属性ID	D	*/
  PropertyId?: string;
  /**	String	属性路径	D	*/
  PropertyPath?: string;
  /**	Int32	数组索引	O	*/
  Index?: number;
  /**	Object	数值	O	*/
  Value?: T;
}
