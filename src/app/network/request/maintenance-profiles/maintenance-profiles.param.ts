import { Transform } from 'class-transformer';
import { Condition } from '../../entity/condition.entity';
import { ElemMatch } from '../../entity/elem-match.entity';
import { MaterialItem } from '../../entity/material-item.enitty';
import { transformDate, transformDateTime } from '../../entity/transform.model';
import { DurationParams, IParams, PagedParams } from '../IParams.interface';

export class CreateMaintenanceProfileParams implements IParams {
  /**	String	厢房档案ID	M	*/
  GarbageStationProfileId!: string;
  /**	Int32	工单类型	M	*/
  ProfileType!: number;
  /**	Int32	维修类型	M	*/
  MaintenanceType!: number;
  /**	String	其他维修类型描述	O	*/
  MaintenanceDescription?: string;
  /**	String	报修用户(用户报修必填)	O/D	*/
  Customer?: string;
  /**	String	用户电话(用户报修必填)	O/D	*/
  CustomerPhoneNo?: string;
  /**	Date	故障日期(用户报修必填)	O/D	*/
  @Transform(transformDate)
  FaultDate?: Date;
}

export class GetMaintenanceProfilesParams extends PagedParams {
  /**	String[]	垃圾厢房档案ID	O	*/
  Ids?: string[];
}

export class GetMaintenanceProfilePropertiesParams extends PagedParams {
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
  /**	String	降序排列字段	O	*/
  Desc?: string;
}
export class GetMaintenanceProfilePartialDatasParams<
  T = any
> extends PagedParams {
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

export class ConstructionApproveParams implements IParams {
  /**	String	不同意原因	O	*/
  ConstructionApprovalReason?: string;
  /**	Boolean	是否同意，true：同意，false：不同意	M	*/
  ApproveOrNot!: boolean;
  /**	DateTime	维修截至时间，如果同意，需要重新填写截至时间	O/D	*/
  @Transform(transformDateTime)
  MaintenanceDeadline?: Date;
}
export class SubmitMaintenanceProfileParams implements IParams {
  /**	Boolean	维修结果，	M	*/
  Repaired!: boolean;
  /**	Int32	故障类型(未完成可以不填写)	O	*/
  FaultType?: number;
  /**	String	其他故障描述	O	*/
  FaultDescription?: string;
  /**	MaterialItem[]	物料项列表	O	*/
  MaterialItems?: MaterialItem[];
  /**	String[]	维修现场照片，至少一张照片	M	*/
  SceneImageUrls!: string[];
}
export class DistributeMaintenanceProfileParams implements IParams {
  /**	String	维修人员	M */
  MaintenanceUserId?: string;
  /**	DateTime	维修截至时间	O */
  @Transform(transformDateTime)
  MaintenanceDeadline?: Date;
}
export class ConstructionApplyParams implements IParams {
  /**	String	申请原因	M */
  ConstructionReason!: string;
}
export class GetMaintenanceProfilePartialDatasExcelParams implements IParams {
  /**	String[]	需要的属性ID，与Path二选一	D */
  PropertyIds?: string[];
  /**	ElemMatch[]	数组元素过滤条件	O */
  ElemMatches?: ElemMatch[];
  /**	Condition[]	查询条件列表，多条件之间是AND关系。	O */
  Conditions?: Condition[];
  /**	String[]	子表格冗余字段	O */
  SubTablePropertyIds?: string[];
  /**	String	升序路径	O */
  Asc?: string;
  /**	String	降序路径	O */
  Desc?: string;
}

export class GetMaintenanceProfileStateStatisticsParams extends DurationParams {
  /**	Int32[]	档案状态	O */
  ProfileStates?: number[];
}
