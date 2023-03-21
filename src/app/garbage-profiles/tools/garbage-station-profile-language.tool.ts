import { Injectable } from '@angular/core';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';

@Injectable({ providedIn: 'root' })
export class GarbageStationProfilesLanguageTools {
  constructor(service: GarbageStationProfilesRequestService) {
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
