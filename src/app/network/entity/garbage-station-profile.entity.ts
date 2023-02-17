import { Transform } from 'class-transformer';
import { GarbageStationFunction } from 'src/app/enum/garbage-station-function.enum';
import { StrongCurrentWireMode } from 'src/app/enum/strong-current-wire-mode.enum';
import { YesOrNo } from 'src/app/enum/yes-or-no.enum';
import { IModel } from 'src/app/interface/model.interface';
import { Camera } from './camera.entity';
import { GPSPoint } from './gps-point.entity';
import { MaterialItem } from './material-item.enitty';
import { transformDateTime } from './transform.model';

/**	垃圾厢房档案	*/
export class GarbageStationProfile implements IModel {
  /**	String	档案ID	M	*/
  Id!: string;
  /**	String	建档名称	M	*/
  ProfileName!: string;
  /**	String	省：上海市(下拉框)	M	*/
  Province!: string;
  /**	String	市：上海市(下拉框)	M	*/
  City!: string;
  /**	String	区、县(下拉框)	M	*/
  County!: string;
  /**	String	街道、村(下拉框)	M	*/
  Street!: string;
  /**	String	居委会(手动填写)	M	*/
  Committee!: string;
  /**	String	地址，256字节以内，可以填写多个	O	*/
  Address?: string;
  /**	String	联系人	O	*/
  Contact?: string;
  /**	String	联系人电话	O	*/
  ContactPhoneNo?: string;
  /**	String	小区名称	O	*/
  CommunityName?: string;
  /**	Int32	强电拉线	O	*/
  StrongCurrentWire?: YesOrNo;
  /**	Int32	强电拉线方式(强电拉线:需要时必填)	O	*/
  StrongCurrentWireMode?: StrongCurrentWireMode;
  /**	Double	强电拉线长度，单位：米 (强电拉线:需要时必填)	O	*/
  StrongCurrentWireLength?: number;
  /**	String	厢房左前照片	O	*/
  LFImageUrl?: string;
  /**	String	厢房右前照片	O	*/
  RFImageUrl?: string;
  /**	String	厢房正面照片	O	*/
  FImageUrl?: string;
  /**	String	电源位置照片	O	*/
  PowerImageUrl?: string;
  /**	Int32	摄像机数量	O	*/
  CameraNumber?: number;
  /**	Int32[]	厢房功能，多选	O	*/
  Functions?: GarbageStationFunction[];
  /**	Int32	投放点类型	O	*/
  GarbageStationType?: number;
  /**	String	备注信息	O	*/
  Remarks?: string;
  /**	MaterialItem[]	物料项列表	O	*/
  MaterialItems?: MaterialItem[];
  /**	String	施工负责人	O	*/
  ConstructionContact?: string;
  /**	String	施工负责人电话	O	*/
  ConstructionContactPhoneNo?: string;
  /**	Date	施工日期	O	*/
  ConstructionDate?: Date;
  /**	GPSPoint	GPS经纬度坐标	O	*/
  GPSPoint?: GPSPoint;
  /**	String	投放时间：如20:00-23:00	O	*/
  TimeToDump?: string;
  /**	String	IMEI(电话号码)(可选)	O	*/
  IMEI?: string;
  /**	String	NB面板编号	O	*/
  NB?: string;
  /**	Camera[]	摄像机列表	O	*/
  Cameras?: Camera[];
  /**	Int32	档案状态	O	*/
  ProfileState?: number;
  /**	String	业务平台厢房ID	O	*/
  BsStationId?: string;
  /**	DateTime	建档日期	O	*/
  @Transform(transformDateTime)
  CreationTime?: Date;
  /**	DateTime	最后修改时间	O	*/
  @Transform(transformDateTime)
  UpdateTime?: Date;
  /**	Int32[]	自定义标签数组	O	*/
  Labels?: number[];
}
