import { Injectable } from '@angular/core';
import { MaintenanceProfileBaseFormBusiness } from '../maintenance-profile-base-form/maintenance-profile-base-form.business';

@Injectable()
export class MaintenanceProfileForm1Business extends MaintenanceProfileBaseFormBusiness {
  getProfiles() {
    return this._garbageStationProfilesRequest.list();
  }
}
