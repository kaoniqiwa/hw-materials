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
  duration: Duration;

  ProfileState?: number;
  StrongCurrentWire?: number;
  StrongCurrentWireMode?: number;
  GarbageStationType?: number;
  IMEICardType?: number;
}
