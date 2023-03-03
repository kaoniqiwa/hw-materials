import { Transform } from 'class-transformer';
import { IModel } from 'src/app/common/interfaces/model.interface';
import { MaterialRecordType } from 'src/app/enum/material-record-type.enum';
import { MaterialRecordItem } from './material-item.enitty';
import { transformDateTime } from './transform.model';

/**	物料库存出入库记录	*/
export class MaterialRecord implements IModel {
  /**	String	记录ID	M	*/
  Id!: string;
  /**	Int32	记录类型	O	*/
  MaterialRecordType?: MaterialRecordType;
  /**	DateTime	创建时间	M	*/
  @Transform(transformDateTime)
  CreationTime!: Date;
  /**	String	文档ID	O	*/
  ProfileId?: string;
  /**	String	文档名称	O	*/
  ProfileName?: string;
  /**	MaterialItem[]	入库\出库物料列表	M	*/
  MaterialItems!: MaterialRecordItem[];
  /**	String	描述信息	O	*/
  Description?: string;
  /**	String[]	存档照片列表	O	*/
  ImageUrls?: string[];
  /**	String	修改人员名称	O */
  UserLastName?: string;
  /**	String	用户ID	M */
  UserId!: string;
}
