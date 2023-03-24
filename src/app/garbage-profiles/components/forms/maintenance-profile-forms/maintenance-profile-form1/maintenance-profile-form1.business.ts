import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';
import { ConditionOperator } from 'src/app/enum/condition-operator.enum';
import { Condition } from 'src/app/network/entity/condition.entity';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { GetPartialDatasParams } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';

@Injectable()
export class MaintenanceProfileForm1Business {
  constructor(
    private _garbageStationProfilesRequest: GarbageStationProfilesRequestService,
    private _maintenanceProfileRequest: MaintenanceProfileRequestService
  ) {}
  async getProfiles() {
    let params = new GetPartialDatasParams();
    params.PropertyIds = [
      'ProfileState',
      'ProfileName',
      'GarbageStationName',
      'Address',
      'Province',
      'City',
      'County',
      'Street',
      'Committee',
    ];
    params.Conditions = [];

    let condition = new Condition();
    condition.PropertyId = 'ProfileState';
    condition.Value = 6;
    condition.Operator = ConditionOperator.Eq;

    params.Conditions.push(condition);

    let { Data } = await this._garbageStationProfilesRequest.partialData.list(
      params
    );

    let res = plainToInstance(GarbageStationProfile, Data);
    return res;
  }
  getMaintenanceModel(id: string) {
    return this._maintenanceProfileRequest.get(id);
  }
}
