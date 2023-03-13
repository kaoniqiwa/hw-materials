import { Injectable } from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { ViewModelConverter } from 'src/app/converter/view-model.converter';
import { LabelModel } from 'src/app/model/label.model';
import { Label } from 'src/app/network/entity/label.entity';
import { PagedList } from 'src/app/network/entity/page.entity';
import { GetLabelsParams } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { GarbageProfilesLabelTableArgs } from './garbage-profiles-label-table.model';

@Injectable()
export class GarbageProfilesLabelTableBusiness
  implements IBusiness<PagedList<Label>, PagedList<LabelModel>>
{
  constructor(
    private service: GarbageStationProfilesRequestService,
    private converter: ViewModelConverter
  ) {}
  async load(
    index: number,
    size: number = 10,
    args: GarbageProfilesLabelTableArgs
  ): Promise<PagedList<LabelModel>> {
    let data = await this.getData(index, size, args);
    let model = new PagedList<LabelModel>();
    model.Page = data.Page;
    model.Data = data.Data.map((x) => {
      return this.converter.label.convert(x);
    });
    return model;
  }
  getData(
    index: number,
    size: number = 10,
    args: GarbageProfilesLabelTableArgs
  ): Promise<PagedList<Label>> {
    let params = new GetLabelsParams();
    params.PageIndex = index;
    params.PageSize = size;
    params.Name = args.Name;
    params.State = args.State;
    params.Category = args.Category;
    params.Asc = args.asc;
    params.Desc = args.desc;
    return this.service.label.list(params);
  }
}
