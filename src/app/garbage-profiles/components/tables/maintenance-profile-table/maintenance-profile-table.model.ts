import { Duration } from 'src/app/model/duration.model';

export class MaintenanceProfileTableArgs {
  constructor() {
    this.duration = {
      begin: new Date('2023-1-1'),
      end: new Date(),
    };
  }
  duration: Duration;
  tableIds?: string[];
  name?: string;

  asc?: string;
  desc?: string;

  enums: KeyValue = new KeyValue();

  reset() {
    for (const key in this.enums) {
      if (key === 'ProfileState') {
        continue;
      }
      delete this.enums[key];
    }
  }
}

export const MaintenanceProfileTableDefaultNames = [
  'GarbageStationName',
  'Province',
  'County',
  'Street',
  'Committee',
  'ProfileState',
  'UpdateTime',
];

class KeyValue {
  [key: string]: number | undefined;
}
