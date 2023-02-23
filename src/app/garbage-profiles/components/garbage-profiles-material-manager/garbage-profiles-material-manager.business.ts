import { Injectable } from '@angular/core';
import { PutInMaterialsParams } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';
import { GarbageProfilesMaterialRequestService } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.service';

@Injectable()
export class GarbageProfilesMaterialManagerBusiness {
  constructor(private service: GarbageProfilesMaterialRequestService) {}

  putin(params: PutInMaterialsParams) {
    this.service.putin(params);
  }
}
