import { Injectable } from '@angular/core';
import { Division } from 'src/app/network/entity/division.entity';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { GetGarbageProfilesBasicDivisionsParams } from 'src/app/network/request/garbage-profiles/basics/garbage-profiles-basics.params';
import { GarbageProfilesBasicRequestService } from 'src/app/network/request/garbage-profiles/basics/garbage-profiles-basics.service';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { GarbageProfileDetailFormsBusiness } from '../garbage-profile-details-form/garbage-profile-details-forms.business';
const NULL_KEY = 'null';

@Injectable()
export class GarbageProfileDetailsForm4Business extends GarbageProfileDetailFormsBusiness {
  constructor(
    _garbageStationProfilesRequest: GarbageStationProfilesRequestService,
    _garbageProfilesBasicRequest: GarbageProfilesBasicRequestService
  ) {
    super(_garbageStationProfilesRequest);
  }
}
