import { AbstractUrl } from '../../abstract.url';
import { BasicUrl } from '../../base.url';

export class GarbageProfilesBasicsUrl {
  /** /api/howell/ver10/aiop_service/garbage_profiles/Basics */
  static get basic(): string {
    return `${BasicUrl.garbage_profiles}/Basics`;
  }

  static get division() {
    return new BasicDivisionUrl(this.basic);
  }
}

class BasicDivisionUrl extends AbstractUrl {
  constructor(base: string) {
    super(`${base}/Divisions`);
  }
}
