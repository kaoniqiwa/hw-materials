import { Injectable } from '@angular/core';
import { IDelete } from 'src/app/common/interfaces/bussiness.interface';
import { Label } from 'src/app/network/entity/label.entity';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';

@Injectable()
export class GarbageProfilesLabelManagerBusiness implements IDelete<Label[]> {
  constructor(private service: GarbageStationProfilesRequestService) {}
  delete(models: Label[]): Promise<Label[]> {
    let all = models
      .map((x) => x.Id)
      .map((id) => {
        return this.service.label.delete(id);
      });
    return Promise.all(all);
  }
}
