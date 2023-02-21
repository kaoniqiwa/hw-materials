import { Injectable } from '@angular/core';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { Page, PagedList } from 'src/app/network/entity/page.entity';
import { GetGarbageStationProfilesParams } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { GarbageStationProfileTableConverter } from './garbage-station-profile-table.converter';
import {
  GarbageStationProfileTableArgs,
  IGarbageStationProfileTableBusiness,
} from './garbage-station-profile-table.model';

@Injectable()
export class GarbageStationProfileTableBusiness
  implements IGarbageStationProfileTableBusiness
{
  constructor(
    private service: GarbageStationProfilesRequestService,
    public Converter: GarbageStationProfileTableConverter
  ) {}
  async load(
    args: GarbageStationProfileTableArgs,
    index: number,
    size: number = 10
  ): Promise<PagedList<GarbageStationProfileModel>> {
    let data = await this.getData(index, size, args.Name);
    let model = this.Converter.Convert(data);
    return model;
  }
  getData(
    index: number,
    size: number = 10,
    name?: string
  ): Promise<PagedList<GarbageStationProfile>> {
    let params = new GetGarbageStationProfilesParams();
    params.PageIndex = index;
    params.PageSize = size;
    params.ProfileName = name;
    return this.service.list(params).catch((x) => {
      let paged = new PagedList<GarbageStationProfile>();
      paged.Data = [];
      paged.Page = new Page();
      paged.Page.PageCount = 1;
      paged.Page.PageIndex = 1;
      paged.Page.PageSize = 10;
      paged.Page.RecordCount = 3;
      paged.Page.TotalRecordCount = 10;
      for (let i = 0; i < paged.Page.RecordCount; i++) {
        let item = new GarbageStationProfile();
        item.ProfileName = '档案' + (i + 1);
        paged.Data.push(item);
      }
      return paged;
    });
  }

  update(instance: GarbageStationProfile): Promise<GarbageStationProfileModel> {
    return this.service.update(instance).then((x) => {
      return this.Converter.vmConverter.GarbageStationProfile(x);
    });
  }
}
