import { Injectable } from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { ViewModelConverter } from 'src/app/converter/view-model.converter';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { GarbageStationProfileTableConverter } from '../tables/garbage-station-profile-table/garbage-station-profile-table.converter';

@Injectable()
export class GarbageStationProfileDetailsBusiness {
  constructor(
    private _garbageStationProfilesRequest: GarbageStationProfilesRequestService
  ) {}

  getModel(id: string) {
    return this._garbageStationProfilesRequest.get(id);
  }
  createModel(model: GarbageStationProfile) {
    return this._garbageStationProfilesRequest.create(model);
  }
  updateModel(model: GarbageStationProfile) {
    return this._garbageStationProfilesRequest.update(model);
  }
}
