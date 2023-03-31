import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormState } from 'src/app/enum/form-state.enum';
import { PropertyValueModel } from 'src/app/model/property-value.model';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
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

  // selected?: IPartialData;

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

  onwindowclose() {
    this.window.clear();
    this.window.close();
  }
  oncreate() {
    this.window.details.form = FormState.add;
    this.window.details.show = true;
  }
  async onmodify(item: PartialData) {
    this.window.details.form = FormState.edit;
    this.window.details.selected = item.Id;
    if ('ProfileState' in item) {
      this.window.details.state = Math.max(
        (item['ProfileState'] as number) - 1,
        0
      );
    } else {
      let data = await this.business.get(item.Id);
      if (data) {
        this.window.details.state = Math.max(data['ProfileState'] - 1, 0);
      }
    }

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

  onsearch() {
    this.load.emit(this.args);
  }
  async onitemclick(model: ProfilePropertyValueModel) {
    if (model.model.PropertyId && model.model.Value) {
      if (model.model.PropertyId.toLowerCase().includes('url')) {
        this.showPicture(model.model);
      }
    }

    switch (model.model.PropertyId) {
      case 'Cameras':
        this.window.partial.model = model.model;
        this.window.partial.id = model.profileId;
        this.window.partial.show = true;
        this.window.partial.style.height = '600px';
        break;
      case 'MaterialItems':
        this.window.partial.model = model.model;
        this.window.partial.id = model.profileId;
        this.window.partial.show = true;
        this.window.partial.style.height = '700px';
        break;

      default:
        break;
    }
  }

  private showPicture(model: PropertyValueModel) {
    this.window.picture.urlId = model.Value as string;
    this.window.picture.show = true;
  }

  onrecord() {
    this.window.record.modification.table.show = true;
  }

  todelete() {
    this.window.confirm.show = true;
  }
  ondelete(item: PartialData) {
    if (item) {
      this.business.delete(item.Id).then((x) => {
        this.load.emit(this.args);
        this.toastr.success(`成功删除档案文件`);
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

  toputout(profile: PartialData) {
    this.window.putout.show = true;
    this.window.putout.id = profile.Id;
  }
  onputoutok(params: PutOutMaterialsParams) {
    if (this.window.putout.id) {
      params.ProfileId = this.window.putout.id;
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
