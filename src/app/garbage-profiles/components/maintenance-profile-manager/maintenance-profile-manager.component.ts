import { Component, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormState } from 'src/app/enum/form-state.enum';
import { IPartialData } from 'src/app/network/entity/partial-data.interface';
import { MaintenanceProfilesLanguageTools } from '../../tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from '../../tools/maintenance-profile-source.tool';
import { ProfilePropertyValueModel } from '../tables/garbage-station-profile-table/garbage-station-profile-table.model';
import { MaintenanceProfileTableArgs } from '../tables/maintenance-profile-table/maintenance-profile-table.model';
import { MaintenanceProfileWindow } from './maintenance-profile-manager.model';

@Component({
  selector: 'maintenance-profile-manager',
  templateUrl: './maintenance-profile-manager.component.html',
  styleUrls: ['./maintenance-profile-manager.component.less'],
})
export class MaintenanceProfileManagerComponent {
  constructor(
    public source: MaintenanceProfilesSourceTools,
    public language: MaintenanceProfilesLanguageTools,

    private toastr: ToastrService
  ) {}
  title = '维修工单档案';
  args: MaintenanceProfileTableArgs = new MaintenanceProfileTableArgs();
  load: EventEmitter<MaintenanceProfileTableArgs> = new EventEmitter();
  toexcel: EventEmitter<MaintenanceProfileTableArgs> = new EventEmitter();
  window: MaintenanceProfileWindow = new MaintenanceProfileWindow();
  selected?: IPartialData;

  onselected(item?: IPartialData) {
    this.selected = item;
  }
  async onitemclick(model: ProfilePropertyValueModel) {}

  toexport() {
    this.toexcel.emit(this.args);
  }
  onexcel(url: string) {
    let a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', this.title);
    a.click();

    document.removeChild(a);
  }

  onwindowclose() {
    this.window.clear();
    this.window.close();
  }

  tosetting() {
    this.window.setting.show = true;
  }
  onsetting(ids: string[]) {
    this.window.setting.show = false;
    this.args.tableIds = ids;
    this.load.emit(this.args);
  }

  onsearch() {
    this.load.emit(this.args);
  }

  tocreate() {
    this.window.details.form = FormState.add;
    this.window.details.show = true;
  }
  tomodify() {
    if (this.selected) {
      this.window.details.form = FormState.edit;
      this.window.details.id = this.selected.Id;
      this.window.details.show = true;
    }
  }
}
