import { MaterialRecordType } from 'src/app/enum/material-record-type.enum';
import { PagedDurationParams } from '../../IParams.interface';

export class GetModificationRecordsParams extends PagedDurationParams {
  /**	String[]	档案ID	O	*/
  ProfileIds?: string[];
  /**	Int32	档案类型	O	*/
  ProfileType?: number;
  /**	String	档案名称，LIKE	O	*/
  ProfileName?: string;
  /**	String	修改原因，LIKE	O	*/
  ModificationReason?: string;
  /**	String	修改内容，LIKE	O	*/
  ModificationContent?: string;
  /**	String	升序排列字段，数组字段无法排序	O	*/
  Asc?: string;
  /**	String	降序排列字段，数组字段无法排序	O	*/
  Desc?: string;
}

export class GetMaterialRecordsParams extends PagedDurationParams {
  /**	Int32	记录类型	O	*/
  MaterialRecordType?: MaterialRecordType;
  /**	String[]	档案ID	O	*/
  ProfileIds?: string[];
  /**	String	档案名称,LIKE	O	*/
  ProfileName?: string;
  /**	String	升序排列字段	O	*/
  Asc?: string;
  /**	String	降序排列字段	O	*/
  Desc?: string;

  /**	Int32[]	物料ID	O */
  MaterialIds?: number[];
  /**	String	物料名称,LIKE	O */
  MaterialName?: string;
}
