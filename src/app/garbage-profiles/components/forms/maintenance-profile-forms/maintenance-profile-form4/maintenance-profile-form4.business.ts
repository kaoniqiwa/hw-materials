import { Injectable } from '@angular/core';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';

@Injectable()
export class MaintenanceProfileForm4Business {
  constructor(
    private _maintenanceProfileRequest: MaintenanceProfileRequestService
  ) {}
  getMaintenanceModel(id: string) {
    return this._maintenanceProfileRequest.get(id);
  }
}
