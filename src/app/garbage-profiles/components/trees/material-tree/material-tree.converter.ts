import { Injectable } from '@angular/core';
import { CommonNestNode } from 'src/app/common/components/common-tree/common-nest-node.model';
import { CommonTreeConverter } from 'src/app/common/components/common-tree/common-tree.converter';
import { CommonTreeModel } from 'src/app/common/components/common-tree/common-tree.model';
import { MaterialCategoryType } from 'src/app/enum/material-category-type.enum';
import { MaterialModel } from 'src/app/model/material.model';
import { MaterialCategory } from 'src/app/network/entity/material-category.entity';

export type MaterialTreeSource = MaterialModel;

@Injectable()
export class MaterialTreeConverter extends CommonTreeConverter {
  Convert(source: CommonTreeModel, ...res: any[]): CommonNestNode {
    if (source instanceof MaterialModel) {
      return this._fromResourceMaterial(source);
    } else if (source instanceof MaterialCategory) {
      return this._fromMaterialCategory(source);
    }
    throw new Error('Method not implemented.');
  }

  getIconClass(category: MaterialCategoryType) {
    switch (category) {
      case MaterialCategoryType.camera:
        return 'howell-icon-video';
      case MaterialCategoryType.stand:
        return 'mdi mdi-math-compass';

      case MaterialCategoryType.light:
        return 'mdi mdi-lightbulb-on';

      case MaterialCategoryType.other:

      default:
        return 'mdi mdi-view-dashboard';
    }
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
    node.IconClass = this.getIconClass(item.Id);
    node.RawData = item;
    node.hideArrow = true;

    return node;
  }

  private _fromResourceMaterial(
    item: MaterialModel
  ): CommonNestNode<MaterialModel> {
    const node = new CommonNestNode();
    node.Id = item.Id.toString();
    node.Name = item.Name;
    node.HasChildren = false;
    node.ParentId = item.Category.toString();
    node.ChildrenLoaded = true;
    node.ParentNode = undefined;
    node.IconClass = this.getIconClass(item.Category);
    node.RawData = item;
    node.hideArrow = true;
    return node;
  }
}
