import { Injectable } from '@angular/core';
import { ValueNamePair } from 'src/app/network/entity/value-name-pair.entity';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';

@Injectable({ providedIn: 'root' })
export class GarbageStationProfilesSourceTools {
  constructor(service: GarbageStationProfilesRequestService) {
    service.property.getEnumByName('StrongCurrentWire').then((x) => {
      this.StrongCurrentWire = x;
    });
    service.property.getEnumByName('StrongCurrentWireMode').then((x) => {
      this.StrongCurrentWireMode = x;
    });
    service.property.getEnumByName('Functions').then((x) => {
      this.Functions = x;
    });
    service.property.getEnumByName('GarbageStationType').then((x) => {
      this.GarbageStationType = x;
    });
    service.property.getEnumByName('Model').then((x) => {
      this.Model = x;
    });
    service.property.getEnumByName('AccessServer').then((x) => {
      this.AccessServer = x;
    });
    service.property.getEnumByName('Resolution').then((x) => {
      this.Resolution = x;
    });
    service.property.getEnumByName('StorageTime').then((x) => {
      this.StorageTime = x;
    });
    service.property.getEnumByName('ActionEquipment').then((x) => {
      this.ActionEquipment = x;
    });
    service.property.getEnumByName('AudioOutputState').then((x) => {
      this.AudioOutputState = x;
    });
    service.property.getEnumByName('AIModelType').then((x) => {
      this.AIModelType = x;
    });

    GarbageStationProfilesSourceTools.getKeys().forEach((key) => {
      service.property.getEnumByName(key).then((x) => {
        this[key] = x;
      });
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
