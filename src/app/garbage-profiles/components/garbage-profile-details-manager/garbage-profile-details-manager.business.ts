import { Injectable } from '@angular/core';
import { ConditionOperator } from 'src/app/enum/condition-operator.enum';
import { Condition } from 'src/app/network/entity/condition.entity';
import { GetPartialDatasParams } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';

@Injectable()
export class ProfileDetailsBusiness {
  constructor(
    private _garbageStationProfilesRequest: GarbageStationProfilesRequestService
  ) {}

  getModel(id: string) {
    return this._garbageStationProfilesRequest.get(id);
  }
  getProperty(id: string) {
    return this._garbageStationProfilesRequest.property.get(id);
  }
}
