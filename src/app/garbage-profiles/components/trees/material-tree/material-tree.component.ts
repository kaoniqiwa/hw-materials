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
import { MaterialListBusiness as MaterialTreeBusiness } from './material-tree.business';
import { MaterialTreeConverter } from './material-tree.converter';

@Component({
  selector: 'howell-material-tree',
  templateUrl: './material-tree.component.html',
  styleUrls: ['./material-tree.component.less'],
  providers: [MaterialTreeConverter, MaterialTreeBusiness],
})
export class MaterialTreeComponent extends CommonTree implements OnInit {
  private _condition: string = '';

  @Input()
  selectStrategy = SelectStrategy.Multiple;

  // 默认选中列表
  @Input()
  defaultIds: string[] = [];

  @Input() showSearchBar = true;

  @Output() selectTreeNode: EventEmitter<CommonFlatNode[]> = new EventEmitter<
    CommonFlatNode[]
  >();

  @ViewChild(CommonTreeComponent) override tree?: CommonTreeComponent;

  constructor(
    private _business: MaterialTreeBusiness,
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
