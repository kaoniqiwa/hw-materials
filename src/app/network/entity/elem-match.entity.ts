import { IModel } from 'src/app/common/interfaces/model.interface';
import { Condition } from './condition.entity';

/**	0	*/
export class ElemMatch<T = any> implements IModel {
  /**	String	数组元素所在的属性，如：Buildings,注意：目前只支持第一层数组，不支持数组嵌套	M	*/
  PropertyId!: string;
  /**	Condition[]	查询条件列表，多条件之间是AND关系。	O	*/
  Conditions?: Condition<T>[];
}
