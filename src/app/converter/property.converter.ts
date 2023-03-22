import { Injectable } from '@angular/core';
import { GarbageStationProfilePropertyConverter } from './garbage-statopm-profile/garbage-statopm-profile-property.converter';
import { MaintenanceProfilePropertyConverter } from './maintenance-profile/maintenance-profile-property.converter';

@Injectable({
  providedIn: 'root',
})
export class PropertyConverter {
  constructor(
    public maintenance: MaintenanceProfilePropertyConverter,
    public garbagestation: GarbageStationProfilePropertyConverter
  ) {}
}
