import { Injectable } from '@angular/core';
import { DivisionConverter } from './division.converter';
import { GarbageStationProfileConverter } from './garbage-station-profile.converter';
import { LabelConverter } from './label.converter';
import { MaterialItemConverter } from './material-item.converter';
import { MaterialConverter } from './material.converter';
import { PropertyValueConverter } from './property-value.converter';
import { PropertyConverter } from './property.converter';
import { RecordConverter } from './record.converter';
import { ValueNamePairConverter } from './value-name-pair.converter';

@Injectable({
  providedIn: 'root',
})
export class ViewModelConverter {
  constructor(
    public property: PropertyConverter,
    public property_value: PropertyValueConverter,
    public division: DivisionConverter,
    public garbage_station_profile: GarbageStationProfileConverter,
    public label: LabelConverter,
    public material: MaterialConverter,
    public material_item: MaterialItemConverter,
    public record: RecordConverter,
    public value_name_pair: ValueNamePairConverter
  ) {}
}
