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
import { GarbageStationProfileLabelTreeBusiness } from './garbage-station-profile-label-tree.business';
import { GarbageStationProfileLabelTreeConverter } from './garbage-station-profile-label-tree.converter';

@Component({
  selector: 'garbage-station-profile-label-tree',
  templateUrl: './garbage-station-profile-label-tree.component.html',
  styleUrls: ['./garbage-station-profile-label-tree.component.less'],
  providers: [
    GarbageStationProfileLabelTreeConverter,
    GarbageStationProfileLabelTreeBusiness,
  ],
})
export class GarbageStationProfileLabelTreeComponent
  extends CommonTree
  implements OnInit
{
  private _condition: string = '';

  @Input()
  selectStrategy = SelectStrategy.Multiple;

  // 默认选中列表

  private _defaultIds: number[] = [];
  public get defaultIds(): number[] {
    return this._defaultIds;
  }
  @Input()
  public set defaultIds(v: number[]) {
    this._defaultIds = v;
    this.ids = this._defaultIds.map((x) => x.toString());
  }

  @Input()
  ids: string[] = [];

  @Input() showSearchBar = true;

  @Output() selectTreeNode: EventEmitter<CommonFlatNode[]> = new EventEmitter<
    CommonFlatNode[]
  >();

  @ViewChild(CommonTreeComponent) override tree?: CommonTreeComponent;

  @Output()
  loaded: EventEmitter<void> = new EventEmitter();

  constructor(
    private _business: GarbageStationProfileLabelTreeBusiness,
    private _toastrService: ToastrService
  ) {
    super();
  }

  isloaded = false;

  ngOnInit(): void {
    this._init();
  }
  private async _init() {
    this._nestedNodeMap = this._business.nestedNodeMap;

    let res = await this._business.init(this._condition);
    this.dataSubject.next(res);

    if (this.isloaded === false) {
      this.isloaded = true;
      if (this.tree) {
        this.tree.setDefaultNodes();
      }
    }

    this.loaded.emit();
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
