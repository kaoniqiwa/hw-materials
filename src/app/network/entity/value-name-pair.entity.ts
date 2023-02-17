import { IModel } from 'src/app/interface/model.interface';

/**	数值对	*/
export class ValueNamePair implements IModel {
  /**	Int32	数值	M	*/
  Value!: number;
  /**	String	名称	M	*/
  Name!: string;
}
