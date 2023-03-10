import { Injectable } from '@angular/core';
import { CommonNestNode } from 'src/app/common/components/common-tree/common-nest-node.model';
import { CommonTreeConverter } from 'src/app/common/components/common-tree/common-tree.converter';
import { CommonTreeModel } from 'src/app/common/components/common-tree/common-tree.model';
import { LabelModel } from 'src/app/model/label.model';
import { ValueNamePairModel } from 'src/app/model/value-name-pair.model';

@Injectable()
export class GarbageStationProfileFunctionsTreeConverter extends CommonTreeConverter {
  Convert(source: CommonTreeModel, ...res: any[]): CommonNestNode {
    if (source instanceof ValueNamePairModel) {
      return this.fromLabel(source);
    }
    throw new Error('Method not implemented.');
  }

  private fromLabel(item: ValueNamePairModel): CommonNestNode<LabelModel> {
    const node = new CommonNestNode();
    node.Id = item.Id;
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
