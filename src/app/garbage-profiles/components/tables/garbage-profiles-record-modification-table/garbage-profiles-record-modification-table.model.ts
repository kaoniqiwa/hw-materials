import { DateTimeTool } from 'src/app/common/tools/datetime.tool';
import { Duration } from 'src/app/model/duration.model';

export class GarbageProfilesRecordModificationTableArgs {
  constructor() {
    this.duration = DateTimeTool.allDay(new Date());
  }
  duration: Duration;
  name?: string;
  type?: number;
  asc?: string;
  desc?: string;
}
