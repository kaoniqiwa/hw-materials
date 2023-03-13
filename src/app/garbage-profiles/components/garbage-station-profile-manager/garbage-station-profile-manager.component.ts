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

  title = '厢房档案管理';

  args: GarbageStationProfileTableArgs = new GarbageStationProfileTableArgs();

  selected?: IPartialData;

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
  toexcel: EventEmitter<GarbageStationProfileTableArgs> = new EventEmitter();

  onselected(item?: IPartialData) {
    this.selected = item;
  }
  onwindowclose() {
    this.window.details.show = false;
    this.window.details.state = FormState.none;
    this.window.details.selected = undefined;
    this.window.setting.show = false;
    this.window.picture.show = false;
    this.window.picture.urlId = undefined;
    this.window.record.modification.show = false;
    this.window.confirm.show = false;
    this.window.partial.show = false;
    this.window.partial.model = undefined;
    this.window.record.material.show = false;
  }
  oncreate() {
    this.window.details.state = FormState.add;
    this.window.details.selected = this.selected?.Id;
    this.window.details.show = true;
  }
  onmodify() {
    if (this.selected) {
      this.window.details.state = FormState.edit;
      this.window.details.selected = this.selected.Id;
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
      case 'Cameras':
      case 'MaterialItems':
        if ((model.Value as any[]).length > 0) {
          this.window.partial.model = model;

          this.window.partial.show = true;
        }

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
    this.window.record.modification.show = true;
  }

  todelete() {
    this.window.confirm.show = true;
  }
  ondelete() {
    if (this.selected) {
      this.business.delete(this.selected.Id).then((x) => {
        this.load.emit(this.args);
        this.toastr.success(`成功删除档案文件`);
        this.selected = undefined;
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

  onexport() {
    this.toexcel.emit(this.args);
  }
  onexcel(url: string) {
    let a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', this.title);
    a.click();

    document.removeChild(a);
  }
}
