import { Injectable } from '@angular/core';
import {
  ICreate,
  IDelete,
  IUpdate,
} from 'src/app/common/interfaces/bussiness.interface';
import { Label } from 'src/app/network/entity/label.entity';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';

@Injectable()
export class GarbageProfilesLabelManagerBusiness
  implements ICreate<Label>, IUpdate<Label>, IDelete<Label[]>
{
  constructor(private service: GarbageStationProfilesRequestService) {}
  create(model: Label): Promise<Label> {
    model.CreationTime = new Date();
    return this.service.label.create(model);
  }
  update(...args: any[]): Promise<Label> {
    throw new Error('Method not implemented.');
  }
  delete(models: Label[]): Promise<Label[]> {
    let all = models
      .map((x) => x.Id)
      .map((id) => {
        return this.service.label.delete(id);
      });
    return Promise.all(all);
  }
}
