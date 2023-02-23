import { DateTimeTool } from 'src/app/common/tools/datetime.tool';
import { MaterialRecordType } from 'src/app/enum/material-record-type.enum';
import { Duration } from 'src/app/model/duration.model';

export class GarbageProfilesRecordMaterialTableArgs {
  duration: Duration = DateTimeTool.allDay(new Date());
  name: string = '';
  type: MaterialRecordType = MaterialRecordType.in;
}
