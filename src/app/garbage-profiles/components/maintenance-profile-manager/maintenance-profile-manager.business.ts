import { Injectable } from '@angular/core';
import { IGet } from 'src/app/common/interfaces/bussiness.interface';
import { ConditionOperator } from 'src/app/enum/condition-operator.enum';
import { Condition } from 'src/app/network/entity/condition.entity';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import { GetMaintenanceProfilePartialDatasParams } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';

@Injectable()
export class MaintenanceProfileManagerBusiness
  implements IGet<PartialData | undefined>
{
  constructor(private service: MaintenanceProfileRequestService) {}

  async get(id: string): Promise<PartialData | undefined> {
    let params = new GetMaintenanceProfilePartialDatasParams();
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
}
