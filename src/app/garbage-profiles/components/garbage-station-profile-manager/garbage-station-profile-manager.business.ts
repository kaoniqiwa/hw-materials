import { Injectable } from '@angular/core';
import { IDelete } from 'src/app/common/interfaces/bussiness.interface';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { GetPartialDatasExcelParams } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { GarbageStationProfileTableArgs } from '../tables/garbage-station-profile-table/garbage-station-profile-table.model';
import { GarbageStationProfileManagerMaterialPutoutBusiness } from './business/garbage-station-profile-manager-material-putout.business';

@Injectable()
export class GarbageStationProfileManagerBusiness
  implements IDelete<GarbageStationProfile>
{
  constructor(
    private service: GarbageStationProfilesRequestService,
    public putout: GarbageStationProfileManagerMaterialPutoutBusiness
  ) {}
  delete(id: string): Promise<GarbageStationProfile> {
    return this.service.delete(id);
  }
  excel(args: GarbageStationProfileTableArgs) {
    let params = new GetPartialDatasExcelParams();
    params.Conditions;
    params.Asc = args.asc;
    params.Desc = args.desc;
    return this.service.partialData.excels(params);
  }
}
