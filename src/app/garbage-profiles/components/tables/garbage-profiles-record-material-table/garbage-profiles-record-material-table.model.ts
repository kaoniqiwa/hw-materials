import { DateTimeTool } from 'src/app/common/tools/datetime.tool';
import { MaterialRecordType } from 'src/app/enum/material-record-type.enum';
import { Duration } from 'src/app/model/duration.model';

export class GarbageProfilesRecordMaterialTableArgs {
  duration: Duration = DateTimeTool.allDay(new Date());
  profileName?: string;
  materialName?: string;
  type?: MaterialRecordType;
  materialIds?: number[];
  asc?: string;
  desc?: string;
}
