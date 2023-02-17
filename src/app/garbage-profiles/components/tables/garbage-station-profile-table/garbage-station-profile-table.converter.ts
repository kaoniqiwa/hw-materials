import { ViewModelConverter } from 'src/app/converter/view-model.converter';
import { IConverter } from 'src/app/interface/converter.interface';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { PagedList } from 'src/app/network/entity/page.entity';

export class GarbageStationProfileTableConverter
  implements
    IConverter<
      PagedList<GarbageStationProfile>,
      PagedList<GarbageStationProfileModel>
    >
{
  constructor(converter: ViewModelConverter) {}

  Convert(
    source: PagedList<GarbageStationProfile>,
    ...res: any[]
  ): PagedList<GarbageStationProfileModel> {
    throw new Error('Method not implemented.');
  }
}
