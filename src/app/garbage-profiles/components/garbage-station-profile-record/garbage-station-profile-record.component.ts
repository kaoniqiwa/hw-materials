import { Component, EventEmitter } from '@angular/core';
import { DateTimePickerView } from 'src/app/common/directives/date-time-picker/date-time-picker.directive';
import { ModificationRecordModel } from 'src/app/model/modification-record.model';
import { GarbageProfilesRecordModificationTableArgs } from '../tables/garbage-profiles-record-modification-table/garbage-profiles-record-modification-table.model';

@Component({
  selector: 'garbage-station-profile-record',
  templateUrl: './garbage-station-profile-record.component.html',
  styleUrls: ['./garbage-station-profile-record.component.less'],
})
export class GarbageStationProfileRecordComponent {
  args: GarbageProfilesRecordModificationTableArgs =
    new GarbageProfilesRecordModificationTableArgs();

  DateTimePickerView = DateTimePickerView;

  load: EventEmitter<GarbageProfilesRecordModificationTableArgs> =
    new EventEmitter();

  onsearch() {}
  ondetails(model: ModificationRecordModel) {}
}
