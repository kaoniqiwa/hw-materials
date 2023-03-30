import { Injectable } from '@angular/core';
import { MaintenanceProfile } from 'src/app/network/entity/maintenance-profile.entity';
import { ContractsRequestService } from 'src/app/network/request/contracts/contacts.service';
import { DistributeMaintenanceProfileParams } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';

@Injectable()
export class MaintenanceProfileDetailsDistributeBusiness {
  constructor(
    private service: MaintenanceProfileRequestService,
    private contracts: ContractsRequestService
  ) {}
  distribute(
    id: string,
    params: DistributeMaintenanceProfileParams
  ): Promise<MaintenanceProfile> {
    return this.service.distribute(id, params);
  }

  get() {
    return this.contracts.array();
  }
}
