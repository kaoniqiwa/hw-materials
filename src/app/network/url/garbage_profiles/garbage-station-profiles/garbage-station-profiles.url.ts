import { AbstractUrl } from '../../abstract.url';
import { BasicUrl } from '../../base.url';

export class GarbageStationProfilesUrl {
  /** /api/howell/ver10/aiop_service/garbage_profiles/GarbageStationProfiles */
  static get basic(): string {
    return `${BasicUrl.garbage_profiles}/GarbageStationProfiles`;
  }

  static item(id: string) {
    return `${this.basic}/${id}`;
  }

  static list() {
    return `${this.basic}/List`;
  }

  static get property() {
    return new GarbageStationProfilesPropertiesUrl(this.basic);
  }
  static get partialData() {
    return new GarbageStationProfilesPartialDatasUrl(this.basic);
  }
  static get label() {
    return new GarbageStationProfilesLabelsUrl(this.basic);
  }
  static get statistic() {
    return new GarbageStationProfilesStatisticsUrl(this.basic);
  }
}

class GarbageStationProfilesPropertiesUrl extends AbstractUrl {
  constructor(base: string) {
    super(`${base}/Properties`);
  }
}

class GarbageStationProfilesPartialDatasUrl extends AbstractUrl {
  constructor(base: string) {
    super(`${base}/PartialDatas`);
  }

  excel() {
    return `${this.basic()}/Excels`;
  }
}

class GarbageStationProfilesLabelsUrl extends AbstractUrl {
  constructor(base: string) {
    super(`${base}/Labels`);
  }
}

class GarbageStationProfilesStatisticsUrl extends AbstractUrl {
  constructor(base: string) {
    super(`${base}/Statistics`);
  }

  profileState() {
    return `${this.basic()}/ProfileState`;
  }
}
