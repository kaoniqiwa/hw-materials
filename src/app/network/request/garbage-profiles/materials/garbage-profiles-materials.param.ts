import { Transform } from 'class-transformer';
import { transformNumber } from 'src/app/network/entity/transform.model';
import { PagedParams } from '../../IParams.interface';

export class GetGarbageProfilesMaterialsParams extends PagedParams {
  /**	String[]	ID	O	*/
  Ids?: string[];
  /**	String	名称，LIKE支持	O	*/
  Name?: string;
  /**	Int32	分类	O	*/
  @Transform(transformNumber)
  Category?: number;
}
