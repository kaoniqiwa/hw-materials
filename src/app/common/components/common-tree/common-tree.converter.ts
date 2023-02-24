import { CommonNestNode } from './common-nest-node.model';
import { CommonTreeModel } from './common-tree.model';

export abstract class CommonTreeConverter {
  abstract Convert(source: CommonTreeModel, ...res: any[]): CommonNestNode;

  // 数据以数组形式
  iterateToNestNode<T extends Array<CommonTreeModel>>(
    data: T
  ): CommonNestNode[] {
    let res: CommonNestNode[] = new Array<CommonNestNode>();
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      const node = this.Convert(item);
      res.push(node);
    }
    return res;
  }

  // 数据以递归形式
  recurseToNestNode<T extends CommonTreeModel>(data: T[], parentId?: string) {
    let res: CommonNestNode[] = [];
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      const node = this.Convert(item);
      node.ParentId = parentId;
      res.push(node);
      if (item['Nodes'] && item['Nodes'].length > 0) {
        let children = this.recurseToNestNode(item['Nodes'], node.Id);
        node.childrenChange.value.push(...children);
        node.HasChildren = true;
        children.forEach((child) => (child.ParentNode = node));
      }
    }
    return res;
  }

  // 数组形式,转成递归树
  buildNestTree<T extends CommonTreeModel>(data: T[]) {
    // 最终根节点树
    let res: CommonNestNode<T>[] = [];

    // 所有树节点
    let m = new Map<string | number, CommonNestNode>();

    // 暂时没有父节点的节点
    let hanged = new Map<string, CommonNestNode>(); // 暂存区

    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let node: CommonNestNode<T> | null = null;

      if (m.has(item.Id)) {
        node = m.get(item.Id)!;
      } else {
        if (item instanceof CommonNestNode) {
          node = item;
        } else {
          node = this.Convert(item);
        }
        m.set(node.Id, node);
      }

      if (node) {
        // 动态用Map,静态用Array
        for (let h of hanged.values()) {
          if (h.ParentId == node.Id) {
            node.ChildrenLoaded = true;
            node.HasChildren = true;
            node.childrenChange.value.push(h);
            h.ParentNode = node;
            hanged.delete(h.Id);
          }
        }

        if (node.ParentId) {
          if (m.has(node.ParentId)) {
            // 当前已经有 parentNode 记录
            let parentNode = m.get(node.ParentId)!;
            parentNode.HasChildren = true;
            parentNode.ChildrenLoaded = true;
            node.ParentNode = parentNode;
            parentNode.childrenChange.value.push(node);
          } else if (hanged.has(node.ParentId)) {
            let parentNode = hanged.get(node.ParentId)!;
            parentNode.HasChildren = true;
            parentNode.ChildrenLoaded = true;
            node.ParentNode = parentNode;
            parentNode.childrenChange.value.push(node);
          } else {
            // parentNode还没有创建
            hanged.set(node.Id, node);
          }
        } else {
          // 跟区划
          res.push(node);
        }
      }
    }
    return res;
  }
  mergeNestedTree(first: CommonNestNode[], second: CommonNestNode[]) {
    for (let i = 0; i < first.length; i++) {
      let first_item = first[i];
      let second_item = second.find((item) => item.Id == first_item.Id);
      if (second_item) {
        this.mergeNestedTree(
          first_item.childrenChange.value,
          second_item.childrenChange.value
        );
      } else {
        second.push(first_item);
      }
    }
    return second;
  }
}
