import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { UserType } from 'src/app/enum/user-type.enum';
import { PropertyValueModel } from 'src/app/model/property-value.model';
import { MaintenanceProfile } from 'src/app/network/entity/maintenance-profile.entity';
import {
  PartialData,
  StatePartialData,
} from 'src/app/network/entity/partial-data.interface';
import { MaintenanceProfilesLanguageTools } from '../../tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from '../../tools/maintenance-profile-source.tool';
import { ProfilePropertyValueModel } from '../tables/garbage-station-profile-table/garbage-station-profile-table.model';
import { MaintenanceProfileTableArgs } from '../tables/maintenance-profile-table/maintenance-profile-table.model';
import { MaintenanceProfileManagerConstructionBusiness } from './maintenance-profile-manager-construction.business';
import { MaintenanceProfileManagerBusiness } from './maintenance-profile-manager.business';
import { MaintenanceProfileWindow } from './maintenance-profile-manager.model';

@Component({
  selector: 'maintenance-profile-manager',
  templateUrl: './maintenance-profile-manager.component.html',
  styleUrls: ['./maintenance-profile-manager.component.less'],
  providers: [
    MaintenanceProfileManagerConstructionBusiness,
    MaintenanceProfileManagerBusiness,
  ],
})
export class MaintenanceProfileManagerComponent implements OnInit {
  @Input()
  state?: number;
  constructor(
    public source: MaintenanceProfilesSourceTools,
    public language: MaintenanceProfilesLanguageTools,
    private business: MaintenanceProfileManagerBusiness,
    private activeRoute: ActivatedRoute,
    private toastr: ToastrService,
    local: LocalStorageService
  ) {
    this.cancreate = local.user.UserType === UserType.admin;
  }
  title = '维修工单档案';
  args: MaintenanceProfileTableArgs = new MaintenanceProfileTableArgs();
  load: EventEmitter<MaintenanceProfileTableArgs> = new EventEmitter();
  excel: EventEmitter<string> = new EventEmitter();
  window: MaintenanceProfileWindow = new MaintenanceProfileWindow();
  selected?: StatePartialData;
  cancreate: boolean = false;

  ngOnInit(): void {
    this.args.enums['ProfileState'] = this.state;
    this.activeRoute.queryParams.subscribe((params) => {
      if ('state' in params) {
        this.args.enums['ProfileState'] = parseInt(params['state']);
      }
    });
  }

  async onselected(item?: PartialData) {
    if (!item) {
      this.selected = undefined;
      return;
    }
    let plain = instanceToPlain(item);
    this.selected = plainToInstance(StatePartialData, plain);

    if (!this.selected.ProfileState) {
      let data = await this.business.get(this.selected.Id);
      if (data && 'ProfileState' in data) {
        this.selected.ProfileState = data['ProfileState'];
      }
      if (data && 'ConstructionState' in data) {
        this.selected.ConstructionState = data['ConstructionState'];
      }
    }
  }
  async onitemclick(model: ProfilePropertyValueModel) {
    if (model.model.PropertyId && model.model.Value) {
      if (model.model.PropertyId.toLowerCase().includes('url')) {
        this.showPicture(model.model);
      }
    }
    switch (model.model.PropertyId) {
      case 'MaterialItems':
        this.window.partial.model = model.model;
        this.window.partial.id = model.profileId;
        this.window.partial.show = true;

        break;

      default:
        break;
    }
  }
  private async showPicture(model: PropertyValueModel) {
    if (model.Property) {
      let property = await model.Property;
      if (property.IsArray) {
        this.window.picture.multiple.ids = model.Value as string[];
        this.window.picture.multiple.show = true;
      } else {
        this.window.picture.single.id = model.Value as string;
        this.window.picture.single.show = true;
      }
    }
  }

  toexcel() {
    this.excel.emit(this.title);
  }

  onwindowclose(load: boolean = false) {
    this.window.clear();
    this.window.close();
    if (load) {
      this.load.emit(this.args);
    }
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

  todetails(item: PartialData) {
    let plain = instanceToPlain(item);
    this.window.details.data = plainToInstance(MaintenanceProfile, plain);
    this.window.details.show = true;
  }
  ondetailsok() {
    this.load.emit(this.args);
    this.onwindowclose();
  }
  tofilter() {
    this.window.filter.show = true;
  }
  onfilter(args: MaintenanceProfileTableArgs) {
    this.load.emit(args);
    this.onwindowclose();
  }

  toconstruction() {
    if (this.selected) {
      this.window.construction.state = this.selected.ConstructionState;
      if (this.selected.ConstructionState === 1) {
        this.window.construction.approve.id = this.selected.Id;
        this.window.construction.approve.show = true;
      } else {
        this.window.construction.apply.id = this.selected.Id;
        this.window.construction.apply.show = true;
      }
    }
  }

  tocreate() {
    this.window.create.show = true;
  }
  todistribute(item: PartialData) {
    this.window.distribute.id = item.Id;
    this.window.distribute.show = true;
  }
  toapply(item: PartialData) {
    this.window.construction.apply.id = item.Id;
    this.window.construction.apply.show = true;
  }
  toapprove(item: PartialData, agree: boolean) {
    this.window.construction.approve.id = item.Id;
    this.window.construction.approve.agree = agree;
    this.window.construction.approve.show = true;
  }
  tosubmit(item: PartialData) {
    this.window.submit.id = item.Id;
    this.window.submit.show = true;
  }
}
