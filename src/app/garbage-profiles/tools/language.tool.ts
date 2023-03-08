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
  }
  [key: string]: string;
}
