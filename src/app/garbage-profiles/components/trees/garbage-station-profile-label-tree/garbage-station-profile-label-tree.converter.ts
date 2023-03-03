import { Injectable } from '@angular/core';
import { CommonNestNode } from 'src/app/common/components/common-tree/common-nest-node.model';
import { CommonTreeConverter } from 'src/app/common/components/common-tree/common-tree.converter';
import { CommonTreeModel } from 'src/app/common/components/common-tree/common-tree.model';
import { LabelModel } from 'src/app/model/label.model';

@Injectable({
  providedIn: 'root',
})
export class GarbageStationProfileLabelTreeConverter extends CommonTreeConverter {
  Convert(source: CommonTreeModel, ...res: any[]): CommonNestNode {
    if (source instanceof LabelModel) {
      return this.fromLabel(source);
    }
    throw new Error('Method not implemented.');
  }

  private fromLabel(item: LabelModel): CommonNestNode<LabelModel> {
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
