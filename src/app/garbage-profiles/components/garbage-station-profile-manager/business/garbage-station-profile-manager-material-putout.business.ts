import { Injectable } from '@angular/core';
import { PutOutMaterialsParams } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';
import { GarbageProfilesMaterialRequestService } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.service';

@Injectable()
export class GarbageStationProfileManagerMaterialPutoutBusiness {
  constructor(private service: GarbageProfilesMaterialRequestService) {}

  putout(params: PutOutMaterialsParams) {
    return this.service.putout(params);
  }
}
