import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { MaintenanceProfile } from 'src/app/network/entity/maintenance-profile.entity';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import { ConstructionApplyParams } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';

@Injectable()
export class MaintenanceProfileDetailsConstructionApplyBusiness
  implements IBusiness<PartialData, MaintenanceProfile>
{
  constructor(private service: MaintenanceProfileRequestService) {}

  async load(id: string): Promise<MaintenanceProfile> {
    let data = await this.getData(id);
    let plain = instanceToPlain(data);
    let model = plainToInstance(MaintenanceProfile, plain);
    return model;
  }
  getData(id: string): Promise<PartialData> {
    return this.service.partialData.get(id, [
      'ConstructionReason',
      'ConstructionState',
    ]);
  }
  apply(id: string, params: ConstructionApplyParams) {
    return this.service.constructionApply(id, params);
  }
}
