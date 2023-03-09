import { Injectable } from '@angular/core';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { GarbageProfileDetailFormsBusiness } from '../garbage-profile-details-forms.business';

@Injectable()
export class GarbageProfileDetailsForm2Business extends GarbageProfileDetailFormsBusiness {
  constructor(
    _garbageStationProfilesRequest: GarbageStationProfilesRequestService
  ) {
    super(_garbageStationProfilesRequest);
  }
}
