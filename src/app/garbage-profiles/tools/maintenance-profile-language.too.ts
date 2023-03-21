import { Injectable } from '@angular/core';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';

@Injectable({ providedIn: 'root' })
export class MaintenanceProfilesLanguageTools {
  constructor(service: MaintenanceProfileRequestService) {
    service.property.all().then((properties) => {
      properties.forEach((property) => {
        this[property.Name] = property.Description;
      });
    });
    service.property.getEnums().then((properties) => {
      properties.forEach((property) => {
        property.EnumeratedValues?.forEach((_enum) => {
          this[`${property.Name}-${_enum.Value}`] = _enum.Name;
        });
      });
    });
  }
  [key: string]: string;
}
