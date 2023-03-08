import { Injectable } from '@angular/core';
import { ValueNamePair } from 'src/app/network/entity/value-name-pair.entity';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';

@Injectable({ providedIn: 'root' })
export class GarbageStationProfilesSourceTools {
  constructor(service: GarbageStationProfilesRequestService) {
    service.property.getEnums().then((properties) => {
      for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        this[property.Name] = property.EnumeratedValues!;
      }
    });
  }

  [key: string]: ValueNamePair[];

  StrongCurrentWire: ValueNamePair[] = [];
  StrongCurrentWireMode: ValueNamePair[] = [];
  Functions: ValueNamePair[] = [];
  GarbageStationType: ValueNamePair[] = [];
  Model: ValueNamePair[] = [];
  AccessServer: ValueNamePair[] = [];
  Resolution: ValueNamePair[] = [];
  StorageTime: ValueNamePair[] = [];
  ActionEquipment: ValueNamePair[] = [];
  AudioOutputState: ValueNamePair[] = [];
  AIModelType: ValueNamePair[] = [];
  ProfileState: ValueNamePair[] = [];
  IMEICardType: ValueNamePair[] = [];
}
