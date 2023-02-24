import { CommonTreeModel } from './common-tree.model';

export class CommonFlatNode<T = any> implements CommonTreeModel {
  Id!: string;
  Name!: string;
  Level!: number;
  Expandable!: boolean;
  ParentId?: string;
  ParentNode?: CommonFlatNode;
  IconClass!: string;
  RawData!: T;
  hideArrow?: boolean;
  ButtonIconClasses: string[] = [];
  CurrentButtonIcon?: number;
}
