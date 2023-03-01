import { UserConfigType } from 'src/app/enum/user-config-type.enum';
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

  static config(userId: string) {
    return new UserConfigUrl(this.item(userId));
  }
}

export class UserConfigUrl extends AbstractUrl {
  constructor(base: string) {
    super(`${base}/Config`);
  }
  override item<T = UserConfigType>(type: T) {
    return `${this.basic()}/${type}`;
  }
}
