import { MaterialItem } from '../network/entity/material-item.enitty';
import { IPartialData } from '../network/entity/partial-data.interface';

export class MaintenanceProfileModel implements IPartialData {
  Id!: string;
  /**	String	省	M	*/
  Province!: Promise<string>;
  /**	String	市	M	*/
  City!: Promise<string>;
  /**	String	区	M	*/
  County!: Promise<string>;
  /**	String	街道	M	*/
  Street!: Promise<string>;
  /**	String	居委会	M	*/
  Committee!: Promise<string>;
  /**	String	厢房档案ID	M	*/
  GarbageStationProfileId!: Promise<string>;
  /**	String	厢房名称	M	*/
  GarbageStationName!: Promise<string>;
  /**	String	厢房地址	M	*/
  GarbageStationAddress!: Promise<string>;
  /**	String	创建人员	M	*/
  CreationPersonnel!: Promise<string>;
  /**	String	创建账户ID	M	*/
  CreationUserId!: Promise<string>;
  /**	DateTime	创建时间	M	*/
  CreationTime!: Promise<Date>;
  /**	Int32	工单类型	M	*/
  ProfileType!: Promise<number>;
  /**	Int32	维修类型	M	*/
  MaintenanceType!: Promise<number>;
  /**	String	其他维修类型描述	O	*/
  MaintenanceDescription?: Promise<string>;
  /**	String	报修用户(用户报修必填)	O/D	*/
  Customer?: Promise<string>;
  /**	String	用户电话(用户报修必填)	O/D	*/
  CustomerPhoneNo?: Promise<string>;
  /**	Date	故障日期	O	*/
  FaultDate?: Promise<Date>;
  /**	String	派单人员	O	*/
  DistributionPersonnel?: Promise<string>;
  /**	String	派单账户ID	O	*/
  DistributionUserId?: Promise<string>;
  /**	DateTime	派单时间	O	*/
  DistributionTime?: Promise<Date>;
  /**	String	维修人员	O	*/
  MaintenancePersonnel?: Promise<string>;
  /**	String	维修账户ID	O	*/
  MaintenanceUserId?: Promise<string>;
  /**	DateTime	维修截至时间	O	*/
  MaintenanceDeadline?: Promise<Date>;
  /**	Int32	故障类型	O	*/
  FaultType?: Promise<number>;
  /**	String	其他故障描述	O	*/
  FaultDescription?: Promise<string>;
  /**	MaterialItem[]	物料项列表	O	*/
  MaterialItems?: Promise<MaterialItem[]>;
  /**	DateTime	维修完成时间	O	*/
  MaintenanceTime?: Promise<Date>;
  /**	String[]	维修现场照片	O	*/
  SceneImageUrls?: Promise<string[]>;
  /**	Int32	工程维修状态	O	*/
  ConstructionState?: Promise<number>;
  /**	String	工程维修原因	O	*/
  ConstructionReason?: Promise<string>;
  /**	DateTime	工程维修申请时间	O	*/
  ConstructionApplicationTime?: Promise<Date>;
  /**	String	工程维修审批原因	O	*/
  ConstructionApprovalReason?: Promise<string>;
  /**	DateTime	工程维修审批时间	O	*/
  ConstructionApprovalTime?: Promise<Date>;
  /**	String	确认完成人员	O	*/
  CompletionPersonnel?: Promise<string>;
  /**	String	确认完成账户ID	O	*/
  CompletionUserId?: Promise<string>;
  /**	DateTime	确认完成时间	O	*/
  CompletionTime?: Promise<Date>;
  /**	Int32	是否超期	O	*/
  OutOfTime?: Promise<number>;
  /**	DateTime	更新时间	M	*/
  UpdateTime!: Promise<Date>;
  /**	Int32	档案状态	M	*/
  ProfileState!: Promise<number>;
}
