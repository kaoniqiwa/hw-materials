import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  Type,
  ViewChild,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { CommonFlatNode } from '../common-tree/common-flat-node.model';
import { CommonTree } from '../common-tree/common-tree';

/**
 *  显示树的选中节点信息
 */
@Component({
  selector: 'common-label-select',
  templateUrl: './common-label-select.component.html',
  styleUrls: ['./common-label-select.component.less'],
})
export class CommonLabelSelecComponent
  implements OnInit, AfterViewInit, AfterContentInit, OnDestroy
{
  @Input()
  showDropDown = false;

  @Input()
  selectedNodes: CommonFlatNode[] = [];

  @Input()
  autoclose = false;

  @Input()
  showCloseIcon = true;

  @Output() toggleDropDown = new EventEmitter<boolean>();
  @Output() removeDropItem = new EventEmitter();

  @ContentChild('tree') tree?: CommonTree;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  handle: any;

  subscription!: Subscription;

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.subscription = fromEvent(this.document.body, 'click').subscribe(() => {
      if (this.autoclose) this.showDropDown = false;
    });
  }
  ngAfterContentInit(): void {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleHandler(e: Event) {
    e.stopPropagation();
    this.showDropDown = !this.showDropDown;
    this.toggleDropDown.emit(this.showDropDown);
  }
  removeNode(e: Event, node: CommonFlatNode) {
    e.stopPropagation();

    this.tree?.toggleNodes([node.Id]);

    this.removeDropItem.emit(node);
  }
  closeDropDown() {
    this.showDropDown = false;
  }
}