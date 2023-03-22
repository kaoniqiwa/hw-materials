import { Injectable } from '@angular/core';
import { GarbageStationProfilePropertyValueConverter } from './garbage-statopm-profile/garbage-statopm-profile-property-value.converter';
import { MaintenanceProfilePropertyValueConverter } from './maintenance-profile/maintenance-profile-property-value.converter';

@Injectable({
  providedIn: 'root',
})
export class PropertyValueConverter {
  constructor(
    public maintenance: MaintenanceProfilePropertyValueConverter,
    public garbagestation: GarbageStationProfilePropertyValueConverter
  ) {}
}
