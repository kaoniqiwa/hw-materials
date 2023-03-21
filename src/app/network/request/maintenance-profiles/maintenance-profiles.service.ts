import { Injectable } from '@angular/core';
import { instanceToPlain } from 'class-transformer';
import { ExcelUrl } from '../../entity/excel-url.entity';
import { MaintenanceProfile } from '../../entity/maintenance-profile.entity';
import { PartialData } from '../../entity/partial-data.interface';
import { ProfileStateStatisticResult } from '../../entity/profile-state-statistic-result.entity';
import { Property } from '../../entity/property.entity';
import { MaintenanceProfilesUrl } from '../../url/maintenance-profiles/maintenance-profiles.url';
import {
  BaseRequestService,
  BaseTypeRequestService,
} from '../base-request.service';
import { GetPropertiesParams } from '../garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { HowellAuthHttpService } from '../howell-auth-http.service';
import {
  ConstructionApplyParams,
  ConstructionApproveParams,
  CreateMaintenanceProfileParams,
  DistributeMaintenanceProfileParams,
  GetMaintenanceProfilePartialDatasExcelParams,
  GetMaintenanceProfilePartialDatasParams,
  GetMaintenanceProfilesParams,
  GetMaintenanceProfileStateStatisticsParams,
  SubmitMaintenanceProfileParams,
} from './maintenance-profiles.param';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceProfileRequestService {
  private basic: BaseRequestService;
  private type: BaseTypeRequestService<MaintenanceProfile>;
  constructor(_http: HowellAuthHttpService) {
    this.basic = new BaseRequestService(_http);
    this.type = this.basic.type(MaintenanceProfile);
  }

  create(instance: CreateMaintenanceProfileParams) {
    let url = MaintenanceProfilesUrl.basic;
    let plain = instanceToPlain(instance);
    return this.type.post(url, plain);
  }
  get(id: string) {
    let url = MaintenanceProfilesUrl.item(id);
    return this.type.get(url);
  }
  list(instance: GetMaintenanceProfilesParams) {
    let url = MaintenanceProfilesUrl.list();
    let plain = instanceToPlain(instance);
    return this.type.paged(url, plain);
  }
  distribute(id: string, instance: DistributeMaintenanceProfileParams) {
    let url = MaintenanceProfilesUrl.distribute(id);
    let plain = instanceToPlain(instance);
    return this.basic.post(url, MaintenanceProfile, plain);
  }
  constructionApply(id: string, instance: ConstructionApplyParams) {
    let url = MaintenanceProfilesUrl.constructionApply(id);
    let plain = instanceToPlain(instance);
    return this.basic.post(url, MaintenanceProfile, plain);
  }
  constructionApprove(id: string, instance: ConstructionApproveParams) {
    let url = MaintenanceProfilesUrl.constructionApprove(id);
    let plain = instanceToPlain(instance);
    return this.basic.post(url, MaintenanceProfile, plain);
  }
  submit(id: string, instance: SubmitMaintenanceProfileParams) {
    let url = MaintenanceProfilesUrl.submit(id);
    let plain = instanceToPlain(instance);
    return this.basic.post(url, MaintenanceProfile, plain);
  }
  complete(id: string) {
    let url = MaintenanceProfilesUrl.complete(id);
    return this.basic.post(url, MaintenanceProfile);
  }
  private _property?: MaintenanceProfilePropertiesRequestService;
  public get property(): MaintenanceProfilePropertiesRequestService {
    if (!this._property) {
      this._property = new MaintenanceProfilePropertiesRequestService(
        this.basic
      );
    }
    return this._property;
  }

  private _partialData?: MaintenanceProfilePartialDatasRequestService;
  public get partialData(): MaintenanceProfilePartialDatasRequestService {
    if (!this._partialData) {
      this._partialData = new MaintenanceProfilePartialDatasRequestService(
        this.basic
      );
    }
    return this._partialData;
  }

  private _statistic?: MaintenanceProfileStatisticsRequestService;
  public get statistic(): MaintenanceProfileStatisticsRequestService {
    if (!this._statistic) {
      this._statistic = new MaintenanceProfileStatisticsRequestService(
        this.basic
      );
    }
    return this._statistic;
  }
}
class MaintenanceProfilePropertiesRequestService {
  private type: BaseTypeRequestService<Property>;
  constructor(private basic: BaseRequestService) {
    this.type = this.basic.type(Property);
  }
  get(id: string) {
    let url = MaintenanceProfilesUrl.properties().item(id);
    return this.type.get(url);
  }
  update(instance: Property) {
    let url = MaintenanceProfilesUrl.properties().item(instance.Id);
    let plain = instanceToPlain(instance);
    return this.type.put(url, plain as Property);
  }
  delete(id: string) {
    let url = MaintenanceProfilesUrl.properties().item(id);
    return this.type.delete(url);
  }
  list(instance: GetPropertiesParams) {
    let url = MaintenanceProfilesUrl.properties().list();
    let plain = instanceToPlain(instance);
    return this.type.paged(url, plain);
  }
}
class MaintenanceProfilePartialDatasRequestService {
  private type: BaseTypeRequestService<PartialData>;
  constructor(private basic: BaseRequestService) {
    this.type = this.basic.type(PartialData);
  }
  list(instance: GetMaintenanceProfilePartialDatasParams) {
    let url = MaintenanceProfilesUrl.partialDatas().list();
    let plain = instanceToPlain(instance);
    return this.type.paged(url, plain);
  }

  excel(instance: GetMaintenanceProfilePartialDatasExcelParams) {
    let url = MaintenanceProfilesUrl.partialDatas().excels();
    let plain = instanceToPlain(instance);
    return this.basic.post(url, ExcelUrl, plain);
  }
}
class MaintenanceProfileStatisticsRequestService {
  constructor(private basic: BaseRequestService) {}
  state(instance: GetMaintenanceProfileStateStatisticsParams) {
    let url = MaintenanceProfilesUrl.statistic().state();
    let plain = instanceToPlain(instance);
    return this.basic.post(url, ProfileStateStatisticResult, plain);
  }
}
