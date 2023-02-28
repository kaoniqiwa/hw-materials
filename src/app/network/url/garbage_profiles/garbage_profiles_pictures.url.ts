import { BasicUrl } from '../base.url';

export abstract class PicturesUrl {
  static get basic(): string {
    return `${BasicUrl.garbage_profiles}/Medium/Pictures`;
  }

  /** /howell/ver10/data_service/medium/Pictures?ContentType=Fixed */
  static upload() {
    // return `${BasicUrl.data}/medium/Pictures?ContentType=Fixed`;
    return `${this.basic}?ContentType=Fixed`;
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
