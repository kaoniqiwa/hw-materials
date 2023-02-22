import { Transform } from 'class-transformer';
import { IModel } from 'src/app/common/interfaces/model.interface';
import { transformDateTime } from './transform.model';

/**	修改记录	*/
export class ModificationRecord implements IModel {
  /**	String	记录ID	M	*/ Id!: string;
  /**	Int32	文档类型：	M	*/ ProfileType!: number;
  /**	String	文档ID	M	*/ ProfileId!: string;
  /**	String	文档名称	O	*/ ProfileName?: string;
  /**	DateTime	创建时间	M	*/ @Transform(transformDateTime) CreationTime!: Date;
  /**	String	修改原因	O	*/ ModificationReason?: string;
  /**	String	修改内容	O	*/ ModificationContent?: string;
  /**	String	JSON修改内容Base64编码	O	*/ JsonContent?: string;
}
