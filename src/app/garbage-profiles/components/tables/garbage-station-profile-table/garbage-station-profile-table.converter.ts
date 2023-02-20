import { Injectable } from '@angular/core';
import { IConverter } from 'src/app/common/interfaces/converter.interface';
import { ViewModelConverter } from 'src/app/converter/view-model.converter';

import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { PagedList } from 'src/app/network/entity/page.entity';

@Injectable()
export class GarbageStationProfileTableConverter
  implements
    IConverter<
      PagedList<GarbageStationProfile>,
      PagedList<GarbageStationProfileModel>
    >
{
  constructor(public vmConverter: ViewModelConverter) {}

  Convert(
    source: PagedList<GarbageStationProfile>,
    ...res: any[]
  ): PagedList<GarbageStationProfileModel> {
    let paged = new PagedList<GarbageStationProfileModel>();
    paged.Page = source.Page;
    paged.Data = source.Data.map((x) => {
      return this.vmConverter.GarbageStationProfile(x);
    });
    return paged;
  }
}
