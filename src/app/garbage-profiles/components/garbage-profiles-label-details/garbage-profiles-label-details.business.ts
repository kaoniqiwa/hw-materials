import { Injectable } from '@angular/core';
import {
  ICreate,
  IUpdate,
} from 'src/app/common/interfaces/bussiness.interface';
import { ViewModelConverter } from 'src/app/converter/view-model.converter';
import { LabelModel } from 'src/app/model/label.model';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';

@Injectable()
export class GarbageProfilesLabelDetailsBusiness
  implements ICreate<LabelModel>, IUpdate<LabelModel>
{
  constructor(
    private service: GarbageStationProfilesRequestService,
    private converter: ViewModelConverter
  ) {}
  create(model: LabelModel): Promise<LabelModel> {
    model.CreationTime = new Date();
    return this.service.label.create(model).then((x) => {
      return this.converter.label.convert(x);
    });
  }
  update(model: LabelModel): Promise<LabelModel> {
    return this.service.label.update(model).then((x) => {
      return this.converter.label.convert(x);
    });
  }
}
