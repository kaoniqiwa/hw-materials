import { Injectable } from '@angular/core';
import { stat } from 'fs';
import { ConditionOperator } from 'src/app/enum/condition-operator.enum';
import { PropertyCategory } from 'src/app/enum/property-category.enum';
import { PropertyDataType } from 'src/app/enum/property-data-type.enum';
import { Condition } from 'src/app/network/entity/condition.entity';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import {
  GetPartialDatasParams,
  GetPropertiesParams,
  PartialRequest,
} from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { PropertySearchInfo } from './garbage-profile-details.model';

@Injectable()
export class GarbageProfileDetailFormsBusiness {
  constructor(
    protected _garbageStationProfilesRequest: GarbageStationProfilesRequestService
  ) {}

  getModel(id: string) {
    return this._garbageStationProfilesRequest.get(id);
  }
  async getPartialData(id: string, propertyIds: string[]) {
    let params = new GetPartialDatasParams();
    params.PropertyIds = propertyIds;

    params.Conditions = [];

    let condition = new Condition();
    condition.Operator = ConditionOperator.Eq;
    condition.Value = id;
    condition.PropertyId = 'Id';
    params.Conditions.push(condition);

    let res = await this._garbageStationProfilesRequest.partialData.list(
      params
    );
    return res.Data[0];
  }

  async listProperty(searchInfo: PropertySearchInfo) {
    let params = new GetPropertiesParams();
    if (searchInfo.Category) params.Category = searchInfo.Category;
    if (searchInfo.Name) params.Name = searchInfo.Name;
    let res = await this._garbageStationProfilesRequest.property.list(params);
    return res.Data;
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
