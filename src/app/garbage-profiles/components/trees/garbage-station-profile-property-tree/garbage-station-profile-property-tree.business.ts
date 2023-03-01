import { Injectable } from '@angular/core';
import { CommonNestNode } from 'src/app/common/components/common-tree/common-nest-node.model';
import { ViewModelConverter } from 'src/app/converter/view-model.converter';
import { GetPropertiesParams } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';

import { GarbageStationProfilePropertyTreeConverter } from './garbage-station-profile-property-tree.converter';

@Injectable()
export class GarbageStationProfilePropertyTreeBusiness {
  public nestedNodeMap = new Map<string, CommonNestNode>();

  constructor(
    private service: GarbageStationProfilesRequestService,
    private _converter: GarbageStationProfilePropertyTreeConverter,
    private converter: ViewModelConverter
  ) {}
  async init(condition: string = '') {
    this.nestedNodeMap.clear();

    let property = await this.properties(condition);

    let category = await this.getCategories();

    let data = [
      ...property,
      ...category.map((x) => {
        return { Id: x.Value, Name: x.Name };
      }),
    ];

    let res = this._converter.buildNestTree(data);
    return res;
  }
  searchNode(condition: string) {
    return this.init(condition);
  }

  private getCategories() {
    return this.service.property.getEnumByName('ProfileState');
  }
  private async properties(name: string) {
    let params = new GetPropertiesParams();
    params.Description = name;
    let paged = await this.service.property.list(params);
    return paged.Data;
  }
}
