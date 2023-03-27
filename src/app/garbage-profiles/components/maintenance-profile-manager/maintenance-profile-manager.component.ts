import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { UserType } from 'src/app/enum/user-type.enum';
import { PropertyValueModel } from 'src/app/model/property-value.model';
import { MaintenanceProfile } from 'src/app/network/entity/maintenance-profile.entity';
import {
  IPartialData,
  StatePartialData,
} from 'src/app/network/entity/partial-data.interface';
import { User } from 'src/app/network/entity/user.model';
import { MaintenanceProfilesLanguageTools } from '../../tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from '../../tools/maintenance-profile-source.tool';
import { ProfilePropertyValueModel } from '../tables/garbage-station-profile-table/garbage-station-profile-table.model';
import { MaintenanceProfileTableArgs } from '../tables/maintenance-profile-table/maintenance-profile-table.model';
import { MaintenanceProfileManagerBusiness } from './maintenance-profile-manager.business';
import {
  MaintenanceProfileAuthority,
  MaintenanceProfileWindow,
} from './maintenance-profile-manager.model';

@Component({
  selector: 'maintenance-profile-manager',
  templateUrl: './maintenance-profile-manager.component.html',
  styleUrls: ['./maintenance-profile-manager.component.less'],
  providers: [MaintenanceProfileManagerBusiness],
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
    this.user = local.user;
    this.args.user = this.user;
    this.authority = this.getauthority(local.user.UserType);
  }
  user: User;
  title = '维修工单档案';
  args: MaintenanceProfileTableArgs = new MaintenanceProfileTableArgs();
  load: EventEmitter<MaintenanceProfileTableArgs> = new EventEmitter();
  excel: EventEmitter<string> = new EventEmitter();
  window: MaintenanceProfileWindow = new MaintenanceProfileWindow();
  selected?: StatePartialData;

  authority: MaintenanceProfileAuthority;

  getauthority(type: UserType, state?: number) {
    let authority = new MaintenanceProfileAuthority();
    switch (type) {
      case UserType.admin:
        authority.create = true;
        authority.distribute = false;
        authority.construction.apply = false;
        authority.construction.approve = false;
        authority.complate = true;
        if (state === 4) {
          authority.operation = true;
        }
        break;
      case UserType.maintenance_admin:
        authority.create = false;
        authority.distribute = true;
        authority.construction.apply = true;
        authority.construction.approve = true;
        authority.complate = false;
        if (state === 1 || state === 2 || state === 3) {
          authority.operation = true;
        }
        break;
      case UserType.maintenance:
        authority.create = false;
        authority.distribute = false;
        authority.construction.apply = true;
        authority.construction.approve = false;
        authority.complate = false;
        if (state === 2) {
          authority.operation = true;
        }
        break;

      default:
        break;
    }
    return authority;
  }

  ngOnInit(): void {
    this.args.enums['ProfileState'] = this.state;
    this.activeRoute.queryParams.subscribe((params) => {
      if ('state' in params) {
        this.args.enums['ProfileState'] = parseInt(params['state']);
      }
    });
  }

  async onselected(item?: IPartialData) {
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
    }
    this.authority = this.getauthority(
      this.user.UserType,
      this.selected.ProfileState
    );
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
    this.window.details.data = undefined;
    this.window.details.show = true;
  }
  tomodify() {
    if (this.selected) {
      let plain = instanceToPlain(this.selected);
      this.window.details.data = plainToInstance(MaintenanceProfile, plain);
      this.window.details.show = true;
    }
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
}
