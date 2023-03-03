import { Duration } from 'src/app/model/duration.model';

export class GarbageProfilesRecordModificationTableArgs {
  duration!: Duration;
  name?: string;
  type?: number;
  asc?: string;
  desc?: string;
}
