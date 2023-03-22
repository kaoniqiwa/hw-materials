export class Contact {
  /**	String	联系人ID	M */
  Id!: string;
  /**	String	联系人姓名	M */
  Name!: string;
  /**
   * 	Int32	用户类型
   *  1:管理员
   *  2:维修管理人员
   *  3:维修人员
   * 	O
   */
  UserType?: number;
  /**	String	手机号码	O */
  MobileNo?: string;
}
