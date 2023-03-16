import { Injectable } from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { ProfileStateStatisticResult } from 'src/app/network/entity/profile-state-statistic-result.entity';
import { GetLabelsParams } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { GarbageStationProfileIndexModel } from './garbage-station-profile-index.model';

@Injectable()
export class GarbageStationProfileIndexBusiness
  implements
    IBusiness<ProfileStateStatisticResult, GarbageStationProfileIndexModel>
{
  constructor(private service: GarbageStationProfilesRequestService) {}

  async load(...args: any): Promise<GarbageStationProfileIndexModel> {
    let data = await this.getData();
    let model = new GarbageStationProfileIndexModel();
    model.profiles = data.Items;

    data.Items.forEach((x) => {
      model.profileCount += x.Number;
    });
    let labels = await this.getLabels();
    model.labels = labels.Page.TotalRecordCount;
    return model;
  }
  getData(...args: any): Promise<ProfileStateStatisticResult> {
    return this.service.statistic.profileState();
  }
  getLabels() {
    let params = new GetLabelsParams();
    params.PageSize = 1;
    return this.service.label.list(params);
  }
}
