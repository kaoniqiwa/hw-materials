import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { DateTimePickerView } from 'src/app/common/directives/date-time-picker/date-time-picker.directive';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { IComponent } from 'src/app/common/interfaces/component.interfact';
import { IModel } from 'src/app/common/interfaces/model.interface';
import { ModificationRecordModel } from 'src/app/model/modification-record.model';
import { GarbageProfilesRecordModificationTableArgs } from '../tables/garbage-profiles-record-modification-table/garbage-profiles-record-modification-table.model';
import { GarbageStationProfileRecordBusiness } from './garbage-station-profile-record.business';
import { GarbageStationProfileRecordSource } from './garbage-station-profile-record.model';

@Component({
  selector: 'garbage-station-profile-record',
  templateUrl: './garbage-station-profile-record.component.html',
  styleUrls: ['./garbage-station-profile-record.component.less'],
  providers: [GarbageStationProfileRecordBusiness],
})
export class GarbageStationProfileRecordComponent
  implements IComponent<IModel, GarbageStationProfileRecordSource>, OnInit
{
  @Input()
  business: IBusiness<IModel, GarbageStationProfileRecordSource>;

  constructor(business: GarbageStationProfileRecordBusiness) {
    this.business = business;
  }
  ngOnInit(): void {
    this.business.load().then((x) => {
      this.source = x;
    });
  }

  source?: GarbageStationProfileRecordSource;

  args: GarbageProfilesRecordModificationTableArgs =
    new GarbageProfilesRecordModificationTableArgs();

  DateTimePickerView = DateTimePickerView;

  load: EventEmitter<GarbageProfilesRecordModificationTableArgs> =
    new EventEmitter();

  onsearch() {}
  ondetails(model: ModificationRecordModel) {}
}
