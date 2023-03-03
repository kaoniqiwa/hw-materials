import { Injectable } from '@angular/core';
import { IPromiseConverter } from 'src/app/common/interfaces/converter.interface';
import { wait } from 'src/app/common/tools/tool';
import { ViewModelConverter } from 'src/app/converter/view-model.converter';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/source.tool';

import { PagedList } from 'src/app/network/entity/page.entity';
import { PartialData } from 'src/app/network/entity/partial-data.interface';

@Injectable()
export class GarbageStationProfileTableConverter
  implements IPromiseConverter<PagedList<PartialData>, PagedList<PartialData>>
{
  constructor(
    private source: GarbageStationProfilesSourceTools,
    public converter: ViewModelConverter
  ) {}

  async Convert(source: PagedList<PartialData>, ...res: any[]) {
    return new Promise<PagedList<PartialData>>((resolve) => {
      wait(
        () => {
          return this.source.ProfileState.length > 0;
        },
        () => {
          let paged = new PagedList<PartialData>();
          paged.Page = source.Page;
          let all = source.Data.map((x) => {
            return this.converter.PartialData(x);
          });
          Promise.all(all).then((data) => {
            paged.Data = data;
            resolve(paged);
          });
        }
      );
    });
  }
}
