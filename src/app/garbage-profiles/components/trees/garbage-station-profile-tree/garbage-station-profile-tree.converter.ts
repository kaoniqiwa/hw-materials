import { Injectable } from '@angular/core';
import { CommonNestNode } from 'src/app/common/components/common-tree/common-nest-node.model';
import { CommonTreeConverter } from 'src/app/common/components/common-tree/common-tree.converter';
import { CommonTreeModel } from 'src/app/common/components/common-tree/common-tree.model';
import { MaterialModel } from 'src/app/model/material.model';
import { ValueNamePairModel } from 'src/app/model/value-name-pair.model';
import { GarbageStationProfileTreeModel } from './garbage-station-profile-tree.model';

export type GarbageStationProfileTreeSource = MaterialModel;

@Injectable()
export class GarbageStationProfileTreeConverter extends CommonTreeConverter {
  Convert(source: CommonTreeModel, ...res: any[]): CommonNestNode {
    if (source instanceof GarbageStationProfileTreeModel) {
      return this._fromProfile(source);
    } else if (source instanceof ValueNamePairModel) {
      return this._fromState(source);
    }
    throw new Error('Method not implemented.');
  }

  private _fromState(
    item: ValueNamePairModel
  ): CommonNestNode<ValueNamePairModel> {
    const node = new CommonNestNode();
    node.Id = item.Value.toString();
    node.Name = item.Name;
    node.HasChildren = true;
    node.ParentId = undefined;
    node.ChildrenLoaded = true;
    node.ParentNode = undefined;
    node.IconClass = '';
    node.RawData = item;
    node.hideArrow = true;

    return node;
  }

  private _fromProfile(
    item: GarbageStationProfileTreeModel
  ): CommonNestNode<GarbageStationProfileTreeModel> {
    const node = new CommonNestNode();
    node.Id = item.Id.toString();
    node.Name = item.Name;
    node.HasChildren = false;
    node.ParentId = item.State.toString();
    node.ChildrenLoaded = true;
    node.ParentNode = undefined;
    node.IconClass = 'mdi mdi-content-paste';
    node.RawData = item;
    node.hideArrow = true;
    return node;
  }
}
