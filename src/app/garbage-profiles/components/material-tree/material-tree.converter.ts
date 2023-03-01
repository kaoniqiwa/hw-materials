import { Injectable } from '@angular/core';
import { CommonNestNode } from 'src/app/common/components/common-tree/common-nest-node.model';
import { CommonTreeConverter } from 'src/app/common/components/common-tree/common-tree.converter';
import { CommonTreeModel } from 'src/app/common/components/common-tree/common-tree.model';
import { MaterialCategory } from 'src/app/network/entity/material-category.entity';
import { Material } from 'src/app/network/entity/material.entity';

export type MaterialTreeSource = Material;

@Injectable({
  providedIn: 'root',
})
export class MaterialTreeConverter extends CommonTreeConverter {
  Convert(source: CommonTreeModel, ...res: any[]): CommonNestNode {
    if (source instanceof Material) {
      return this._fromResourceMaterial(source);
    } else if (source instanceof MaterialCategory) {
      return this._fromMaterialCategory(source);
    }
    throw new Error('Method not implemented.');
  }

  private _fromMaterialCategory(
    item: MaterialCategory
  ): CommonNestNode<MaterialCategory> {
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

  private _fromResourceMaterial(item: Material): CommonNestNode<Material> {
    const node = new CommonNestNode();
    node.Id = item.Id.toString();
    node.Name = item.Name;
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
