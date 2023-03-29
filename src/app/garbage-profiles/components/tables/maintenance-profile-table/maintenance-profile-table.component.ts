import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { IComponent } from 'src/app/common/interfaces/component.interfact';
import { IModel } from 'src/app/common/interfaces/model.interface';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { PropertyDataType } from 'src/app/enum/property-data-type.enum';
import { UserType } from 'src/app/enum/user-type.enum';
import { MaintenanceProfilesLanguageTools } from 'src/app/garbage-profiles/tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from 'src/app/garbage-profiles/tools/maintenance-profile-source.tool';
import { PagedList } from 'src/app/network/entity/page.entity';
import {
  IPartialData,
  PartialData,
} from 'src/app/network/entity/partial-data.interface';
import { Property } from 'src/app/network/entity/property.entity';
import { User } from 'src/app/network/entity/user.model';
import { ProfilePropertyValueModel } from '../garbage-station-profile-table/garbage-station-profile-table.model';
import { PagedTableAbstractComponent } from '../table-paged-abstract.component';
import { MaintenanceProfileTableConfigBusiness } from './maintenance-profile-table-config.business';
import { MaintenanceProfileTableBusiness } from './maintenance-profile-table.business';
import {
  MaintenanceProfileTableConverter,
  MaintenanceProfileTableItemConverter,
} from './maintenance-profile-table.converter';
import {
  MaintenanceProfileTableArgs,
  MaintenanceProfileTableDefaultNames,
  MaintenanceProfileTableItemOption,
  MaintenanceProfileTableOptions,
} from './maintenance-profile-table.model';

@Component({
  selector: 'maintenance-profile-table',
  templateUrl: './maintenance-profile-table.component.html',
  styleUrls: [
    '../table-horizontal.less',
    './maintenance-profile-table.component.less',
  ],
  providers: [
    MaintenanceProfileTableConverter,
    MaintenanceProfileTableItemConverter,
    MaintenanceProfileTableConfigBusiness,
    MaintenanceProfileTableBusiness,
  ],
})
export class MaintenanceProfileTableComponent
  extends PagedTableAbstractComponent<PartialData>
  implements IComponent<IModel, PagedList<PartialData>>, OnInit
{
  @Input()
  business: MaintenanceProfileTableBusiness;
  @Input()
  args: MaintenanceProfileTableArgs = new MaintenanceProfileTableArgs();

  @Input()
  load?: EventEmitter<MaintenanceProfileTableArgs>;
  @Input()
  excel?: EventEmitter<string>;

  @Input()
  selected?: PartialData;
  @Output()
  selectedChange: EventEmitter<PartialData> = new EventEmitter();

  @Output()
  loaded: EventEmitter<PagedList<IPartialData>> = new EventEmitter();
  @Output()
  check: EventEmitter<IPartialData> = new EventEmitter();
  @Output()
  itemclick: EventEmitter<ProfilePropertyValueModel> = new EventEmitter();
  @Output()
  details: EventEmitter<PartialData> = new EventEmitter();
  @Output()
  approveno: EventEmitter<PartialData> = new EventEmitter();
  @Output()
  approveyes: EventEmitter<PartialData> = new EventEmitter();
  @Output()
  apply: EventEmitter<PartialData> = new EventEmitter();
  @Output()
  distribute: EventEmitter<PartialData> = new EventEmitter();
  @Output()
  submit: EventEmitter<PartialData> = new EventEmitter();
  constructor(
    business: MaintenanceProfileTableBusiness,
    public source: MaintenanceProfilesSourceTools,
    public language: MaintenanceProfilesLanguageTools,
    local: LocalStorageService
  ) {
    super();
    this.user = local.user;
    this.business = business;
  }
  user: User;
  names: string[] = MaintenanceProfileTableDefaultNames;

  properties: Property[] = [];
  widths: string[] = [];
  hover?: PartialData;
  options = new MaintenanceProfileTableOptions();

  ngOnInit(): void {
    this.tosubscribe();
    this.loadData(1);
  }

  tosubscribe() {
    if (this.load) {
      this.load.subscribe((args) => {
        this.args = args;
        this.loadData(1, this.pageSize);
      });
    }
    if (this.excel) {
      this.excel.subscribe((title) => {
        this.business.download(this.args, this.names).then((x) => {
          let link = document.createElement('a');
          link.href = x;
          link.download = title;
          link.click();
        });
      });
    }
  }

  async loadData(index: number, size: number = this.pageSize) {
    this.loading = true;
    this.selected = undefined;
    this.options = new MaintenanceProfileTableOptions();
    this.business.config.get(this.args.tableIds).then((names) => {
      this.names = names;
      this.options = {};
      this.business.load(index, size, this.names, this.args).then((paged) => {
        this.page = paged.Page;
        this.datas = paged.Data;

        this.datas.forEach((item) => {
          let option = new MaintenanceProfileTableItemOption();
          option.details.visibled = true;
          option.details.enabled = true;
          option.distribute.enabled = item['ProfileState'] === 1;
          option.apply.enabled =
            item['ProfileState'] === 2 && !item['ConstructionState'];
          option.approveyes.enabled =
            item['ProfileState'] === 2 && item['ConstructionState'] === 1;
          option.approveno.enabled =
            item['ProfileState'] === 2 && item['ConstructionState'] === 1;
          option.submit.enabled =
            item['ProfileState'] === 2 &&
            (item['ConstructionState'] === 2 ||
              item['ConstructionState'] === 3);

          option.complate.enabled = item['ProfileState'] === 3;
          option.details.visibled = true;
          switch (this.user.UserType) {
            case UserType.admin:
              option.complate.visibled = true;
              break;
            case UserType.maintenance_admin:
              option.apply.visibled = true;
              option.distribute.visibled = true;
              option.approveyes.visibled = true;
              option.approveno.visibled = true;
              option.submit.visibled = true;
              break;
            case UserType.maintenance:
              option.apply.visibled = true;
              break;
            default:
              break;
          }

          this.options[item.Id] = option;
        });

        this.loading = false;
      });
    });
  }

  sortData(sort: Sort) {
    const isAsc = sort.direction === 'asc';
    this.args.desc = undefined;
    this.args.asc = undefined;
    if (isAsc) {
      this.args.asc = sort.active;
    } else {
      this.args.desc = sort.active;
    }
    this.loadData(1);
  }

  async onupdate(e: Event, item: PartialData) {
    this.check.emit(item);
    e.stopImmediatePropagation();
  }

  onselected(item: PartialData) {
    if (this.selected === item) {
      this.selected = undefined;
    } else {
      this.selected = item;
    }

    this.selectedChange.emit(this.selected);
  }

  async onitemclick(e: Event, item: PartialData, name: string) {
    let value = await this.business.get(name, item[name]);
    let model = {
      profileId: item.Id,
      model: value,
    };
    if (name.includes('Url') && value.Value) {
      e.stopImmediatePropagation();

      this.itemclick.emit(model);
      return;
    }
    let property = await value.Property;
    if (property) {
      if (property.DataType === PropertyDataType.Object) {
        e.stopImmediatePropagation();
        this.itemclick.emit(model);
      }
    }
  }
  onmouseover(item: PartialData) {
    this.hover = item;
  }
  onmouseout() {
    this.hover = undefined;
  }

  ondetails(e: Event, item: PartialData) {
    e.stopImmediatePropagation();
    this.details.emit(item);
  }
  onapply(e: Event, item: PartialData, disabled: boolean) {
    e.stopImmediatePropagation();
    if (disabled) return;
    this.apply.emit(item);
  }
  onapproveyes(e: Event, item: PartialData, disabled: boolean) {
    e.stopImmediatePropagation();
    if (disabled) return;
    this.approveyes.emit(item);
  }
  onapproveno(e: Event, item: PartialData, disabled: boolean) {
    e.stopImmediatePropagation();
    if (disabled) return;
    this.approveno.emit(item);
  }
  ondistribute(e: Event, item: PartialData, disabled: boolean) {
    e.stopImmediatePropagation();
    if (disabled) return;
    this.distribute.emit(item);
  }
  onsubmit(e: Event, item: PartialData, disabled: boolean) {
    e.stopImmediatePropagation();
    if (disabled) return;
    this.submit.emit(item);
  }
}
