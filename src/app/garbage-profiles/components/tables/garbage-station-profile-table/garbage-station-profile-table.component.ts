import { Component } from '@angular/core';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';

@Component({
  selector: 'garbage-station-profile-table',
  templateUrl: './garbage-station-profile-table.component.html',
  styleUrls: [
    '../table.less',
    './garbage-station-profile-table.component.less',
  ],
})
export class GarbageStationProfileTableComponent {
  widths = [];
  datas: GarbageStationProfileModel[] = [];

  onitemclicked(item: GarbageStationProfileModel) {}
}
