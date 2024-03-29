import { Injectable } from '@angular/core';
import { CommonNestNode } from 'src/app/common/components/common-tree/common-nest-node.model';
import { ViewModelConverter } from 'src/app/converter/view-model.converter';
import { Material } from 'src/app/network/entity/material.entity';

import { GetGarbageProfilesMaterialsParams } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';
import { GarbageProfilesMaterialRequestService } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.service';
import { MaterialTreeConverter } from './material-tree.converter';

@Injectable()
export class MaterialListBusiness {
  public nestedNodeMap = new Map<string, CommonNestNode<Material>>();

  constructor(
    private service: GarbageProfilesMaterialRequestService,
    private _converter: MaterialTreeConverter,
    private converter: ViewModelConverter
  ) {}
  async init(condition: string = '') {
    this.nestedNodeMap.clear();

    let params = new GetGarbageProfilesMaterialsParams();
    params.Name = condition;

    let category = await this.Categories();

    let tmp = await this._listMaterials(params);

    let data = [
      ...category,
      ...tmp.Data.map((x) => {
        return this.converter.material.convert(x);
      }),
    ];

    let res = this._converter.buildNestTree(data);
    return res;
  }
  searchNode(condition: string) {
    return this.init(condition);
  }

  private _listMaterials(params: GetGarbageProfilesMaterialsParams) {
    return this.service.list(params);
  }
  private Categories() {
    return this.service.category.all();
  }
}
