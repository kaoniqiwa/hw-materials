import { Injectable } from '@angular/core';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';

@Injectable()
export class MaintenanceProfileDetailsCompleteBusiness {
  constructor(private service: MaintenanceProfileRequestService) {}

  complete(id: string) {
    return this.service.complete(id);
  }
}
