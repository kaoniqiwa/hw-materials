import { Injectable } from '@angular/core';
import { IBusiness, IGet } from 'src/app/common/interfaces/bussiness.interface';
import { ViewModelConverter } from 'src/app/converter/view-model.converter';
import { ConditionOperator } from 'src/app/enum/condition-operator.enum';
import { PropertyValueModel } from 'src/app/model/property-value.model';
import { Condition } from 'src/app/network/entity/condition.entity';
import { PagedList } from 'src/app/network/entity/page.entity';
import {
  IPartialData,
  PartialData,
} from 'src/app/network/entity/partial-data.interface';
import { PropertyValue } from 'src/app/network/entity/property-value.entity';
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
  implements IBusiness<PagedList<IPartialData>>, IGet<PropertyValueModel>
{
  constructor(
    private service: MaintenanceProfileRequestService,
    private vmConverter: ViewModelConverter,
    private converter: MaintenanceProfileTableConverter,
    public config: MaintenanceProfileTableConfigBusiness
  ) {}
  async get(name: string, value: string): Promise<PropertyValueModel> {
    let pv = new PropertyValue();
    pv.PropertyId = name;
    pv.Value = value;
    return this.vmConverter.property_value.convert(pv);
  }
  async load(
    index: number,
    size: number = 10,
    names: string[],
    args: MaintenanceProfileTableArgs
  ): Promise<PagedList<IPartialData>> {
    let data = await this.getData(index, size, names, args);
    let model = this.converter.convert(data);
    return model;
  }

  async excel(args: MaintenanceProfileTableArgs, names: string[]) {
    let params = new GetPartialDatasExcelParams();
    params.Asc = args.asc;
    params.Desc = args.desc;
    params.Conditions = this.getConditions(args, names);
    params.PropertyIds = names;
    let url = await this.service.partialData.excel(params);
    return url.Url;
  }

  async getData(
    index: number,
    size: number = 10,
    names: string[],
    args: MaintenanceProfileTableArgs
  ): Promise<PagedList<PartialData>> {
    let params = new GetPartialDatasParams();
    params.PageIndex = index;
    params.PageSize = size;
    params.PropertyIds = args.tableIds;
    params.PropertyIds = names;
    params.Asc = args.asc;

    params.Desc = args.desc;

    if (!params.Asc && !params.Desc && params.PropertyIds) {
      if (params.PropertyIds.includes('UpdateTime')) {
        params.Desc = 'UpdateTime';
      }
    }
    let all = await this.service.property.all();
    params.Conditions = this.getConditions(
      args,
      all.map((x) => x.Path)
    );

    return this.service.partialData.list(params);
  }

  private getConditions(args: MaintenanceProfileTableArgs, names: string[]) {
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

    // if (args.materials && args.materials.length > 0) {
    //   let match = new ElemMatch();
    //   match.PropertyId = "M"
    // }

    for (const key in args.enums) {
      let value = args.enums[key];
      if (value !== undefined) {
        conditions.push(this.getConditionByName(value, key));
      }
    }

    return conditions;
  }

  private getConditionByName(value: number, name: string) {
    let condition = new Condition<number>();
    condition.Value = value;
    condition.PropertyId = name;
    condition.Operator = ConditionOperator.Eq;
    condition.OrGroup = 1;
    return condition;
  }
}
