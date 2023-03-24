import { Injectable } from '@angular/core';
import { ConditionOperator } from 'src/app/enum/condition-operator.enum';
import { Condition } from 'src/app/network/entity/condition.entity';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import {
  GetPartialDatasParams,
  GetPropertiesParams,
  PartialRequest,
} from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import {
  GetMaintenanceProfilePartialDatasParams,
  GetMaintenanceProfilePropertiesParams,
} from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';
import { GarbageProfileReactivePropertySearchInfo } from './garbage-profile-reactive-form.model';

@Injectable()
export class GarbageProfileReactiveFormBusiness {
  constructor(
    protected _garbageStationProfilesRequest: GarbageStationProfilesRequestService
  ) {}
  getModel(id: string) {
    return this._garbageStationProfilesRequest.get(id);
  }
  getPropertyByCategory(category: number) {
    return this.listProperty({
      Category: category,
    });
  }

  getPropertyByNames(
    searchInfos: Array<GarbageProfileReactivePropertySearchInfo>
  ) {
    return Promise.all(searchInfos.map((info) => this.listProperty(info)));
  }
  async listProperty(searchInfo: GarbageProfileReactivePropertySearchInfo) {
    let params = new GetPropertiesParams();
    if (searchInfo.Category) params.Category = searchInfo.Category;
    if (searchInfo.Name) params.Name = searchInfo.Name;
    return this._garbageStationProfilesRequest.property.list(params);
  }

  getPartialData(id: string, propertyIds: string[]) {
    let params = new GetPartialDatasParams();
    params.PropertyIds = propertyIds;

    params.Conditions = [];

    let condition = new Condition();
    condition.Operator = ConditionOperator.Eq;
    condition.Value = id;
    condition.PropertyId = 'Id';
    params.Conditions.push(condition);

    return this._garbageStationProfilesRequest.partialData.list(params);
  }
  createModel(model: GarbageStationProfile) {
    return this._garbageStationProfilesRequest.create(model);
  }
  updateModel(model: GarbageStationProfile) {
    return this._garbageStationProfilesRequest.update(model);
  }
  updatePartial(data: PartialRequest) {
    return this._garbageStationProfilesRequest.partialData.update(data);
  }
}
