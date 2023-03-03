import { Injectable } from '@angular/core';
import { IDelete } from 'src/app/common/interfaces/bussiness.interface';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';

@Injectable()
export class GarbageStationProfileManagerBusiness
  implements IDelete<GarbageStationProfile>
{
  constructor(private service: GarbageStationProfilesRequestService) {}
  delete(id: string): Promise<GarbageStationProfile> {
    return this.service.delete(id);
  }
}
