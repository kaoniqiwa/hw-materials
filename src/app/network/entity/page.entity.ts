import { IModel } from 'src/app/interface/model.interface';

/**	分页信息	*/
export class Page implements IModel {
  /**	Int32	页码 1.2.3 …..	M	*/
  PageIndex!: number;
  /**	Int32	分页大小	M	*/
  PageSize!: number;
  /**	Int32	总页数	M	*/
  PageCount!: number;
  /**	Int32	当前页的记录数目	M	*/
  RecordCount!: number;
  /**	Int32	总记录数目	M	*/
  TotalRecordCount!: number;
}

/**	分页数据	*/
export class PagedList<T> implements IModel {
  /**	Page	分页信息	M	*/
  Page!: Page;
  /**	T[]	数据内容，T为任何需要的类型	M	*/
  Data!: T[];
}
