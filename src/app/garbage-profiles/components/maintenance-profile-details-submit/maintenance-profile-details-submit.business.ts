import { Injectable } from '@angular/core';
import { MaintenanceProfile } from 'src/app/network/entity/maintenance-profile.entity';
import { SubmitMaintenanceProfileParams } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';

@Injectable()
export class MaintenanceProfileDetailsSubmitBusiness {
  constructor(private service: MaintenanceProfileRequestService) {}

  submit(
    id: string,
    params: SubmitMaintenanceProfileParams
  ): Promise<MaintenanceProfile> {
    return this.service.submit(id, params);
  }
}
