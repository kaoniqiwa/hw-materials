import { ViewModelConverter } from 'src/app/converter/view-model.converter';
import { IBusiness } from 'src/app/interface/business.interface';
import { IConverter } from 'src/app/interface/converter.interface';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { Page, PagedList } from 'src/app/network/entity/page.entity';
import { GetGarbageStationProfilesParams } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { GarbageStationProfileTableArgs } from './garbage-station-profile-table.model';

export class GarbageStationProfileTableBusiness
  implements
    IBusiness<
      PagedList<GarbageStationProfile>,
      PagedList<GarbageStationProfileModel>
    >
{
  constructor(
    private service: GarbageStationProfilesRequestService,
    private converter: ViewModelConverter
  ) {}
  Converter?: IConverter<
    PagedList<GarbageStationProfile>,
    PagedList<GarbageStationProfileModel>
  >;
  async load(
    args: GarbageStationProfileTableArgs
  ): Promise<PagedList<GarbageStationProfileModel>> {
    let data = await this.getData(args.index, args.name, args.size);
    return data;
  }
  getData(
    index: number,
    name?: string,
    size: number = 10
  ): Promise<PagedList<GarbageStationProfile>> {
    let params = new GetGarbageStationProfilesParams();
    params.PageIndex = index;
    params.PageSize = size;
    params.Name = name;
    return this.service.list(params).catch((x) => {
      let paged = new PagedList<GarbageStationProfile>();
      paged.Data = [];
      paged.Page = new Page();
      paged.Page.PageCount = 1;
      paged.Page.PageIndex = 1;
      paged.Page.PageSize = 10;
      paged.Page.RecordCount = 10;
      paged.Page.TotalRecordCount = 10;
      for (let i = 0; i < 10; i++) {
        let item = new GarbageStationProfile();
        item.ProfileName = '档案' + (i + 1);
        paged.Data.push(item);
      }
      return paged;
    });
  }
}
