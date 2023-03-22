import { Injectable } from '@angular/core';
import { IDelete, IGet } from 'src/app/common/interfaces/bussiness.interface';
import { ConditionOperator } from 'src/app/enum/condition-operator.enum';
import { Condition } from 'src/app/network/entity/condition.entity';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import {
  GetPartialDatasExcelParams,
  GetPartialDatasParams,
} from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { GarbageStationProfileTableArgs } from '../tables/garbage-station-profile-table/garbage-station-profile-table.model';
import { GarbageStationProfileManagerMaterialPutoutBusiness } from './business/garbage-station-profile-manager-material-putout.business';

@Injectable()
export class GarbageStationProfileManagerBusiness
  implements IDelete<GarbageStationProfile>, IGet<PartialData | undefined>
{
  constructor(
    private service: GarbageStationProfilesRequestService,
    public putout: GarbageStationProfileManagerMaterialPutoutBusiness
  ) {}
  async get(id: string): Promise<PartialData | undefined> {
    let params = new GetPartialDatasParams();
    params.PropertyIds = ['ProfileState'];
    let condition = new Condition();
    condition.PropertyId = 'Id';
    condition.Value = id;
    condition.Operator = ConditionOperator.Eq;
    params.Conditions = [condition];
    let paged = await this.service.partialData.list(params);
    if (paged.Data && paged.Data.length > 0) {
      return paged.Data[0];
    }
    return undefined;
  }
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
