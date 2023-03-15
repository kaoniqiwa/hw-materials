import { Injectable } from '@angular/core';
import { stat } from 'fs';
import { ConditionOperator } from 'src/app/enum/condition-operator.enum';
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

@Injectable()
export class GarbageProfileDetailFormsBusiness {
  constructor(
    private _garbageStationProfilesRequest: GarbageStationProfilesRequestService
  ) {}

  getModel(id: string) {
    return this._garbageStationProfilesRequest.get(id);
  }
  async getModelByState(id: string, state: number) {
    let params2 = new GetPropertiesParams();
    params2.Category = state;
    let properties = await this._garbageStationProfilesRequest.property.list(
      params2
    );
    let params = new GetPartialDatasParams();
    params.PropertyIds = properties.Data.map((x) => x.Name);
    params.Conditions = [];

    let condition = new Condition();
    condition.Operator = ConditionOperator.Eq;
    condition.Value = id;
    condition.PropertyId = 'Id';
    params.Conditions?.push(condition);
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
