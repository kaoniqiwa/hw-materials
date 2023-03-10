import { Duration } from 'src/app/model/duration.model';

export class GarbageStationProfileTableArgs {
  constructor() {
    this.duration = {
      begin: new Date('2023-1-1'),
      end: new Date(),
    };
  }
  tableIds?: string[];
  Name?: string;
  asc?: string;
  desc?: string;

  labels: number[] = [];
  functions: number[] = [];
  materials: number[] = [];
  duration: Duration;

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

export class KeyValue {
  [key: string]: number | undefined;
}
