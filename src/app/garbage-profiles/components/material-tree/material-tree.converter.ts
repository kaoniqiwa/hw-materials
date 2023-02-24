import { Injectable } from '@angular/core';
import { CommonNestNode } from 'src/app/common/components/common-tree/common-nest-node.model';
import { CommonTreeConverter } from 'src/app/common/components/common-tree/common-tree.converter';
import { CommonTreeModel } from 'src/app/common/components/common-tree/common-tree.model';
import { Material } from 'src/app/network/entity/material.entity';

export type MaterialTreeSource = Material;

@Injectable({
  providedIn: 'root',
})
export class MaterialTreeConverter extends CommonTreeConverter {
  Convert(source: CommonTreeModel, ...res: any[]): CommonNestNode {
    if (source instanceof Material) {
      return this._fromResourceMaterial(source);
    }
    throw new Error('Method not implemented.');
  }

  private _fromResourceMaterial(item: Material): CommonNestNode<Material> {
    const node = new CommonNestNode();
    node.Id = item.Id.toString();
    node.Name = item.Name;
    node.HasChildren = false;
    node.ParentId = undefined;
    node.ChildrenLoaded = true;
    node.ParentNode = undefined;
    node.IconClass = '';
    node.RawData = item;
    node.hideArrow = true;
    return node;
  }
}
