import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';

export abstract class DetailFormsBusiness {
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
