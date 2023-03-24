import { Injectable } from '@angular/core';
import { MaintenanceProfileReactiveFormBusiness } from '../maintenance-profile-reactive-form/maintenance-profile-reactive-form.business';

@Injectable()
export class MaintenanceProfileReactiveForm1Business extends MaintenanceProfileReactiveFormBusiness {
  getProfiles() {
    return this._garbageStationProfilesRequest.list();
  }
}
