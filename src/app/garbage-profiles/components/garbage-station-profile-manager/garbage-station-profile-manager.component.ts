import { Component } from '@angular/core';
import { FormState } from 'src/app/enum/form-state.enum';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { GarbageStationProfileTableArgs } from '../tables/garbage-station-profile-table/garbage-station-profile-table.model';
import { GarbageStationProfileDetailsWindow } from './garbage-station-profile-manager.model';

@Component({
  selector: 'garbage-station-profile-manager',
  templateUrl: './garbage-station-profile-manager.component.html',
  styleUrls: ['./garbage-station-profile-manager.component.less'],
})
export class GarbageStationProfileManagerComponent {
  args: GarbageStationProfileTableArgs = new GarbageStationProfileTableArgs();

  selected: GarbageStationProfileModel = new GarbageStationProfileModel();

  window = {
    details: new GarbageStationProfileDetailsWindow(),
  };

  onselected(item: GarbageStationProfileModel) {
    this.selected = item;
    this.window.details.state = FormState.edit;
    this.window.details.show = true;
  }

  oncreate() {
    this.window.details.state = FormState.add;
    this.window.details.show = true;
  }
}
