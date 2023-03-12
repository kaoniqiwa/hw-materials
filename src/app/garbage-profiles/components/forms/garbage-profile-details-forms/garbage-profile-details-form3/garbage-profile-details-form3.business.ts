import { Injectable } from '@angular/core';
import { GarbageProfilesBasicRequestService } from 'src/app/network/request/garbage-profiles/basics/garbage-profiles-basics.service';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { GarbageProfileDetailFormsBusiness } from '../garbage-profile-details-forms.business';

@Injectable()
export class GarbageProfileDetailsForm3Business extends GarbageProfileDetailFormsBusiness {
  constructor(
    _garbageStationProfilesRequest: GarbageStationProfilesRequestService,
    _garbageProfilesBasicRequest: GarbageProfilesBasicRequestService
  ) {
    super(_garbageStationProfilesRequest);
  }
}
