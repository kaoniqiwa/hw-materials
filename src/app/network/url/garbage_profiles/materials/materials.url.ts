import { AbstractUrl } from '../../abstract.url';
import { BasicUrl } from '../../base.url';

export class GarbageProfilesMaterialsUrl {
  /** /api/howell/ver10/aiop_service/garbage_profiles/Materials */
  static get basic(): string {
    return `${BasicUrl.garbage_profiles}/Materials`;
  }

  static item(id: number) {
    return `${this.basic}/${id}`;
  }

  static list() {
    return `${this.basic}/List`;
  }

  static get category() {
    return new BasicMateriaCategoryUrl(this.basic);
  }
}

class BasicMateriaCategoryUrl extends AbstractUrl {
  constructor(base: string) {
    super(`${base}/Categories`);
  }
}
