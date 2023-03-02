import { Injectable } from '@angular/core';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';

@Injectable({ providedIn: 'root' })
export class GarbageStationProfilesLanguageTools {
  constructor(service: GarbageStationProfilesRequestService) {
    GarbageStationProfile.getKeys().forEach((key) => {
      service.property.language(key).then((x) => {
        this[key] = x;
      });
    });
  }
  [key: string]: string;
}
