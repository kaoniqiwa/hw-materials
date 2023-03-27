import { Injectable } from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { ProfileStateStatisticResult } from 'src/app/network/entity/profile-state-statistic-result.entity';
import { GetMaintenanceProfileStateStatisticsParams } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
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
}
