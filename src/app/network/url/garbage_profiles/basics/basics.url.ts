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

  static get profile() {
    return new BasicProfilesUrl(this.basic);
  }
}

class BasicDivisionUrl extends AbstractUrl {
  constructor(base: string) {
    super(`${base}/Divisions`);
  }
}

class BasicProfilesUrl extends AbstractUrl {
  constructor(base: string) {
    super(`${base}/Profiles`);
  }

  type() {
    return `${this.basic()}/Types`;
  }
}
