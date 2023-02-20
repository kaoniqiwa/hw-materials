import { Transform } from 'class-transformer';
import { IModel } from 'src/app/common/interfaces/model.interface';
import { Gender } from 'src/app/enum/gender.enum';
import { UserState } from 'src/app/enum/user-state.enum';

import { transformDateTime } from './transform.model';
export class User implements IModel {
  /// <signature>
  /// <summary>User</summary>
  /// <field name='Id' type='String'>唯一标识符 M</field>
  /// <field name='Username' type='String'>用户名 M</field>
  /// <field name='Password' type='String'>密码 O</field>
  /// <field name='PasswordHash' type='String'>密码HASH值 O</field>
  /// <field name='PasswordSalt' type='String'>密码SALT值 O</field>
  /// <field name='FirstName' type='String'>名字 O</field>
  /// <field name='LastName' type='String'>性 O</field>
  /// <field name='Gender' type='Int32'>性别 O</field>
  /// <field name='MobileNo' type='String'>手机号码 O</field>
  /// <field name='Email' type='String'>邮箱 O</field>
  /// <field name='Note' type='String'>描述信息 O</field>
  /// <field name='ExpiredTime' type='DateTime'>过期时间 M</field>
  /// <field name='CreateTime' type='DateTime'>创建时间 M</field>
  /// <field name='UpdateTime' type='DateTime'>更新时间 M</field>
  /// <field name='State' type='Int32'>0-正常 M</field>
  /// <field name='Role' type='Role[]'>用户角色列表 M</field>
  /// </signature>
  /**	String	唯一标识符	M	R */
  Id!: string;
  /**	String	用户名	M	RW */
  Username!: string;
  /**	String	密码	O	W */
  Password?: string;
  /**	String	密码HASH值	O	W */
  PasswordHash?: string;
  /**	String	密码SALT值	O	W */
  PasswordSalt?: string;
  /**	String	名字	O	RW */
  FirstName?: string;
  /**	String	姓	O	RW */
  LastName?: string;
  /**	Int32	性别	O	RW */
  Gender?: Gender;
  /**	String	手机号码	O	RW */
  MobileNo?: string;
  /**	String	邮箱	O	RW */
  Email?: string;
  /**	String	描述信息	O	RW */
  Note?: string;
  /**	DateTime	过期时间	M	RW */
  @Transform(transformDateTime)
  ExpiredTime!: Date;
  /**	DateTime	创建时间	M	R */
  @Transform(transformDateTime)
  CreateTime!: Date;
  /**	DateTime	更新时间	M	R */
  @Transform(transformDateTime)
  UpdateTime!: Date;
  /**	Int32	0-正常	M	R */
  State!: UserState;
  /**	String	微信OpenID	O	RW */
  OpenId?: string;
  /**	ResourceRole[]	资源列表	O	RW */
  Resources?: UserResource[];
  /**	String	服务器ID	O	R */
  ServerId?: string;
  /**	Boolean	是否可以分配微信子用户	O	R */
  CanCreateWeChatUser?: boolean;
  /**	String	创建者	O	R */
  CreatorId?: string;
  /**	Int32[]	停止推送的事件类型	O	RW */
  OffEvents?: number[];
}

export class UserResource implements IModel {
  /**	String	资源ID	M	R */
  Id!: string;
  /**	String	资源名称	O	R */
  Name?: string;

  /**	Int32	资源标签，权限级别	M	R */
  RoleFlags!: number;
  /**	Boolean	开放全部的子节点资源	M	R */
  AllSubResources!: boolean;
  /**	ResourceRole[]	子资源列表	O	R */
  Resources?: UserResource;
}
