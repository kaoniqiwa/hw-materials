import { Component, EventEmitter } from '@angular/core';
import { FormState } from 'src/app/enum/form-state.enum';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { IPartialData } from 'src/app/network/entity/partial-data.interface';
import { GarbageStationProfileTableArgs } from '../tables/garbage-station-profile-table/garbage-station-profile-table.model';
import {
  GarbageStationProfileDetailsWindow,
  GarbageStationProfileSettingWindow,
} from './garbage-station-profile-manager.model';

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
    setting: new GarbageStationProfileSettingWindow(),
  };
  load: EventEmitter<GarbageStationProfileTableArgs> = new EventEmitter();

  onselected(id: IPartialData) {
    // this.selected = item;
    this.window.details.state = FormState.edit;
    this.window.details.show = true;
  }
  onwindowclose() {
    this.window.details.show = false;
    this.window.setting.show = false;
  }
  oncreate() {
    this.window.details.state = FormState.add;
    this.window.details.show = true;
  }
  onsetting() {
    this.window.setting.show = true;
  }
  onsettingok(ids: string[]) {
    this.window.setting.show = false;
    this.args.tableIds = ids;
    this.load.emit(this.args);
  }
}
