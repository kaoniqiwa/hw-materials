import { Injectable } from '@angular/core';
import { IGet, IUpdate } from 'src/app/common/interfaces/bussiness.interface';
import { ConditionOperator } from 'src/app/enum/condition-operator.enum';
import { Condition } from 'src/app/network/entity/condition.entity';
import { MaintenanceProfile } from 'src/app/network/entity/maintenance-profile.entity';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import { IParams } from 'src/app/network/request/IParams.interface';
import {
  ConstructionApplyParams,
  ConstructionApproveParams,
  GetMaintenanceProfilePartialDatasParams,
} from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';
import { MaintenanceProfileManagerConstructionBusiness } from './maintenance-profile-manager-construction.business';

@Injectable()
export class MaintenanceProfileManagerBusiness
  implements IGet<PartialData | undefined>, IUpdate<MaintenanceProfile>
{
  constructor(
    private service: MaintenanceProfileRequestService,
    public construction: MaintenanceProfileManagerConstructionBusiness
  ) {}

  async get(id: string): Promise<PartialData | undefined> {
    let params = new GetMaintenanceProfilePartialDatasParams();
    params.PropertyIds = [
      'ProfileState',
      'ConstructionState',
      'MaintenanceUserId',
    ];
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

  update(
    id: string,
    params: IParams,
    state?: number
  ): Promise<MaintenanceProfile> {
    switch (state) {
      case 1:
        return this.construction.approve(
          id,
          params as ConstructionApproveParams
        );
      case null:
      case undefined:
      default:
        return this.construction.apply(id, params as ConstructionApplyParams);
    }
  }
}
