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
import { GarbageStationProfileFunctionsTreeBusiness } from './garbage-station-profile-functions-tree.business';
import { GarbageStationProfileFunctionsTreeConverter } from './garbage-station-profile-functions-tree.converter';

@Component({
  selector: 'garbage-station-profile-functions-tree',
  templateUrl: './garbage-station-profile-functions-tree.component.html',
  styleUrls: ['./garbage-station-profile-functions-tree.component.less'],
  providers: [
    GarbageStationProfileFunctionsTreeConverter,
    GarbageStationProfileFunctionsTreeBusiness,
  ],
})
export class GarbageStationProfileFunctionsTreeComponent
  extends CommonTree
  implements OnInit
{
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

  @Input() showSearchBar = true;

  @Output() selectTreeNode: EventEmitter<CommonFlatNode[]> = new EventEmitter<
    CommonFlatNode[]
  >();

  @ViewChild(CommonTreeComponent) override tree?: CommonTreeComponent;

  @Output()
  loaded: EventEmitter<void> = new EventEmitter();

  constructor(
    private _business: GarbageStationProfileFunctionsTreeBusiness,
    private _toastrService: ToastrService
  ) {
    super();
  }

  isloaded = false;

  ids: string[] = [];

  ngOnInit(): void {
    this._init();
  }
  private async _init() {
    this._nestedNodeMap = this._business.nestedNodeMap;

    let res = await this._business.init();
    // console.log(res);
    this.dataSubject.next(res);

    if (this.isloaded === false) {
      this.isloaded = true;
      if (this.tree) {
        this.tree.setDefaultNodes();
      }
    }

    this.loaded.emit();
  }
}
