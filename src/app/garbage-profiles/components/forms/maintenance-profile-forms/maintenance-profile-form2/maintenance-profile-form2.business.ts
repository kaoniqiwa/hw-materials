import { Injectable } from '@angular/core';
import { ContractsRequestService } from 'src/app/network/request/contracts/contacts.service';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';

@Injectable()
export class MaintenanceProfileForm2Business {
  constructor(
    private _contractsRequest: ContractsRequestService,
    private _maintenanceProfileRequest: MaintenanceProfileRequestService
  ) {}

  listContracts() {
    return this._contractsRequest.array();
  }
  getMaintenanceModel(id: string) {
    return this._maintenanceProfileRequest.get(id);
  }
}
