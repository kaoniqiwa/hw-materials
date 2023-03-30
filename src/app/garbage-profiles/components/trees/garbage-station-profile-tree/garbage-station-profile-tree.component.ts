import { SelectionChange } from '@angular/cdk/collections';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonFlatNode } from 'src/app/common/components/common-tree/common-flat-node.model';
import { CommonTree } from 'src/app/common/components/common-tree/common-tree';
import { CommonTreeComponent } from 'src/app/common/components/common-tree/common-tree.component';
import { SelectStrategy } from 'src/app/enum/select-strategy.enum';
import { MaterialListBusiness as GarbageStationProfileTreeBusiness } from './garbage-station-profile-tree.business';
import { GarbageStationProfileTreeConverter } from './garbage-station-profile-tree.converter';
import { GarbageStationProfileTreeModel } from './garbage-station-profile-tree.model';

@Component({
  selector: 'howell-garbage-station-profile-tree',
  templateUrl: './garbage-station-profile-tree.component.html',
  styleUrls: ['./garbage-station-profile-tree.component.less'],
  providers: [
    GarbageStationProfileTreeConverter,
    GarbageStationProfileTreeBusiness,
  ],
})
export class GarbageStationProfileTreeComponent
  extends CommonTree
  implements OnInit
{
  private _condition: string = '';

  @Input()
  selectStrategy = SelectStrategy.Single;

  // 默认选中列表
  @Input()
  defaultIds: string[] = [];

  @Input() showSearchBar = true;

  @Output() selectTreeNode: EventEmitter<CommonFlatNode[]> = new EventEmitter<
    CommonFlatNode[]
  >();

  @ViewChild(CommonTreeComponent) override tree?: CommonTreeComponent;

  constructor(
    private _business: GarbageStationProfileTreeBusiness,
    private _toastrService: ToastrService
  ) {
    super();
  }

  loaded: EventEmitter<void> = new EventEmitter();

  ngOnInit(): void {
    this._init();
  }
  private async _init() {
    this._nestedNodeMap = this._business.nestedNodeMap;

    let res = await this._business.init(this._condition);
    this.dataSubject.next(res);
    this.loaded.emit();
  }

  override selectTreeNodeHandler(change: SelectionChange<CommonFlatNode>) {
    let nodes = change.source.selected.filter(
      (x) => x.RawData instanceof GarbageStationProfileTreeModel
    );

    this.selectTreeNode.emit(nodes);
  }

  async searchEventHandler(condition: string) {
    if (this._condition == condition && this._condition != '') {
      this._toastrService.warning('重复搜索相同字段');
      return;
    }

    this._condition = condition;

    let res = await this._business.searchNode(condition);
    if (res && res.length) {
      this._toastrService.success('操作成功');

      this.dataSubject.next(res);
      if (condition != '') {
        this.tree?.expandAll();
      } else {
        this.tree?.reset();
        this.tree?.collapseAll();
      }
    } else {
      this._toastrService.warning('无匹配结果');
    }
  }
}
