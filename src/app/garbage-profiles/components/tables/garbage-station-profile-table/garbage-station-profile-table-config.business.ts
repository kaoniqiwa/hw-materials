import { Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { UserConfigType } from 'src/app/enum/user-config-type.enum';
import { GetPropertiesParams } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { UserRequestService } from 'src/app/network/request/user/user-request.service';

@Injectable()
export class GarbageStationProfileTableConfigBusiness {
  constructor(
    private config: UserRequestService,
    private service: GarbageStationProfilesRequestService,
    private local: LocalStorageService
  ) {}

  async get(ids?: string[]) {
    if (!ids) {
      ids = (await this.config.config.get(
        this.local.user.Id,
        UserConfigType.GarbageStationProfileProperty
      )) as string[];
    }
    if (!ids || ids.length === 0) {
      ids = ['100002', '100003', '100005', '100006', '100007', '100051'];
    }

    let params = new GetPropertiesParams();
    params.Ids = ids;
    let paged = await this.service.property.list(params);
    return paged.Data;
  }
}
