/*
 * @Author: pmx
 * @Date: 2021-09-13 15:05:27
 * @Last Modified by: zzl
 * @Last Modified time: 2021-12-21 17:26:04
 */

import { AbstractUrl } from './abstract.url';
import { BasicUrl } from './base.url';

export class UserUrl extends AbstractUrl {
  private static url = new UserUrl(`${BasicUrl.user}/Users`);

  static basic() {
    return this.url.basic();
  }
  static item(id: string) {
    return this.url.item(id);
  }
  static list() {
    return this.url.list();
  }
  static login(username: string): string {
    return `${this.basic()}/Login/${username}`;
  }
}
