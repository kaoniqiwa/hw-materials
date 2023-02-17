import { PagedParams } from '../../IParams.interface';

export class GetGarbageProfilesBasicDivisionsParams extends PagedParams {
  /**	String[]	区划ID	O	*/
  Ids?: string[];
  /**	String	区划名称，模糊查询	O	*/
  Name?: string;
  /**	String	父ID	O	*/
  ParentId?: string;
  /**	Boolean	查询根节点区划	O	*/
  ParentIdIsNull?: boolean;
  /**	String	区划完整路径，上级节点在前，模糊查询，如果需要北京市下的全部区划，可以输入”,北京市,”	O	*/
  Path?: string;
  /**	String	缩写名称，模糊查询	O	*/
  AbbrName?: string;
  /**	String	升序排列字段，数组字段无法排序	O	*/
  Asc?: string;
  /**	String	降序排列字段，数组字段无法排序	O	*/
  Desc?: string;
}

export class GetGarbageProfilesBasicMaterialsParams extends PagedParams {
  /**	String[]	ID	O	*/ Ids?: string[];
  /**	String	名称，LIKE支持	O	*/ Name?: string;
  /**	Int32	分类	O	*/ Category?: number;
}
