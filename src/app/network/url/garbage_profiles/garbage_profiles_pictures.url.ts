import { BasicUrl } from '../base.url';

export abstract class PicturesUrl {
  protected static get basic(): string {
    return `${BasicUrl.garbage.profiles}/Medium/Pictures`;
  }
  static create() {
    return this.basic;
  }

  static item(id: string) {
    return `${this.basic}/${id}`;
  }
  static binary() {
    return `${this.basic}/Binary`;
  }
  static fromFile() {
    return `${this.basic}/FromFile`;
  }
  static data(id: string) {
    return `${this.basic}/${id}/Data`;
  }
  static jpg(id: string) {
    return `${this.basic}/${id}.jpg`;
  }
}
