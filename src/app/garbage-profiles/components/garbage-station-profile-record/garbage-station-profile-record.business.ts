import { Injectable } from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { ProfileType } from 'src/app/network/entity/profile-type.entity';
import { GarbageProfilesBasicRequestService } from 'src/app/network/request/garbage-profiles/basics/garbage-profiles-basics.service';
import { GarbageStationProfileRecordSource } from './garbage-station-profile-record.model';

@Injectable()
export class GarbageStationProfileRecordBusiness
  implements IBusiness<ProfileType[], GarbageStationProfileRecordSource>
{
  constructor(private service: GarbageProfilesBasicRequestService) {}

  async load(...args: any): Promise<GarbageStationProfileRecordSource> {
    let data = await this.getData();
    let model = new GarbageStationProfileRecordSource();
    model.types = data;
    return model;
  }
  getData(...args: any): Promise<ProfileType[]> {
    return this.service.profile.type();
  }
}
