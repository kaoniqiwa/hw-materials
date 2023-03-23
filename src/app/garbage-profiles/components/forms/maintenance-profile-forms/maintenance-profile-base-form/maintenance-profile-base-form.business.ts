import { Injectable } from '@angular/core';
import { ConditionOperator } from 'src/app/enum/condition-operator.enum';
import { Condition } from 'src/app/network/entity/condition.entity';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import {
  GetMaintenanceProfilePartialDatasParams,
  GetMaintenanceProfilePropertiesParams,
} from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';
import { MaintenanceProfileBasePropertySearchInfo } from './maintenance-profile-base-form.model';

@Injectable()
export class MaintenanceProfileBaseFormBusiness {
  constructor(
    protected _garbageStationProfilesRequest: GarbageStationProfilesRequestService,
    private _maintenanceProfileRequest: MaintenanceProfileRequestService
  ) {}
  getModel(id: string) {
    return this._maintenanceProfileRequest.get(id);
  }
  getPropertyByCategory(category: number) {
    return this.listProperty({
      Category: category,
    });
  }

  getPropertyByNames(
    searchInfos: Array<MaintenanceProfileBasePropertySearchInfo>
  ) {
    return Promise.all(searchInfos.map((info) => this.listProperty(info)));
  }
  async listProperty(searchInfo: MaintenanceProfileBasePropertySearchInfo) {
    let params = new GetMaintenanceProfilePropertiesParams();
    if (searchInfo.Category) params.Category = searchInfo.Category;
    if (searchInfo.Name) params.Name = searchInfo.Name;
    return this._maintenanceProfileRequest.property.list(params);
  }

  getPartialData(id: string, propertyIds: string[]) {
    let params = new GetMaintenanceProfilePartialDatasParams();
    params.PropertyIds = propertyIds;

    params.Conditions = [];

    let condition = new Condition();
    condition.Operator = ConditionOperator.Eq;
    condition.Value = id;
    condition.PropertyId = 'Id';
    params.Conditions.push(condition);

    return this._maintenanceProfileRequest.partialData.list(params);
  }
}
