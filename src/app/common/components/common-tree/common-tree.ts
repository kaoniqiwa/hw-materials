import { SelectionChange } from '@angular/cdk/collections';
import { Component, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommonFlatNode } from './common-flat-node.model';
import { CommonNestNode } from './common-nest-node.model';
import { CommonTreeComponent } from './common-tree.component';

export abstract class CommonTree {
  protected _nestedNodeMap = new Map<string, CommonNestNode>();
  public dataSubject = new BehaviorSubject<CommonNestNode[]>([]);
  public tree?: CommonTreeComponent;

  abstract selectTreeNode: EventEmitter<CommonFlatNode[]>;

  selectTreeNodeHandler(change: SelectionChange<CommonFlatNode>) {
    let nodes = change.source.selected;
    this.selectTreeNode.emit(nodes);
  }

  addNode(node: CommonNestNode) {
    if (node.ParentId) {
      let parentNode = this._nestedNodeMap.get(node.ParentId);
      if (parentNode) {
        parentNode.HasChildren = true;
        parentNode.childrenChange.value.push(node);
      }
    } else {
      this.dataSubject.value.push(node);
    }
    this._nestedNodeMap.set(node.Id, node);
    this.dataSubject.next(this.dataSubject.value);
  }

  /**原节点有各种状态,使用原节点 */
  editNode(node: CommonNestNode) {
    let currentNode = this._nestedNodeMap.get(node.Id);
    if (currentNode) {
      currentNode.Name = node.Name;
      currentNode.RawData = node.RawData;
    }
    this.dataSubject.next(this.dataSubject.value);
  }

  deleteNode(flat: CommonFlatNode) {
    const node = flat;
    // 当前要删除的节点
    let currentNode = this._nestedNodeMap.get(node.Id);
    if (currentNode) {
      // 该节点有没有父节点
      if (currentNode.ParentId) {
        let parentNode = this._nestedNodeMap.get(currentNode.ParentId)!;
        let index = parentNode.childrenChange.value.indexOf(currentNode);
        if (index != -1) {
          parentNode.childrenChange.value.splice(index, 1);
          parentNode.HasChildren = parentNode.childrenChange.value.length > 0;
        }
      } else {
        let index = this.dataSubject.value.indexOf(currentNode);
        if (index != -1) {
          this.dataSubject.value.splice(index, 1);
        }
      }
      this._nestedNodeMap.delete(currentNode.Id);
    }
    this.dataSubject.next(this.dataSubject.value);
    this.tree?.deleteNode(flat);
  }

  toggleNodes(ids: string[], clear?: boolean) {
    this.tree?.toggleSelect(ids, clear);
  }
}
