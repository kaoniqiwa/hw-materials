import { Duration } from 'src/app/model/duration.model';
import { PropertyValueModel } from 'src/app/model/property-value.model';

export class GarbageStationProfileTableArgs {
  constructor() {
    this.duration = {
      begin: new Date('2023-1-1'),
      end: new Date(),
    };
  }
  tableIds?: string[];
  name?: string;
  asc?: string;
  desc?: string;

  labels: number[] = [];
  functions: number[] = [];
  materials: number[] = [];
  duration: Duration;

  enums: KeyValue = new KeyValue();

  cameras: KeyValue = new KeyValue();

  reset() {
    for (const key in this.enums) {
      if (key === 'ProfileState') {
        continue;
      }
      delete this.enums[key];
    }
  }
}

class KeyValue {
  [key: string]: number | undefined;
}

export interface ProfilePropertyValueModel {
  profileId: string;
  model: PropertyValueModel;
}
export const GarbageStationProfileTableDefaultNames = [
  'ProfileName',
  'Province',
  'County',
  'Street',
  'Committee',
  'ProfileState',
  'UpdateTime',
];
