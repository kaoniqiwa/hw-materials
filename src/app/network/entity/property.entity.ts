import { IModel } from 'src/app/common/interfaces/model.interface';
import { PropertyCategory } from 'src/app/enum/property-category.enum';
import { ValueNamePair } from './value-name-pair.entity';

/**	对象属性	*/
export class Property implements IModel {
  /**	String	唯一ID 	M	*/
  Id!: string;
  /**	String	属性名称，只能出现英文+数字+下划线，不允许数字开头	M	*/
  Name!: string;
  /**	String	中文描述	M	*/
  Description!: string;
  /**	Int32[]	分类，	M	*/
  Category!: PropertyCategory;
  /**	String	对象属性路径，注意同一个对象的属性路径不能重复。路径中间使用.分割。	M	*/
  Path!: string;
  /**	String	父属性ID，根属性没有父属性ID	O	*/
  ParentId?: string;
  /**	Boolean	是否为数组	O	*/
  IsArray?: boolean;
  /**	Boolean	是否为复杂对象	O	*/
  IsObject?: boolean;
  /**	Boolean	唯一键	O	*/
  IsUnique?: boolean;
  /**	Boolean	是否建立索引	O	*/
  IsIndex?: boolean;
  /**	Boolean	是否必填项	O	*/
  Mandatory?: boolean;
  /**	String	数据类型(枚举值使用Int32)：	O	*/
  DataType?: string;

  /**	ValueNamePair[]	枚举值对应列表	O	*/
  EnumeratedValues?: ValueNamePair[];
  /**	String	正则表达式	O	*/
  RegexValue?: string;
  /**	String	唯一键属性ID，只有类型是对象数组的时候有用	O	*/
  UniquePropertyId?: string;
  /**	String[]	其他复合索引属性ID	O	*/
  CompositeIndexes?: string[];
}
