import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { MaintenanceProfile } from 'src/app/network/entity/maintenance-profile.entity';
import { PutOutMaterialsParams } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';
import { GarbageProfilesMaterialRequestService } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.service';
import { SubmitMaintenanceProfileParams } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';

@Injectable()
export class MaintenanceProfileDetailsSubmitBusiness {
  constructor(
    private service: MaintenanceProfileRequestService,
    private material: GarbageProfilesMaterialRequestService
  ) {}

  async get(id: string): Promise<MaintenanceProfile> {
    let data = await this.service.partialData.get(id, [
      'GarbageStationProfileId',
      'GarbageStationName',
    ]);
    let plain = instanceToPlain(data);
    let model = plainToInstance(MaintenanceProfile, plain);
    return model;
  }

  submit(
    id: string,
    params: SubmitMaintenanceProfileParams
  ): Promise<MaintenanceProfile> {
    return this.service.submit(id, params);
  }

  putout(params: PutOutMaterialsParams) {
    return this.material.putout(params);
  }
}
