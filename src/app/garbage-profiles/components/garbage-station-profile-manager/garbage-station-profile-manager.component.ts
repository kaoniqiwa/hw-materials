import { Component } from '@angular/core';
import { WindowViewModel } from 'src/app/common/components/window-control/window.model';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { GarbageStationProfileTableArgs } from '../tables/garbage-station-profile-table/garbage-station-profile-table.model';

@Component({
  selector: 'garbage-station-profile-manager',
  templateUrl: './garbage-station-profile-manager.component.html',
  styleUrls: ['./garbage-station-profile-manager.component.less'],
})
export class GarbageStationProfileManagerComponent {
  args: GarbageStationProfileTableArgs = new GarbageStationProfileTableArgs();

  selected: GarbageStationProfileModel = new GarbageStationProfileModel();

  window: WindowViewModel = new WindowViewModel();

  onselected(item: GarbageStationProfileModel) {
    this.selected = item;
    this.window.show = true;
  }
}
