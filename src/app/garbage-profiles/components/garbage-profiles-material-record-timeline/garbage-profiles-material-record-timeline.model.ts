import { Duration } from 'src/app/model/duration.model';
import { MaterialRecordModel } from 'src/app/model/material-record.model';
import { MaterialRecordItem } from 'src/app/network/entity/material-item.enitty';

export interface GarbageProfilesMaterialRecordTimelineArgs {
  duration: Duration;
  asc: boolean;
}
export class SingleMaterialRecordModel extends MaterialRecordModel {
  Item!: MaterialRecordItem;
}
