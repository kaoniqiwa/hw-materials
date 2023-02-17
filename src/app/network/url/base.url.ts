/*
 * @Author: pmx
 * @Date: 2021-09-13 15:05:38
 * @Last Modified by: pmx
 * @Last Modified time: 2022-11-03 14:46:28
 */
// const BaseAiopUrl = '/api/howell/ver10/aiop_service';
// const BaseGarbageUrl = '/api/howell/ver10/aiop_service/garbage_management';
// const BaseUserUrl = '/howell/ver10/data_service/user_system';
// const BaseSmsUrl = '/howell/ver10/data_service/short_message/sms';

// 垃圾清运
// const BaseGarbageVehicleUrl = '/api/howell/ver10/aiop_service/garbage_vehicles';

// export interface InnerUrl {
//   basic(): string;
// }

// export {
//   BaseGarbageUrl,
//   BaseUserUrl,
//   BaseAiopUrl,
//   BaseSmsUrl,
//   BaseGarbageVehicleUrl,
// };

export class BasicUrl {
  /** /howell/ver10 */
  static get basic() {
    return '/howell/ver10';
  }
  /** /api/howell/ver10 */
  static get api() {
    return `/api${this.basic}`;
  }
  /** /api/howell/ver10/aiop_service */
  static get aiop() {
    return `${this.api}/aiop_service`;
  }
  /** /howell/ver10/data_service */
  static get data() {
    return `${this.basic}/data_service`;
  }
  /** /howell/ver10/data_service/user_system */
  static get user() {
    return `${this.data}/user_system`;
  }
  /** /howell/ver10/data_service/short_message/sms */
  static get sms() {
    return `${this.data}/short_message/sms`;
  }
  /** /api/howell/ver10/aiop_service/struct_service */
  static get struct() {
    return `${this.aiop}/struct_service`;
  }

  private static _garbage?: GarbageBasicUrl;
  static get garbage() {
    if (!this._garbage) {
      this._garbage = new GarbageBasicUrl(this.aiop);
    }
    return this._garbage;
  }
}

class GarbageBasicUrl {
  constructor(private aiop: string) {}

  /** /api/howell/ver10/aiop_service/garbage_ */
  private get current() {
    return `${this.aiop}/garbage_`;
  }
  /** /api/howell/ver10/aiop_service/garbage_management */
  get management() {
    return `${this.current}management`;
  }
  /** /api/howell/ver10/aiop_service/garbage_vehicles */
  get vehicle() {
    return `${this.current}vehicles`;
  }
  /** /api/howell/ver10/aiop_service/garbage_profiles */
  get profiles() {
    return `${this.current}profiles`;
  }
}
