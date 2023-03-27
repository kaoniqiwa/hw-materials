import { Duration } from 'src/app/model/duration.model';
import { User } from 'src/app/network/entity/user.model';

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

  materials: number[] = [];

  asc?: string;
  desc?: string;

  enums: KeyValue = new KeyValue();

  user?: User;

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
