import { Injectable } from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
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
    let data = await this.getData(index, size, ids, args.asc, args.desc);
    let model = this.converter.Convert(data);
    return model;
  }
  getData(
    index: number,
    size: number = 10,
    ids?: string[],
    asc?: string,
    desc?: string
  ): Promise<PagedList<PartialData>> {
    let params = new GetPartialDatasParams();
    params.PageIndex = index;
    params.PageSize = size;
    params.PropertyIds = ids;
    params.Asc = asc;
    params.Desc = desc;

    return this.service.partialData.list(params);
  }
}
