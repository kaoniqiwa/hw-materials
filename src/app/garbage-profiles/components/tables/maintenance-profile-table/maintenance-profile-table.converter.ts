import { Injectable } from '@angular/core';
import { IPromiseConverter } from 'src/app/common/interfaces/converter.interface';
import { wait } from 'src/app/common/tools/tool';
import { PartialDataConverter } from 'src/app/converter/partial-data.converter';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-source.tool';

import { PagedList } from 'src/app/network/entity/page.entity';
import { PartialData } from 'src/app/network/entity/partial-data.interface';

@Injectable()
export class MaintenanceProfileTableConverter
  implements IPromiseConverter<PagedList<PartialData>, PagedList<PartialData>>
{
  constructor(
    private source: GarbageStationProfilesSourceTools,
    public converter: PartialDataConverter
  ) {}

  async convert(source: PagedList<PartialData>, ...res: any[]) {
    return new Promise<PagedList<PartialData>>((resolve) => {
      wait(
        () => {
          return this.source.ProfileState.length > 0;
        },
        () => {
          let paged = new PagedList<PartialData>();
          paged.Page = source.Page;
          let all = source.Data.map((x) => {
            return this.converter.maintenance.convert(x);
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
