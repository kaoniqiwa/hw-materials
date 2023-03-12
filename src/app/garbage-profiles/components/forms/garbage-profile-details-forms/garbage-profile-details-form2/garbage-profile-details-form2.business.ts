import { Injectable } from '@angular/core';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { PutOutMaterialsParams } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';
import { GarbageProfilesMaterialRequestService } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.service';
import { GarbageProfileDetailFormsBusiness } from '../garbage-profile-details-forms.business';

@Injectable()
export class GarbageProfileDetailsForm2Business extends GarbageProfileDetailFormsBusiness {
  constructor(
    private _GarbageProfilesMaterialRequest: GarbageProfilesMaterialRequestService,
    _garbageStationProfilesRequest: GarbageStationProfilesRequestService
  ) {
    super(_garbageStationProfilesRequest);
  }
  putout(params: PutOutMaterialsParams) {
    return this._GarbageProfilesMaterialRequest.putout(params);
  }
}
