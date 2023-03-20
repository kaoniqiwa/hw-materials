import { Component, Input } from '@angular/core';
import { ModificationRecordModel } from 'src/app/model/modification-record.model';

@Component({
  selector: 'garbage-station-profile-record-details',
  templateUrl: './garbage-station-profile-record-details.component.html',
  styleUrls: ['./garbage-station-profile-record-details.component.less'],
})
export class GarbageStationProfileRecordDetailsComponent {
  @Input()
  model?: ModificationRecordModel;
}
