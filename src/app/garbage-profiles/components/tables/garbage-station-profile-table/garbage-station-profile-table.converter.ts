import { Injectable } from '@angular/core';
import { IPromiseConverter } from 'src/app/common/interfaces/converter.interface';
import { wait } from 'src/app/common/tools/tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/source.tool';

import { PagedList } from 'src/app/network/entity/page.entity';
import { PartialData } from 'src/app/network/entity/partial-data.interface';

@Injectable()
export class GarbageStationProfileTableConverter
  implements IPromiseConverter<PagedList<PartialData>, PagedList<PartialData>>
{
  constructor(private source: GarbageStationProfilesSourceTools) {}

  async Convert(source: PagedList<PartialData>, ...res: any[]) {
    return new Promise<PagedList<PartialData>>((resolve) => {
      wait(
        () => {
          return this.source.ProfileState.length > 0;
        },
        () => {
          let paged = new PagedList<PartialData>();
          paged.Page = source.Page;
          paged.Data = source.Data.map((x) => {
            return this.item(x);
          });
          resolve(paged);
        }
      );
    });
  }

  item(source: PartialData): PartialData {
    let keys = GarbageStationProfilesSourceTools.getKeys();

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (key in source) {
        let value = this.source[key].find((x) => x.Value === source[key]);
        if (value) {
          source[key] = value.Name;
        }
      }
    }

    source;

    return source;
  }
}
