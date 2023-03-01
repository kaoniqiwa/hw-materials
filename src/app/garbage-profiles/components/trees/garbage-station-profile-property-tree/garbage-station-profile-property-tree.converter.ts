import { Injectable } from '@angular/core';
import { CommonNestNode } from 'src/app/common/components/common-tree/common-nest-node.model';
import { CommonTreeConverter } from 'src/app/common/components/common-tree/common-tree.converter';
import { CommonTreeModel } from 'src/app/common/components/common-tree/common-tree.model';
import { Property } from 'src/app/network/entity/property.entity';
import { ValueNamePair } from 'src/app/network/entity/value-name-pair.entity';

@Injectable({
  providedIn: 'root',
})
export class GarbageStationProfilePropertyTreeConverter extends CommonTreeConverter {
  Convert(source: CommonTreeModel, ...res: any[]): CommonNestNode {
    if (source instanceof Property) {
      return this.fromProperty(source);
    } else {
      return this.fromValueNamePair(source);
    }
    throw new Error('Method not implemented.');
  }

  private fromValueNamePair(
    item: CommonTreeModel
  ): CommonNestNode<ValueNamePair> {
    const node = new CommonNestNode();
    node.Id = item.Id.toString();
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

  private fromProperty(item: Property): CommonNestNode<Property> {
    const node = new CommonNestNode();
    node.Id = item.Id.toString();
    node.Name = item.Description;
    node.HasChildren = false;
    node.ParentId = item.Category.toString();
    node.ChildrenLoaded = true;
    node.ParentNode = undefined;
    node.IconClass = '';
    node.RawData = item;
    node.hideArrow = true;
    return node;
  }
}
