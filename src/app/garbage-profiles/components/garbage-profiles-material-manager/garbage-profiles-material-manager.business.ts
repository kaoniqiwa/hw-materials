import { Injectable } from '@angular/core';
import {
  PutInMaterialsParams,
  PutOutMaterialsParams,
} from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';
import { GarbageProfilesMaterialRequestService } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.service';
import { GarbageProfilesMediumRequestService } from 'src/app/network/request/garbage-profiles/mediums/garbage-profiles-medium.service';

@Injectable()
export class GarbageProfilesMaterialManagerBusiness {
  constructor(
    private service: GarbageProfilesMaterialRequestService,
    private medium: GarbageProfilesMediumRequestService
  ) {}

  async putin(params: PutInMaterialsParams) {
    return this.service.putin(params);
  }
  async putout(params: PutOutMaterialsParams) {
    return this.service.putout(params);
  }
}
