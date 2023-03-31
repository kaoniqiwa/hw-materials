import { Injectable } from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { ConditionOperator } from 'src/app/enum/condition-operator.enum';
import { Condition } from 'src/app/network/entity/condition.entity';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import { ProfileStateStatisticResult } from 'src/app/network/entity/profile-state-statistic-result.entity';
import {
  GetMaintenanceProfilePartialDatasParams,
  GetMaintenanceProfileStateStatisticsParams,
} from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';

import {
  ConstructionStateStatisticItem,
  MaintenanceProfileIndexModel,
} from './maintenance-profile-index.model';

@Injectable()
export class MaintenanceProfileIndexBusiness
  implements
    IBusiness<ProfileStateStatisticResult, MaintenanceProfileIndexModel>
{
  constructor(private service: MaintenanceProfileRequestService) {}

  async load(state?: number[]): Promise<MaintenanceProfileIndexModel> {
    let data = await this.getData(state);
    let model = new MaintenanceProfileIndexModel();
    model.profiles = data.Items;

    data.Items.forEach((x) => {
      model.profileCount += x.Number;
    });

    return model;
  }
  getData(state?: number[]): Promise<ProfileStateStatisticResult> {
    let params = new GetMaintenanceProfileStateStatisticsParams();
    params.ProfileStates = state;
    return this.service.statistic.state();
  }

  async getConstructionData() {
    let partialData: PartialData[] = [];
    let res: Map<number, ConstructionStateStatisticItem> = new Map();
    for (let i = 0; i < 4; i++) {
      let item = new ConstructionStateStatisticItem();
      item.ConstructionState = i;
      item.Number = 0;
      res.set(i, item);
    }

    let params = new GetMaintenanceProfilePartialDatasParams();
    params.PropertyIds = ['ConstructionState'];
    params.Conditions = [];

    let condition = new Condition();
    condition.PropertyId = 'ConstructionState';
    condition.Value = [1, 2, 3];
    condition.Operator = ConditionOperator.In;

    params.Conditions.push(condition);

    let { Data: Data1 } = await this.service.partialData.list(params);

    partialData.push(...Data1);

    params.Conditions = [];
    condition = new Condition();
    condition.PropertyId = 'ConstructionState';
    condition.Value = null;
    condition.Operator = ConditionOperator.Eq;

    params.Conditions.push(condition);
    let { Data: Data2 } = await this.service.partialData.list(params);
    Data2.forEach(
      (data) => (data['ConstructionState'] = +data['ConstructionState'])
    );
    partialData.push(...Data2);

    partialData.forEach((data) => {
      res.get(data['ConstructionState'])!.Number++;
    });

    return Array.from(res.values());
  }
}
