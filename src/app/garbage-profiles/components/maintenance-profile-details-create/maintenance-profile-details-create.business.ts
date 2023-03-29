import { Injectable } from '@angular/core';
import { ICreate } from 'src/app/common/interfaces/bussiness.interface';
import { MaintenanceProfile } from 'src/app/network/entity/maintenance-profile.entity';
import { CreateMaintenanceProfileParams } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';

@Injectable()
export class MaintenanceProfileDetailsCreateBusiness
  implements ICreate<MaintenanceProfile>
{
  constructor(private service: MaintenanceProfileRequestService) {}
  create(params: CreateMaintenanceProfileParams): Promise<MaintenanceProfile> {
    return this.service.create(params);
  }
}
