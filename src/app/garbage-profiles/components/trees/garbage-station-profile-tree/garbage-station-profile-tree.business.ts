import { Injectable } from '@angular/core';
import { CommonNestNode } from 'src/app/common/components/common-tree/common-nest-node.model';
import { ValueNamePairConverter } from 'src/app/converter/value-name-pair.converter';
import { ConditionOperator } from 'src/app/enum/condition-operator.enum';
import { Condition } from 'src/app/network/entity/condition.entity';
import { GetPartialDatasParams } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';

import { GarbageStationProfileTreeConverter } from './garbage-station-profile-tree.converter';
import { GarbageStationProfileTreeModel } from './garbage-station-profile-tree.model';

@Injectable()
export class MaterialListBusiness {
  public nestedNodeMap = new Map<
    string,
    CommonNestNode<GarbageStationProfileTreeModel>
  >();

  constructor(
    private service: GarbageStationProfilesRequestService,
    private _converter: GarbageStationProfileTreeConverter,
    private converter: ValueNamePairConverter
  ) {}
  async init(name?: string) {
    this.nestedNodeMap.clear();

    let data_states = await this.getStates();
    let model_states = data_states.map((x) => {
      return this.converter.convert(x);
    });

    let data_profiles = await this.getData(name);
    let model_profiles: GarbageStationProfileTreeModel[] = data_profiles.map(
      (x) => {
        let model = new GarbageStationProfileTreeModel();
        model.Id = x.Id;
        model.Name = x['ProfileName'];
        model.State = x['ProfileState'];
        return model;
      }
    );
    let data = [...model_states, ...model_profiles];

    let res = this._converter.buildNestTree(data);
    return res;
  }
  searchNode(condition: string) {
    return this.init(condition);
  }

  async getData(name?: string) {
    let params = new GetPartialDatasParams();
    params.PropertyIds = ['ProfileName', 'ProfileState'];
    if (name) {
      let condition = new Condition();
      condition.PropertyId = 'ProfileName';
      condition.Operator = ConditionOperator.Like;
      condition.Value = name;
      params.Conditions = [condition];
    }
    let paged = await this.service.partialData.list(params);
    return paged.Data;
  }

  private getStates() {
    return this.service.property.getEnumByName('ProfileState');
  }
}
