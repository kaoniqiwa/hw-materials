import { Injectable } from '@angular/core';
import { CommonNestNode } from 'src/app/common/components/common-tree/common-nest-node.model';
import { ValueNamePairConverter } from 'src/app/converter/value-name-pair.converter';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { GarbageStationProfileFunctionsTreeConverter } from './garbage-station-profile-functions-tree.converter';

@Injectable()
export class GarbageStationProfileFunctionsTreeBusiness {
  public nestedNodeMap = new Map<string, CommonNestNode>();

  constructor(
    private service: GarbageStationProfilesRequestService,
    private _converter: GarbageStationProfileFunctionsTreeConverter,
    private converter: ValueNamePairConverter
  ) {}
  async init() {
    this.nestedNodeMap.clear();

    let data = await this.getDatas();

    let model = data.map((x) => {
      return this.converter.convert(x);
    });

    let res = this._converter.buildNestTree(model);
    return res;
  }

  private async getDatas() {
    return this.service.property.getEnumByName('Functions');
  }
}
