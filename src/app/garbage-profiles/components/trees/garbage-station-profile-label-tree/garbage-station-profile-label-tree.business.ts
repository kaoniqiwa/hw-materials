import { Injectable } from '@angular/core';
import { CommonNestNode } from 'src/app/common/components/common-tree/common-nest-node.model';
import { ViewModelConverter } from 'src/app/converter/view-model.converter';
import { GetLabelsParams } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { GarbageStationProfileLabelTreeConverter } from './garbage-station-profile-label-tree.converter';

@Injectable()
export class GarbageStationProfileLabelTreeBusiness {
  public nestedNodeMap = new Map<string, CommonNestNode>();

  constructor(
    private service: GarbageStationProfilesRequestService,
    private _converter: GarbageStationProfileLabelTreeConverter,
    private converter: ViewModelConverter
  ) {}
  async init(condition: string = '') {
    this.nestedNodeMap.clear();

    let data = await this.labels(condition);

    let model = data.map((x) => {
      return this.converter.label.convert(x);
    });

    let res = this._converter.buildNestTree(model);
    return res;
  }
  searchNode(condition: string) {
    return this.init(condition);
  }

  private async labels(name: string) {
    let params = new GetLabelsParams();
    params.Name = name;
    let paged = await this.service.label.list(params);
    return paged.Data;
  }
}
