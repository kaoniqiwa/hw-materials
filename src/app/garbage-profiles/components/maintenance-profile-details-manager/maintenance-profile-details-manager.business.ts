import { Injectable } from '@angular/core';
import { ConditionOperator } from 'src/app/enum/condition-operator.enum';
import { Condition } from 'src/app/network/entity/condition.entity';
import {
  GetMaintenanceProfilePartialDatasParams,
  GetMaintenanceProfilePropertiesParams,
} from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';

@Injectable()
export class MaintenanceProfileDetailsManagerBusiness {
  constructor(
    private _maintenanceProfileRequest: MaintenanceProfileRequestService
  ) {}

  getModel(id: string) {
    return this._maintenanceProfileRequest.get(id);
  }
}
