import { IModel, IPropertyModel } from 'src/app/interface/model.interface';

/**	0	*/
export class PartialResult<T extends IPropertyModel> implements IModel {
  /**	Boolean	是否成功	M	*/ Succeed!: boolean;
  /**	String	错误原因	O	*/ FailedReason?: string;
  /**	String	请求对象ID	O	*/ Id?: string;
  /**	PartialData	成功修改后的数据	O	*/ Data?: T;
}
