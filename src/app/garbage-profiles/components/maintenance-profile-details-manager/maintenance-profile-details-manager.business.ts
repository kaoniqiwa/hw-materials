import { Injectable } from '@angular/core';
import { ConditionOperator } from 'src/app/enum/condition-operator.enum';
import { Condition } from 'src/app/network/entity/condition.entity';
import { GetMaintenanceProfilePartialDatasParams, GetMaintenanceProfilePropertiesParams } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';

@Injectable()
export class MaintenanceProfileDetailsManagerBusiness {
  constructor(
    private _maintenanceProfileRequest: MaintenanceProfileRequestService
  ) {}

  getModel(id: string) {
    return this._maintenanceProfileRequest.get(id);
  }

  async getPartialData(id: string, propertyIds: string[]) {
    let params = new GetMaintenanceProfilePartialDatasParams();
    params.PropertyIds = propertyIds;

    params.Conditions = [];

    let condition = new Condition();
    condition.Operator = ConditionOperator.Eq;
    condition.Value = id;
    condition.PropertyId = 'Id';
    params.Conditions.push(condition);

    let res = await this._maintenanceProfileRequest.partialData.list(params);
    return res.Data[0];
  }

  async listProperty(searchInfo: PropertySearchInfo) {
    let params = new GetMaintenanceProfilePropertiesParams();
    if (searchInfo.Category) params.Category = searchInfo.Category;
    if (searchInfo.Name) params.Name = searchInfo.Name;
    let res = await this._maintenanceProfileRequest.property.list(params);
    return res.Data;
  }
}
import { PropertyCategory } from 'src/app/enum/property-category.enum';

export interface PropertySearchInfo {
  Name?: string;
  Category?: PropertyCategory;
}
