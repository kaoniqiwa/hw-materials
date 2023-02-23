import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { DateTimePickerView } from 'src/app/common/directives/date-time-picker/date-time-picker.directive';
import { MaterialRecordType } from 'src/app/enum/material-record-type.enum';
import { GarbageProfilesRecordMaterialTableArgs } from '../tables/garbage-profiles-record-material-table/garbage-profiles-record-material-table.model';

@Component({
  selector: 'garbage-profiles-material-record',
  templateUrl: './garbage-profiles-material-record.component.html',
  styleUrls: ['./garbage-profiles-material-record.component.less'],
})
export class GarbageProfilesMaterialRecordComponent implements OnChanges {
  @Input()
  type: MaterialRecordType = MaterialRecordType.in;

  load: EventEmitter<GarbageProfilesRecordMaterialTableArgs> =
    new EventEmitter();

  args: GarbageProfilesRecordMaterialTableArgs =
    new GarbageProfilesRecordMaterialTableArgs();

  MaterialRecordType = MaterialRecordType;

  DateTimePickerView = DateTimePickerView;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type']) {
      this.args.type = this.type;
    }
  }
  onsearch() {
    this.load.emit(this.args);
  }
}
