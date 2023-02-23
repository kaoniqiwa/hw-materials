import { Transform } from 'class-transformer';
import { MaterialItem } from 'src/app/network/entity/material-item.enitty';
import { transformNumber } from 'src/app/network/entity/transform.model';
import { IParams, PagedParams } from '../../IParams.interface';

export class GetGarbageProfilesMaterialsParams extends PagedParams {
  /**	String[]	ID	O	*/
  Ids?: string[];
  /**	String	名称，LIKE支持	O	*/
  Name?: string;
  /**	Int32	分类	O	*/
  @Transform(transformNumber)
  Category?: number;
}

export class PutInMaterialsParams implements IParams {
  /**	MaterialItem[]	入库物料列表	M	*/ MaterialItems!: MaterialItem[];
  /**	String	描述信息	O	*/ Description?: string;
  /**	String[]	存档照片列表	O	*/ ImageUrls?: string[];
}
export class PutOutMaterialsParams implements IParams {
  /**	MaterialItem[]	出库物料列表	M	*/ MaterialItems!: MaterialItem[];
  /**	String	描述信息	O	*/ Description?: string;
  /**	String	垃圾厢房档案ID	O	*/ ProfileId?: string;
  /**	String	档案名称	O	*/ ProfileName?: string;
  /**	String[]	存档照片列表	O	*/ ImageUrls?: string[];
}
