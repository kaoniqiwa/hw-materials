import { Injectable } from '@angular/core';
import { ValueNamePair } from 'src/app/network/entity/value-name-pair.entity';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';

@Injectable({ providedIn: 'root' })
export class MaintenanceProfilesSourceTools {
  constructor(service: MaintenanceProfileRequestService) {
    service.property.getEnums().then((properties) => {
      for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        this[property.Name] = property.EnumeratedValues!;
      }
    });
  }

  [key: string]: ValueNamePair[];

  ProfileType: ValueNamePair[] = [];
  MaintenanceType: ValueNamePair[] = [];
  FaultType: ValueNamePair[] = [];
  ConstructionState: ValueNamePair[] = [];
  OutOfTime: ValueNamePair[] = [];
  ProfileState: ValueNamePair[] = [];
}
