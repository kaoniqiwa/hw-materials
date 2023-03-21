import { AbstractUrl } from '../abstract.url';
import { BasicUrl } from '../base.url';

export abstract class MaintenanceProfilesUrl {
  static get basic(): string {
    return `${BasicUrl.garbage_profiles}/MaintenanceProfiles`;
  }

  /** /howell/ver10/data_service/medium/Pictures?ContentType=Fixed */
  static upload() {
    // return `${BasicUrl.data}/medium/Pictures?ContentType=Fixed`;
    return `${this.basic}?ContentType=Fixed`;
  }

  static list() {
    return `${this.basic}/List`;
  }

  static item(id: string) {
    return `${this.basic}/${id}`;
  }

  static distribute(id: string) {
    return `${this.item(id)}/Distribute`;
  }

  static constructionApply(id: string) {
    return `${this.item(id)}/ConstructionApply`;
  }
  static constructionApprove(id: string) {
    return `${this.item(id)}/ConstructionApprove`;
  }
  static submit(id: string) {
    return `${this.item(id)}/Submit`;
  }
  static complete(id: string) {
    return `${this.item(id)}/Complete`;
  }

  static properties() {
    return new MaintenanceProfilesPropertiesUrl(this.basic);
  }

  static partialDatas() {
    return new MaintenanceProfilesPartialDatasUrl(this.basic);
  }
  static statistic() {
    return new MaintenanceProfilesStatisticsUrl(this.basic);
  }
}

class MaintenanceProfilesPropertiesUrl extends AbstractUrl {
  constructor(base: string) {
    super(`${base}/Properties`);
  }
}
class MaintenanceProfilesPartialDatasUrl extends AbstractUrl {
  constructor(base: string) {
    super(`${base}/PartialDatas`);
  }

  excels() {
    return `${this.basic()}/Excels`;
  }
}

class MaintenanceProfilesStatisticsUrl extends AbstractUrl {
  constructor(base: string) {
    super(`${base}/Statistics`);
  }

  state() {
    return `${this.basic()}/ProfileState`;
  }
}
