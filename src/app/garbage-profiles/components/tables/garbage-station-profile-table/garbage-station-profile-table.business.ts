import { Injectable } from '@angular/core';
import {
  IBusiness,
  IDownload,
  IGet,
} from 'src/app/common/interfaces/bussiness.interface';
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
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { GarbageStationProfileTableConfigBusiness } from './garbage-station-profile-table-config.business';
import { GarbageStationProfileTableConverter } from './garbage-station-profile-table.converter';
import { GarbageStationProfileTableArgs } from './garbage-station-profile-table.model';

@Injectable()
export class GarbageStationProfileTableBusiness
  implements
    IBusiness<PagedList<IPartialData>>,
    IGet<PropertyValueModel>,
    IDownload
{
  constructor(
    private service: GarbageStationProfilesRequestService,
    private converter: GarbageStationProfileTableConverter,
    private vmConverter: ViewModelConverter,
    public config: GarbageStationProfileTableConfigBusiness
  ) {}

  async download(args: GarbageStationProfileTableArgs, names: string[]) {
    let params = new GetPartialDatasExcelParams();
    params.Asc = args.asc;
    params.Desc = args.desc;
    params.Conditions = this.getConditions(args, names);
    params.PropertyIds = names;
    let url = await this.service.partialData.excels(params);
    return url.Url;
  }

  async get(name: string, value: string): Promise<PropertyValueModel> {
    let pv = new PropertyValue();
    pv.PropertyId = name;
    pv.Value = value;
    return this.vmConverter.property_value.garbagestation.convert(pv);
  }
  async load(
    index: number,
    size: number = 10,
    names: string[],
    args: GarbageStationProfileTableArgs
  ): Promise<PagedList<IPartialData>> {
    let data = await this.getData(index, size, names, args);
    let model = this.converter.convert(data);
    return model;
  }

  async getData(
    index: number,
    size: number = 10,
    names: string[],
    args: GarbageStationProfileTableArgs
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

  private getConditions(args: GarbageStationProfileTableArgs, names: string[]) {
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

    if (args.labels && args.labels.length > 0) {
      conditions.push(this.getConditionByLabels(args.labels));
    }
    if (args.functions && args.functions.length > 0) {
      conditions.push(this.getConditionByFunctions(args.functions));
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

    for (const key in args.cameras) {
      let value = args.cameras[key];
      if (value !== undefined) {
        conditions.push(this.getConditionByName(value, `Cameras.${key}`));
      }
    }

    return conditions;
  }

  private getConditionByLabels(value: number[]) {
    let condition = new Condition<number[]>();
    condition.Value = value;
    condition.PropertyId = 'Labels';
    condition.Operator = ConditionOperator.In;
    return condition;
  }
  private getConditionByFunctions(value: number[]) {
    let condition = new Condition<number[]>();
    condition.Value = value;
    condition.PropertyId = 'Functions';
    condition.Operator = ConditionOperator.In;
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
  private getConditionByName(value: number, name: string) {
    let condition = new Condition<number>();
    condition.Value = value;
    condition.PropertyId = name;
    condition.Operator = ConditionOperator.Eq;
    condition.OrGroup = 1;
    return condition;
  }
}
