import { Injectable } from '@angular/core';
import {
  IBusiness,
  IDownload,
  IGet,
} from 'src/app/common/interfaces/bussiness.interface';
import { ViewModelConverter } from 'src/app/converter/view-model.converter';
import { ConditionOperator } from 'src/app/enum/condition-operator.enum';
import { UserType } from 'src/app/enum/user-type.enum';
import { PropertyValueModel } from 'src/app/model/property-value.model';
import { Condition } from 'src/app/network/entity/condition.entity';
import { PagedList } from 'src/app/network/entity/page.entity';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import { PropertyValue } from 'src/app/network/entity/property-value.entity';
import { User } from 'src/app/network/entity/user.model';
import {
  GetPartialDatasExcelParams,
  GetPartialDatasParams,
} from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';
import { MaintenanceProfileTableConfigBusiness } from './maintenance-profile-table-config.business';
import { MaintenanceProfileTableConverter } from './maintenance-profile-table.converter';
import { MaintenanceProfileTableArgs } from './maintenance-profile-table.model';

@Injectable()
export class MaintenanceProfileTableBusiness
  implements
    IBusiness<PagedList<PartialData>>,
    IGet<PropertyValueModel>,
    IDownload
{
  constructor(
    private service: MaintenanceProfileRequestService,
    private vmConverter: ViewModelConverter,
    private converter: MaintenanceProfileTableConverter,
    public config: MaintenanceProfileTableConfigBusiness
  ) {}
  async download(
    args: MaintenanceProfileTableArgs,
    names: string[],
    user: User
  ): Promise<string> {
    let params = new GetPartialDatasExcelParams();
    params.Asc = args.asc;
    params.Desc = args.desc;
    params.Conditions = this.getConditions(args, names, user);
    params.PropertyIds = [...names];

    let url = await this.service.partialData.excel(params);
    return url.Url;
  }
  async get(name: string, value: string): Promise<PropertyValueModel> {
    let pv = new PropertyValue();
    pv.PropertyId = name;
    pv.Value = value;
    return this.vmConverter.property_value.maintenance.convert(pv);
  }
  async load(
    index: number,
    size: number = 10,
    names: string[],
    args: MaintenanceProfileTableArgs,
    user: User
  ): Promise<PagedList<PartialData>> {
    let skip: string[] = [];
    let data = await this.getData(index, size, names, args, user, skip);

    let model = this.converter.convert(data, skip);

    return model;
  }

  async getData(
    index: number,
    size: number = 10,
    names: string[],
    args: MaintenanceProfileTableArgs,
    user: User,
    skip: string[]
  ): Promise<PagedList<PartialData>> {
    let params = new GetPartialDatasParams();
    params.PageIndex = index;
    params.PageSize = size;
    params.PropertyIds = args.tableIds;
    params.PropertyIds = [...names];

    let mest = ['ProfileState', 'ConstructionState', 'MaintenanceUserId'];

    for (let i = 0; i < mest.length; i++) {
      if (!names.includes(mest[i])) {
        params.PropertyIds.push(mest[i]);
        skip.push(mest[i]);
      }
    }

    params.Asc = args.asc;

    params.Desc = args.desc;

    if (!params.Asc && !params.Desc) {
      params.Desc = 'UpdateTime';
    }
    let all = await this.service.property.all();
    params.Conditions = this.getConditions(
      args,
      all.map((x) => x.Path),
      user
    );

    return this.service.partialData.list(params);
  }

  private getConditions(
    args: MaintenanceProfileTableArgs,
    names: string[],
    user: User
  ) {
    let conditions: Condition[] = [];

    if (args.name) {
      names.forEach((name) => {
        let condition = new Condition<string>();
        condition.Value = args.name;
        condition.PropertyId = name;
        condition.Operator = ConditionOperator.Like;
        condition.OrGroup = 1;
        conditions.push(condition);
      });
    }

    if (args.materials && args.materials.length > 0) {
      conditions.push(this.getConditionByMaterials(args.materials));
    }

    for (const key in args.enums) {
      let value = args.enums[key];
      if (value !== undefined) {
        conditions.push(this.getConditionByName(value, key));
      }
    }

    if (user) {
      let condition = this.getConditionByUser(user);
      if (condition) {
        conditions.push(condition);
      }
    }

    return conditions;
  }
  private getConditionByUser(user: User) {
    let condition = new Condition();
    condition.Operator = ConditionOperator.Eq;
    switch (user.UserType) {
      case UserType.maintenance:
        condition.PropertyId = 'MaintenanceUserId';
        condition.Value = user.Id;
        break;
      default:
        return undefined;
    }
    return condition;
  }
  private getConditionByName(value: number | null, name: string) {
    let condition = new Condition<number | null>();
    condition.Value = value;
    condition.PropertyId = name;
    condition.Operator = ConditionOperator.Eq;
    condition.OrGroup = 1;
    return condition;
  }

  private getConditionByMaterials(value: number[]) {
    let condition = new Condition<number[]>();
    condition.Value = value;
    condition.PropertyId = 'MaterialItems.Id';
    condition.Operator = ConditionOperator.In;
    condition.OrGroup = 1;
    return condition;
  }
}
