import { Injectable } from '@angular/core';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { ValueNamePair } from 'src/app/network/entity/value-name-pair.entity';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';

@Injectable({ providedIn: 'root' })
export class GarbageStationProfilesSourceTools {
  constructor(service: GarbageStationProfilesRequestService) {
    this.init(service);
  }

  private init(service: GarbageStationProfilesRequestService) {
    service.property.name('StrongCurrentWire').then((x) => {
      this.StrongCurrentWire = x;
    });
    service.property.name('StrongCurrentWireMode').then((x) => {
      this.StrongCurrentWireMode = x;
    });
    service.property.name('Functions').then((x) => {
      this.Functions = x;
    });
    service.property.name('GarbageStationType').then((x) => {
      this.GarbageStationType = x;
    });
    service.property.name('Model').then((x) => {
      this.Model = x;
    });
    service.property.name('AccessServer').then((x) => {
      this.AccessServer = x;
    });
    service.property.name('Resolution').then((x) => {
      this.Resolution = x;
    });
    service.property.name('StorageTime').then((x) => {
      this.StorageTime = x;
    });
    service.property.name('ActionEquipment').then((x) => {
      this.ActionEquipment = x;
    });
    service.property.name('AudioOutputState').then((x) => {
      this.AudioOutputState = x;
    });
    service.property.name('AIModelType').then((x) => {
      this.AIModelType = x;
    });
    service.property.name('ProfileState').then((x) => {
      this.ProfileState = x;
    });

    GarbageStationProfile.getKeys().forEach((key) => {
      this.language[key] = service.property.language(key);
    });
  }

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

  language = new Language();

  static getKeys() {
    return [
      'StrongCurrentWire',
      'StrongCurrentWireMode',
      'Functions',
      'GarbageStationType',
      'Model',
      'AccessServer',
      'Resolution',
      'StorageTime',
      'ActionEquipment',
      'AudioOutputState',
      'AIModelType',
      'ProfileState',
    ];
  }
}

class Language {
  [key: string]: Promise<string>;
}
