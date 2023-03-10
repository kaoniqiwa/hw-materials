import { Component, Input, OnInit } from '@angular/core';
import { MaterialRecordType } from 'src/app/enum/material-record-type.enum';
import { MaterialRecordModel } from 'src/app/model/material-record.model';
import { GarbageProfilesMaterialRecordDetailsBusiness } from './garbage-profiles-material-record-details.business';

@Component({
  selector: 'garbage-profiles-material-record-details',
  templateUrl: './garbage-profiles-material-record-details.component.html',
  styleUrls: [
    '../tables/table.less',
    './garbage-profiles-material-record-details.component.less',
  ],
  providers: [GarbageProfilesMaterialRecordDetailsBusiness],
})
export class GarbageProfilesMaterialRecordDetailsComponent implements OnInit {
  @Input()
  profileId?: string;
  @Input()
  model?: MaterialRecordModel;

  constructor(private business: GarbageProfilesMaterialRecordDetailsBusiness) {}

  MaterialRecordType = MaterialRecordType;
  tableWidth = ['50%', '25%', '25%'];

  ngOnInit(): void {
    if (this.profileId) {
      this.business.load(this.profileId).then((x) => {
        this.model = x;
      });
    }
  }
}
