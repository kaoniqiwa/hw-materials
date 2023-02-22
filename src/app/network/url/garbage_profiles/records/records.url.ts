import { AbstractUrl } from '../../abstract.url';
import { BasicUrl } from '../../base.url';

export class GarbageProfilesRecordsUrl {
  /** /api/howell/ver10/aiop_service/garbage_profiles/Records */
  static get basic(): string {
    return `${BasicUrl.garbage_profiles}/Records`;
  }

  static get modification() {
    return new ModificationRecordsUrl(this.basic);
  }

  static get material() {
    return new MaterialRecordsUrl(this.basic);
  }
}

class ModificationRecordsUrl extends AbstractUrl {
  constructor(base: string) {
    super(`${base}/ModificationRecords`);
  }
}

class MaterialRecordsUrl extends AbstractUrl {
  constructor(base: string) {
    super(`${base}/MaterialRecords`);
  }
}
