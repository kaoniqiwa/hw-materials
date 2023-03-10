import { Component, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormState } from 'src/app/enum/form-state.enum';
import { PropertyValueModel } from 'src/app/model/property-value.model';
import { IPartialData } from 'src/app/network/entity/partial-data.interface';
import { GarbageStationProfilesLanguageTools } from '../../tools/language.tool';
import { GarbageStationProfilesSourceTools } from '../../tools/source.tool';
import { GarbageStationProfileTableArgs } from '../tables/garbage-station-profile-table/garbage-station-profile-table.model';
import { GarbageStationProfileManagerBusiness } from './garbage-station-profile-manager.business';
import {
  GarbageStationProfileConfirmWindow,
  GarbageStationProfileDetailsWindow,
  GarbageStationProfileFilterWindow,
  GarbageStationProfilePartialDataWindow,
  GarbageStationProfilePictureWindow,
  GarbageStationProfileRecordWindow,
  GarbageStationProfileSettingWindow,
} from './garbage-station-profile-manager.model';

@Component({
  selector: 'garbage-station-profile-manager',
  templateUrl: './garbage-station-profile-manager.component.html',
  styleUrls: ['./garbage-station-profile-manager.component.less'],
  providers: [GarbageStationProfileManagerBusiness],
})
export class GarbageStationProfileManagerComponent {
  constructor(
    public source: GarbageStationProfilesSourceTools,
    public language: GarbageStationProfilesLanguageTools,
    private business: GarbageStationProfileManagerBusiness,
    private toastr: ToastrService
  ) {}

  args: GarbageStationProfileTableArgs = new GarbageStationProfileTableArgs();

  selectedId?: string;

  window = {
    details: new GarbageStationProfileDetailsWindow(),
    setting: new GarbageStationProfileSettingWindow(),
    picture: new GarbageStationProfilePictureWindow(),
    record: new GarbageStationProfileRecordWindow(),
    confirm: new GarbageStationProfileConfirmWindow(),
    partial: new GarbageStationProfilePartialDataWindow(),
    filter: new GarbageStationProfileFilterWindow(),
  };
  load: EventEmitter<GarbageStationProfileTableArgs> = new EventEmitter();

  onselected(data?: IPartialData) {
    // this.selected = item;

    this.selectedId = data?.Id;
  }
  onwindowclose() {
    this.window.details.show = false;
    this.window.details.state = FormState.none;
    this.window.setting.show = false;
    this.window.picture.show = false;
    this.window.picture.urlId = undefined;
    this.window.record.show = false;
    this.window.confirm.show = false;
    this.window.partial.show = false;
    this.window.partial.model = undefined;
  }
  oncreate() {
    this.selectedId = '';
    this.window.details.state = FormState.add;
    this.window.details.show = true;
  }
  onmodify() {
    if (this.selectedId) {
      this.window.details.state = FormState.edit;
      this.window.details.show = true;
    }
  }
  onsetting() {
    this.window.setting.show = true;
  }
  onsettingok(ids: string[]) {
    this.window.setting.show = false;
    this.args.tableIds = ids;
    this.load.emit(this.args);
  }

  onsearch() {
    this.load.emit(this.args);
  }
  async onitemclick(model: PropertyValueModel) {
    console.log(model);
    if (model.PropertyId && model.Value) {
      if (model.PropertyId.toLowerCase().includes('url')) {
        this.showPicture(model);
      }
    }

    switch (model.PropertyId) {
      case 'Functions':
        this.window.partial.model = model;
        this.window.partial.show = true;
        break;
      default:
        break;
    }
  }

  showPicture(model: PropertyValueModel) {
    this.window.picture.urlId = model.Value as string;
    this.window.picture.show = true;
  }
  showPartialData(model: PropertyValueModel) {
    this.window.partial.model = model;
    this.window.partial.show = true;
  }

  onrecord() {
    this.window.record.show = true;
  }

  todelete() {
    this.window.confirm.show = true;
  }
  ondelete() {
    if (this.selectedId) {
      this.business.delete(this.selectedId).then((x) => {
        this.load.emit(this.args);
        this.toastr.success(`成功删除档案文件`);
        this.selectedId = undefined;
      });
    }
    this.onwindowclose();
  }

  tofilter() {
    this.window.filter.show = true;
  }

  onfilter(args: GarbageStationProfileTableArgs) {
    this.load.emit(args);
    this.onwindowclose();
  }

  closeAndUpdate() {
    this.load.emit(this.args);
    this.onwindowclose();
  }
  update() {
    this.load.emit(this.args);
  }
}
