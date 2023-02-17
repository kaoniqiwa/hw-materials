import { IModel } from 'src/app/interface/model.interface';
import { IPartialData } from './partial-data.interface';

/**	部分修改返回结果	*/
export class PartialResult<T extends IPartialData> implements IModel {
  /**	Boolean	是否成功	M	*/
  Succeed!: boolean;
  /**	String	错误原因	O	*/
  FailedReason?: string;
  /**	String	请求对象ID	O	*/
  Id?: string;
  /**	PartialData	成功修改后的数据	O	*/
  Data?: T;
}
