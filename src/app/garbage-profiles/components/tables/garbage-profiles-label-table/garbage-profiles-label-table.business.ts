import { Injectable } from '@angular/core';
import {
  IBusiness,
  ICreate,
  IDelete,
  IUpdate,
} from 'src/app/common/interfaces/bussiness.interface';
import { ViewModelConverter } from 'src/app/converter/view-model.converter';
import { LabelModel } from 'src/app/model/label.model';
import { Label } from 'src/app/network/entity/label.entity';
import { PagedList } from 'src/app/network/entity/page.entity';
import { GetLabelsParams } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { GarbageProfilesLabelTableArgs } from './garbage-profiles-label-table.model';

@Injectable()
export class GarbageProfilesLabelTableBusiness
  implements
    IBusiness<PagedList<Label>, PagedList<LabelModel>>,
    ICreate<Label>,
    IDelete<Label>,
    IUpdate<Label>
{
  constructor(
    private service: GarbageStationProfilesRequestService,
    private converter: ViewModelConverter
  ) {}
  create(...args: any[]): Promise<Label> {
    throw new Error('Method not implemented.');
  }
  delete(...args: any[]): Promise<Label> {
    throw new Error('Method not implemented.');
  }
  update(...args: any[]): Promise<Label> {
    throw new Error('Method not implemented.');
  }
  async load(
    index: number,
    size: number = 10,
    args: GarbageProfilesLabelTableArgs
  ): Promise<PagedList<LabelModel>> {
    let data = await this.getData(
      index,
      size,
      args.Name,
      args.State,
      args.Category
    );
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
    name?: string,
    state?: number,
    category?: number
  ): Promise<PagedList<Label>> {
    let params = new GetLabelsParams();
    params.PageIndex = index;
    params.PageSize = size;
    params.Name = name;
    params.State = state;
    params.Category = category;
    return this.service.label.list(params);
  }
}
