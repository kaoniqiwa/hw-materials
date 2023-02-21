import { AbstractUrl } from '../../abstract.url';
import { BasicUrl } from '../../base.url';

export class GarbageProfilesBasicsUrl {
  /** /api/howell/ver10/aiop_service/garbage_profiles/Basics */
  static get basic(): string {
    return `${BasicUrl.garbage_profiles}`;
  }

  static get division() {
    return new BasicDivisionUrl(this.basic);
  }
  static get material() {
    return new BasicMaterialUrl(this.basic);
  }
}

class BasicDivisionUrl extends AbstractUrl {
  constructor(base: string) {
    super(`${base}/Divisions`);
  }
}

class BasicMaterialUrl extends AbstractUrl {
  constructor(base: string) {
    super(`${base}/Materials`);
  }

  get category() {
    return new BasicMateriaCategoryUrl(this.basic());
  }
}

class BasicMateriaCategoryUrl extends AbstractUrl {
  constructor(base: string) {
    super(`${base}/Categories`);
  }
}
