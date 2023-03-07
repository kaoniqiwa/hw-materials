import { Injectable } from '@angular/core';
import { IBusiness, IGet } from 'src/app/common/interfaces/bussiness.interface';
import { ConditionOperator } from 'src/app/enum/condition-operator.enum';
import { PropertyValueModel } from 'src/app/model/property-value.model';
import { Condition } from 'src/app/network/entity/condition.entity';
import { PagedList } from 'src/app/network/entity/page.entity';
import {
  IPartialData,
  PartialData,
} from 'src/app/network/entity/partial-data.interface';
import { PropertyValue } from 'src/app/network/entity/property-value.entity';
import { GetPartialDatasParams } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { GarbageStationProfileTableConfigBusiness } from './garbage-station-profile-table-config.business';
import { GarbageStationProfileTableConverter } from './garbage-station-profile-table.converter';
import { GarbageStationProfileTableArgs } from './garbage-station-profile-table.model';

@Injectable()
export class GarbageStationProfileTableBusiness
  implements IBusiness<PagedList<IPartialData>>, IGet<PropertyValueModel>
{
  constructor(
    private service: GarbageStationProfilesRequestService,
    private converter: GarbageStationProfileTableConverter,
    public config: GarbageStationProfileTableConfigBusiness
  ) {}
  async get(name: string, value: string): Promise<PropertyValueModel> {
    let pv = new PropertyValue();
    pv.PropertyId = name;
    pv.Value = value;
    return this.converter.converter.PropertyValue(pv);
  }
  async load(
    index: number,
    size: number = 10,
    names: string[],
    args: GarbageStationProfileTableArgs
  ): Promise<PagedList<IPartialData>> {
    let data = await this.getData(index, size, names, args);
    let model = this.converter.Convert(data);
    return model;
  }
  getData(
    index: number,
    size: number = 10,
    names: string[],
    args: GarbageStationProfileTableArgs
  ): Promise<PagedList<PartialData>> {
    let params = new GetPartialDatasParams();
    params.PageIndex = index;
    params.PageSize = size;
    params.PropertyIds = args.tableIds;
    params.Asc = args.asc;
    params.Desc = args.desc;
    params.PropertyIds = names;

    params.Conditions = [];
    if (args.Name) {
      names.forEach((name) => {
        let condition = new Condition<string>();
        condition.Value = args.Name;
        condition.PropertyId = name;
        condition.Operator = ConditionOperator.Like;
        condition.OrGroup = 1;
        params.Conditions!.push(condition);
      });
    }

    if (args.labels && args.labels.length > 0) {
      params.Conditions.push(this.getConditionByLabels(args.labels));
    }
    if (args.ProfileState !== undefined) {
      params.Conditions.push(
        this.getConditionByProfileState(args.ProfileState)
      );
    }

    return this.service.partialData.list(params);
  }

  getConditionByLabels(value: number[]) {
    let condition = new Condition<number[]>();
    condition.Value = value;
    condition.PropertyId = 'Labels';
    condition.Operator = ConditionOperator.In;
    return condition;
  }
  getConditionByProfileState(value: number) {
    let condition = new Condition<number>();
    condition.Value = value;
    condition.PropertyId = 'ProfileState';
    condition.Operator = ConditionOperator.Eq;
    return condition;
  }
}
