import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IObjectModel } from 'src/app/common/interfaces/model.interface';
import { FormState } from 'src/app/enum/form-state.enum';
import { PropertyValueModel } from 'src/app/model/property-value.model';
import {
  IPartialData,
  PartialData,
} from 'src/app/network/entity/partial-data.interface';
import { PutOutMaterialsParams } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';
import { GarbageStationProfilesLanguageTools } from '../../tools/garbage-station-profile-language.tool';
import { GarbageStationProfilesSourceTools } from '../../tools/garbage-station-profile-source.tool';
import {
  GarbageStationProfileTableArgs,
  ProfilePropertyValueModel,
} from '../tables/garbage-station-profile-table/garbage-station-profile-table.model';
import { GarbageStationProfileManagerMaterialPutoutBusiness } from './business/garbage-station-profile-manager-material-putout.business';
import { GarbageStationProfileManagerBusiness } from './garbage-station-profile-manager.business';
import { GarbageStationProfileWindow } from './garbage-station-profile-manager.model';

@Component({
  selector: 'garbage-station-profile-manager',
  templateUrl: './garbage-station-profile-manager.component.html',
  styleUrls: ['./garbage-station-profile-manager.component.less'],
  providers: [
    GarbageStationProfileManagerMaterialPutoutBusiness,
    GarbageStationProfileManagerBusiness,
  ],
})
export class GarbageStationProfileManagerComponent implements OnInit {
  @Input()
  state?: number;

  constructor(
    public source: GarbageStationProfilesSourceTools,
    public language: GarbageStationProfilesLanguageTools,
    private business: GarbageStationProfileManagerBusiness,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute
  ) {}

  title = '厢房档案';

  args: GarbageStationProfileTableArgs = new GarbageStationProfileTableArgs();

  selected?: IPartialData;

  window = new GarbageStationProfileWindow();
  load: EventEmitter<GarbageStationProfileTableArgs> = new EventEmitter();
  excel: EventEmitter<string> = new EventEmitter();

  ngOnInit(): void {
    this.args.enums['ProfileState'] = this.state;
    this.activeRoute.queryParams.subscribe((params) => {
      if ('state' in params) {
        this.args.enums['ProfileState'] = parseInt(params['state']);
      }
    });
  }

  onselected(item?: IPartialData) {
    this.selected = item;
  }
  onwindowclose() {
    this.window.clear();
    this.window.close();
  }
  oncreate() {
    this.window.details.form = FormState.add;
    this.window.details.show = true;
  }
  onmodify() {
    if (this.selected) {
      this.window.details.form = FormState.edit;
      this.window.details.selected = this.selected.Id;
      if ('ProfileState' in this.selected) {
        this.window.details.state = this.selected['ProfileState'] as number;
      }
      console.log(this.window.details);

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
  async onitemclick(model: ProfilePropertyValueModel) {
    console.log(model);
    if (model.model.PropertyId && model.model.Value) {
      if (model.model.PropertyId.toLowerCase().includes('url')) {
        this.showPicture(model.model);
      }
    }

    switch (model.model.PropertyId) {
      case 'Cameras':
      case 'MaterialItems':
        this.window.partial.model = model.model;
        this.window.partial.id = model.profileId;
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
  showPartialData(model: ProfilePropertyValueModel) {
    console.log(model);
    this.window.partial.model = model.model;
    this.window.partial.show = true;
  }

  onrecord() {
    this.window.record.modification.table.show = true;
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
  ondetailsclose() {
    this.onwindowclose();
  }
  ondetailsupdate() {
    this.load.emit(this.args);
  }
  ondetailsputoutrecord(data: PartialData) {
    console.log(data);
    let model = new PropertyValueModel();
    model.PropertyId = 'MaterialItems';
    model.Value = data[model.PropertyId];
    this.window.partial.model = model;
    this.window.partial.id = data.Id;
    this.window.partial.show = true;
  }

  toexcel() {
    this.excel.emit(this.title);
  }

  toputout(profile: IObjectModel) {
    this.window.putout.show = true;
    this.window.putout.profile = profile;
  }
  onputoutok(params: PutOutMaterialsParams) {
    if (this.window.putout.profile) {
      params.ProfileId = this.window.putout.profile.Id as string;
      params.ProfileName = this.window.putout.profile.Name;
      this.business.putout
        .putout(params)
        .then((x) => {
          this.toastr.success('出库成功');
        })
        .catch((x) => {
          this.toastr.error('出库失败');
        })
        .finally(() => {
          this.window.picture.clear();
          this.window.putout.show = false;
        });
    }
  }
}
