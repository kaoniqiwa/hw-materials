import { Condition } from 'src/app/network/entity/condition.entity';
import { ElemMatch } from 'src/app/network/entity/elem-match.entity';
import { IPartialData } from 'src/app/network/entity/partial-data.interface';
import { DurationParams, IParams, PagedParams } from '../../IParams.interface';

export class GetGarbageStationProfilesParams extends PagedParams {
  /**	String[]	垃圾厢房档案ID	O	*/
  Ids?: string[];
  /**	String	垃圾厢房档案名称，支持LIKE	O	*/
  ProfileName?: string;
}

export class GetPropertiesParams extends PagedParams {
  /**	String[]	属性ID	O	*/
  Ids?: string[];
  /**	String	名称，模糊查询	O	*/
  Name?: string;
  /**	String	中文描述，模糊查询	O	*/
  Description?: string;
  /**	Int32	分类	O	*/
  Category?: number;
  /**	String	对象属性路径，模糊查询	O	*/
  Path?: string;
  /**	Boolean	是否为数组	O	*/
  IsArray?: boolean;
  /**	Boolean	是否为复杂对象	O	*/
  IsObject?: boolean;
  /**	String	数据类型(枚举值使用Int32)：	O	*/
  DataType?: string;
  /**	Boolean	是否必填项	O	*/
  Mandatory?: boolean;
  /**	String	升序排列字段，数组字段无法排序	O	*/
  Asc?: string;
  /**	String	降序排列字段，数组字段无法排序	O	*/
  Desc?: string;
}

export class GetPartialDatasParams<T = any> extends PagedParams {
  /**	String[]	需要的属性ID，与Path二选一	D	*/
  PropertyIds?: string[];
  /**	ElemMatch[]	数组元素过滤条件	O	*/
  ElemMatches?: ElemMatch<T>[];
  /**	Condition[]	查询条件列表，多条件之间是AND关系。	O	*/
  Conditions?: Condition<T>[];
  /**	String	升序路径	O	*/
  Asc?: string;
  /**	String	降序路径	O	*/
  Desc?: string;
}
export class GetLabelsParams extends PagedParams {
  /**	Int32[]	标签ID	O	*/
  Ids?: number[];
  /**	String	名称，模糊查询	O	*/
  Name?: string;
  /**	Int32	状态，0-正常，1-注销	O	*/
  State?: number;
  /**	Int32	类别，用于区分不同类别的标签	O	*/
  Category?: number;
  /**	String	升序排列字段，数组字段无法排序	O	*/
  Asc?: string;
  /**	String	降序排列字段，数组字段无法排序	O	*/
  Desc?: string;
}

export class PartialRequest implements IParams {
  /**	String	修改原因	O	*/ ModificationReason?: string;
  /**	String	修改内容	O	*/ ModificationContent?: string;
  /**	PartialData	成功修改后的数据	O	*/ Data?: IPartialData;
}

export class GetProfileStateStatisticsParams extends DurationParams {
  /**	Int32[]	档案状态	O */
  ProfileStates?: number[];
}
export class GetPartialDatasExcelParams<T = any> implements IParams {
  /**	String[]	需要的属性ID，与Path二选一	D */
  PropertyIds?: string[];
  /**	ElemMatch[]	数组元素过滤条件	O */
  ElemMatches?: ElemMatch<T>[];
  /**	Condition[]	查询条件列表，多条件之间是AND关系。	O */
  Conditions?: Condition<T>[];
  /**	String[]	子表格冗余字段	O */
  SubTablePropertyIds?: string[];
  /**	String	升序路径	O */
  Asc?: string;
  /**	String	降序路径	O */
  Desc?: string;
}
