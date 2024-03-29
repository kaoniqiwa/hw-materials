import { Injectable } from '@angular/core';
import { GarbageStationProfilePartialDataConverter } from './garbage-statopm-profile/garbage-station-profile-partial-data.converter';
import { MaintenanceProfilePartialDataConverter } from './maintenance-profile/maintenance-profile-partial-data.converter';

@Injectable({
  providedIn: 'root',
})
export class PartialDataConverter {
  constructor(
    public maintenance: MaintenanceProfilePartialDataConverter,
    public garbagestation: GarbageStationProfilePartialDataConverter
  ) {}
}
