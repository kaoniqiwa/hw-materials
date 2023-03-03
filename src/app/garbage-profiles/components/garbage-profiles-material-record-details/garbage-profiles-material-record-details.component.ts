import { Component, Input } from '@angular/core';
import { MaterialRecordModel } from 'src/app/model/material-record.model';

@Component({
  selector: 'garbage-profiles-material-record-details',
  templateUrl: './garbage-profiles-material-record-details.component.html',
  styleUrls: [
    '../tables/table.less',
    './garbage-profiles-material-record-details.component.less',
  ],
})
export class GarbageProfilesMaterialRecordDetailsComponent {
  @Input()
  model?: MaterialRecordModel;

  constructor() {}
}
