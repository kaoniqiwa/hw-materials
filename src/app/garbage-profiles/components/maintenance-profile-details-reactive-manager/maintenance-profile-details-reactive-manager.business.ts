import { Injectable } from '@angular/core';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';

@Injectable()
export class MaintenanceProfileDetailsReactiveManagerBusiness {
  constructor(
    private _maintenanceProfileRequest: MaintenanceProfileRequestService
  ) {}
  getModel(id: string) {
    return this._maintenanceProfileRequest.get(id);
  }
}
