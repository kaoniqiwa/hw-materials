import { Injectable } from '@angular/core';
import { MaintenanceProfile } from 'src/app/network/entity/maintenance-profile.entity';
import { DistributeMaintenanceProfileParams } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';

@Injectable()
export class MaintenanceProfileDetailsDistributeBusiness {
  constructor(private service: MaintenanceProfileRequestService) {}
  distribute(
    id: string,
    params: DistributeMaintenanceProfileParams
  ): Promise<MaintenanceProfile> {
    return this.service.distribute(id, params);
  }
}
