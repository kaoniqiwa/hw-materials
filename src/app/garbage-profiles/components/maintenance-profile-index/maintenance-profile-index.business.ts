import { Injectable } from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { ConstructionStateStatisticItem } from 'src/app/network/entity/construction-state-statistic-item.entity';
import { ConstructionStateStatisticResult } from 'src/app/network/entity/construction-state-statistic-result.entity';
import { ProfileStateStatisticResult } from 'src/app/network/entity/profile-state-statistic-result.entity';
import {
  GetMaintenanceProfileConstructionStateStatisticsParams,
  GetMaintenanceProfileStateStatisticsParams,
} from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';

import { MaintenanceProfileIndexModel } from './maintenance-profile-index.model';

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
  getConstructionData(
    constructionState?: number[]
  ): Promise<ConstructionStateStatisticResult> {
    let result = new ConstructionStateStatisticResult();
    result.Items = [];

    for (let i = 0; i < 4; i++) {
      let item = new ConstructionStateStatisticItem();
      item.ConstructionState = i;
      item.Number = i + 1;
      result.Items.push(item);
    }

    return Promise.resolve(result);

    let params = new GetMaintenanceProfileConstructionStateStatisticsParams();
    if (constructionState) params.ConstructionStates = constructionState;
    return this.service.statistic.constructionState();
  }
}
