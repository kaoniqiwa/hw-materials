import { Injectable } from '@angular/core';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { PutOutMaterialsParams } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';
import { GarbageProfilesMaterialRequestService } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.service';
import { GarbageProfileReactiveFormBusiness } from '../garbage-profile-reactive-form/garbage-profile-reactive-form.business';

@Injectable()
export class GarbageProfileReactiveForm2Business extends GarbageProfileReactiveFormBusiness {
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
