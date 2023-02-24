import { BehaviorSubject } from 'rxjs';
import { CommonTreeModel } from './common-tree.model';

export class CommonNestNode<T = any> implements CommonTreeModel {
  readonly childrenChange = new BehaviorSubject<CommonNestNode[]>([]);

  Id!: string;
  Name!: string;
  HasChildren!: boolean;
  ParentId?: string;
  ChildrenLoaded!: boolean;
  ParentNode?: CommonNestNode;
  IconClass!: string;
  RawData!: T;
  hideArrow?: boolean;
  ButtonIconClasses: string[] = [];
}
