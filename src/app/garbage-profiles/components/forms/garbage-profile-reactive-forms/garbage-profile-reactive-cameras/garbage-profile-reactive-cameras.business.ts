import { Injectable } from '@angular/core';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';

@Injectable()
export class GarbageProfileReactiveCamerasBusiness {
  constructor(
    private _garbageStationProfilesRequest: GarbageStationProfilesRequestService
  ) {}
  getModel(id: string) {
    return this._garbageStationProfilesRequest.get(id);
  }
}
