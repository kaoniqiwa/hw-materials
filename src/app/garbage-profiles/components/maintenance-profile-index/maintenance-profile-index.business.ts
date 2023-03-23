import { Injectable } from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { ProfileStateStatisticResult } from 'src/app/network/entity/profile-state-statistic-result.entity';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';

import { MaintenanceProfileIndexModel } from './maintenance-profile-index.model';

@Injectable()
export class MaintenanceProfileIndexBusiness
  implements
    IBusiness<ProfileStateStatisticResult, MaintenanceProfileIndexModel>
{
  constructor(private service: MaintenanceProfileRequestService) {}

  async load(...args: any): Promise<MaintenanceProfileIndexModel> {
    let data = await this.getData();
    let model = new MaintenanceProfileIndexModel();
    model.profiles = data.Items;

    data.Items.forEach((x) => {
      model.profileCount += x.Number;
    });

    return model;
  }
  getData(...args: any): Promise<ProfileStateStatisticResult> {
    return this.service.statistic.state();
  }
}
