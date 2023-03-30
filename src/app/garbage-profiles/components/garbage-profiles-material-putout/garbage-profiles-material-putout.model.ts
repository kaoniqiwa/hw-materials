import { EventEmitter } from '@angular/core';
import { CommonFlatNode } from 'src/app/common/components/common-tree/common-flat-node.model';

export class MaterialQuantitys {
  [key: string]: number;
}
export class TreeModel {
  select: EventEmitter<string[]> = new EventEmitter();
  show = false;
  nodes: CommonFlatNode[] = [];
  id?: string;
  ids: string[] = [];
  onselected(nodes: CommonFlatNode[]) {
    this.nodes = nodes;
    let ids = nodes.map((x) => x.Id);
    if (ids.length > 0) {
      this.id = ids[0];
    }
    this.show = false;
    this.select.emit(ids);
  }
  ontoggle(expend: boolean) {
    if (expend === false) {
      this.ids = this.nodes.map((x) => x.Id);
    }
  }
}
