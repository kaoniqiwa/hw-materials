import { Transform } from 'class-transformer';
import { IIdModel } from 'src/app/common/interfaces/model.interface';
import { MaterialItem } from './material-item.enitty';
import { transformDateTime } from './transform.model';

/**	维修工单档案	*/

export class MaintenanceProfile implements IIdModel {
  /**	String	工单号	M	*/
  Id!: string;
  /**	String	省	M	*/
  Province!: string;
  /**	String	市	M	*/
  City!: string;
  /**	String	区	M	*/
  County!: string;
  /**	String	街道	M	*/
  Street!: string;
  /**	String	居委会	M	*/
  Committee!: string;
  /**	String	厢房档案ID	M	*/
  GarbageStationProfileId!: string;
  /**	String	厢房名称	M	*/
  GarbageStationName!: string;
  /**	String	厢房地址	M	*/
  GarbageStationAddress!: string;
  /**	String	创建人员	M	*/
  CreationPersonnel!: string;
  /**	String	创建账户ID	M	*/
  CreationUserId!: string;
  /**	DateTime	创建时间	M	*/
  @Transform(transformDateTime) CreationTime!: Date;
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
  /**	Date	故障日期	O	*/
  FaultDate?: Date;
  /**	String	派单人员	O	*/
  DistributionPersonnel?: string;
  /**	String	派单账户ID	O	*/
  DistributionUserId?: string;
  /**	DateTime	派单时间	O	*/
  @Transform(transformDateTime) DistributionTime?: Date;
  /**	String	维修人员	O	*/
  MaintenancePersonnel?: string;
  /**	String	维修账户ID	O	*/
  MaintenanceUserId?: string;
  /**	DateTime	维修截至时间	O	*/
  @Transform(transformDateTime)
  MaintenanceDeadline?: Date;
  /**	Int32	故障类型	O	*/
  FaultType?: number;
  /**	String	其他故障描述	O	*/
  FaultDescription?: string;
  /**	MaterialItem[]	物料项列表	O	*/
  MaterialItems?: MaterialItem[];
  /**	DateTime	维修完成时间	O	*/
  @Transform(transformDateTime)
  MaintenanceTime?: Date;
  /**	String[]	维修现场照片	O	*/
  SceneImageUrls?: string[];
  /**	Int32	工程维修状态	O	*/
  ConstructionState?: number;
  /**	String	工程维修原因	O	*/
  ConstructionReason?: string;
  /**	DateTime	工程维修申请时间	O	*/
  @Transform(transformDateTime)
  ConstructionApplicationTime?: Date;
  /**	String	工程维修审批原因	O	*/
  ConstructionApprovalReason?: string;
  /**	DateTime	工程维修审批时间	O	*/
  @Transform(transformDateTime)
  ConstructionApprovalTime?: Date;
  /**	String	确认完成人员	O	*/
  CompletionPersonnel?: string;
  /**	String	确认完成账户ID	O	*/
  CompletionUserId?: string;
  /**	DateTime	确认完成时间	O	*/
  @Transform(transformDateTime)
  CompletionTime?: Date;
  /**	Int32	是否超期	O	*/
  OutOfTime?: number;
  /**	DateTime	更新时间	M	*/
  @Transform(transformDateTime) UpdateTime!: Date;
  /**	Int32	档案状态	M	*/
  ProfileState!: number;
}
