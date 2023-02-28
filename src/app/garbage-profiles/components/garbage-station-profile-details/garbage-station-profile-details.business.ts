import { Injectable } from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';

@Injectable()
export class GarbageStationProfileDetailsBusiness
  implements IBusiness<GarbageStationProfileModel>
{
  constructor(private service: GarbageStationProfilesRequestService) {}
  load(...args: any): Promise<GarbageStationProfileModel> {
    throw new Error('Method not implemented.');
  }
  getData(...args: any): Promise<GarbageStationProfileModel> {
    throw new Error('Method not implemented.');
  }
  setData(model: GarbageStationProfileModel) {
    return this.service.create(model);
  }
}
