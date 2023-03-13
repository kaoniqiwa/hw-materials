import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Sort } from '@angular/material/sort';
import { CommonFlatNode } from 'src/app/common/components/common-tree/common-flat-node.model';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { IComponent } from 'src/app/common/interfaces/component.interfact';
import { IModel } from 'src/app/common/interfaces/model.interface';
import { MaterialRecordModel } from 'src/app/model/material-record.model';
import { PagedList } from 'src/app/network/entity/page.entity';
import { PagedTableAbstractComponent } from '../table-paged-abstract.component';
import { GarbageProfilesRecordMaterialTableBusiness } from './garbage-profiles-record-material-table.business';
import { GarbageProfilesRecordMaterialTableArgs } from './garbage-profiles-record-material-table.model';

@Component({
  selector: 'garbage-profiles-record-material-table',
  templateUrl: './garbage-profiles-record-material-table.component.html',
  styleUrls: [
    '../table.less',
    './garbage-profiles-record-material-table.component.less',
  ],
  providers: [GarbageProfilesRecordMaterialTableBusiness],
})
export class GarbageProfilesRecordMaterialTableComponent
  extends PagedTableAbstractComponent<MaterialRecordModel>
  implements
    IComponent<IModel, PagedList<MaterialRecordModel>>,
    OnInit,
    OnChanges
{
  @Input()
  business: IBusiness<IModel, PagedList<MaterialRecordModel>>;
  @Input()
  load?: EventEmitter<GarbageProfilesRecordMaterialTableArgs>;
  @Input()
  args: GarbageProfilesRecordMaterialTableArgs =
    new GarbageProfilesRecordMaterialTableArgs();
  @Input()
  selected?: MaterialRecordModel;
  @Output()
  selectedChange: EventEmitter<MaterialRecordModel> = new EventEmitter();
  @Output()
  loaded: EventEmitter<PagedList<MaterialRecordModel>> = new EventEmitter();
  @Output()
  picture: EventEmitter<MaterialRecordModel> = new EventEmitter();
  @Output()
  details: EventEmitter<MaterialRecordModel> = new EventEmitter();

  constructor(business: GarbageProfilesRecordMaterialTableBusiness) {
    super();
    this.business = business;
    this.pageSize = 8;
  }
  widths: string[] = ['', '10%', '30%', '', ''];
  selectedNodes: { [key: string]: CommonFlatNode[] } = {};
  ngOnInit(): void {
    this.loadData(1);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['load']) {
      if (this.load) {
        this.load.subscribe((x) => {
          this.args = x;
          this.loadData(1);
        });
      }
    }
  }

  loadData(index: number, size: number = 8): void {
    this.selectedNodes = {};
    this.loading = true;
    this.business.load(index, size, this.args).then((x) => {
      this.page = x.Page;
      this.datas = x.Data;
      this.datas.forEach((data) => {
        this.selectedNodes[data.Id] = data.MaterialItems.map((item) => {
          let node = new CommonFlatNode();
          node.Id = item.Id.toString();
          node.Name = `${item.Name}:${item.Number}`;
          return node;
        });
      });
      this.loaded.emit(x);
      this.loading = false;
    });
  }

  ondetails(e: Event, item: MaterialRecordModel) {
    e.stopImmediatePropagation();
    this.details.emit(item);
  }
  onpicture(e: Event, item: MaterialRecordModel) {
    e.stopImmediatePropagation();
    this.picture.emit(item);
  }

  sortData(sort: Sort) {
    const isAsc = sort.direction === 'asc';
    this.args.desc = undefined;
    this.args.asc = undefined;
    if (isAsc) {
      this.args.asc = sort.active;
    } else {
      this.args.desc = sort.active;
    }
    this.loadData(1);
  }
}
