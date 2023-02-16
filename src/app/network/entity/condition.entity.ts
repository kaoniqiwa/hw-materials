import { ConditionOperator } from 'src/app/enum/condition-operator.enum';
import { IModel } from 'src/app/interface/model.interface';

/**	查询条件	*/
export class Condition<T> implements IModel {
  /**	String	属性ID或属性路径	M	*/
  PropertyId!: string;
  /**	String	操作符：	M	*/
  Operator!: ConditionOperator;
  /**	Object	查询数值，注意：null值只能用于Eq和Ne操作符下的Double、Int32、String、DateTime、Date类型，不能用于数组类型。	O	*/
  Value?: T;
  /**	Boolean	是否为数组数值，注意只有Int32和String支持数组	O	*/
  IsArray?: boolean;
  /**	Int32	Or操作分组编号	O	*/
  OrGroup?: number;
  /**	Boolean	是否执行否定操作	O	*/
  /**
   *  是否执行否定操作
   *  如果为true，将于上述条件操作符相反的过滤查询。否则和正常操作一样。
   *  支持操作符如下：
   *  Gt：大于
   *  Gte：大于等于
   *  Lt：小于
   *  Lte：小于等于
   *  All: 全部包含
   */
  Not?: boolean;
}
