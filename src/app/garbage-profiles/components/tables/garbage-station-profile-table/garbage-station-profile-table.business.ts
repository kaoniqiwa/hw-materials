import { Injectable } from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { ConditionOperator } from 'src/app/enum/condition-operator.enum';
import { Condition } from 'src/app/network/entity/condition.entity';
import { PagedList } from 'src/app/network/entity/page.entity';
import {
  IPartialData,
  PartialData,
} from 'src/app/network/entity/partial-data.interface';
import { GetPartialDatasParams } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { GarbageStationProfileTableConfigBusiness } from './garbage-station-profile-table-config.business';
import { GarbageStationProfileTableConverter } from './garbage-station-profile-table.converter';
import { GarbageStationProfileTableArgs } from './garbage-station-profile-table.model';

@Injectable()
export class GarbageStationProfileTableBusiness
  implements IBusiness<PagedList<IPartialData>>
{
  constructor(
    private service: GarbageStationProfilesRequestService,
    private converter: GarbageStationProfileTableConverter,
    public config: GarbageStationProfileTableConfigBusiness
  ) {}
  async load(
    index: number,
    size: number = 10,
    ids: string[],
    args: GarbageStationProfileTableArgs
  ): Promise<PagedList<IPartialData>> {
    let data = await this.getData(index, size, ids, args);
    let model = this.converter.Convert(data);
    return model;
  }
  getData(
    index: number,
    size: number = 10,
    ids: string[],
    args: GarbageStationProfileTableArgs
  ): Promise<PagedList<PartialData>> {
    let params = new GetPartialDatasParams();
    params.PageIndex = index;
    params.PageSize = size;
    params.PropertyIds = args.tableIds;
    params.Asc = args.asc;
    params.Desc = args.desc;
    params.PropertyIds = ids;
    params.Conditions = [];
    if (args.ProfileState !== undefined) {
      let condition = new Condition<number>();
      condition.Value = args.ProfileState;
      condition.PropertyId = 'ProfileState';
      condition.Operator = ConditionOperator.Eq;
      params.Conditions.push(condition);
    }

    return this.service.partialData.list(params);
  }
}
