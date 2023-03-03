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
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { IComponent } from 'src/app/common/interfaces/component.interfact';
import { IModel } from 'src/app/common/interfaces/model.interface';
import { ModificationRecordModel } from 'src/app/model/modification-record.model';
import { PagedList } from 'src/app/network/entity/page.entity';
import { PagedTableAbstractComponent } from '../table-paged-abstract.component';
import { GarbageProfilesRecordModificationTableBusiness } from './garbage-profiles-record-modification-table.business';
import { GarbageProfilesRecordModificationTableArgs } from './garbage-profiles-record-modification-table.model';

@Component({
  selector: 'garbage-profiles-record-modification-table',
  templateUrl: './garbage-profiles-record-modification-table.component.html',
  styleUrls: [
    '../table.less',
    './garbage-profiles-record-modification-table.component.less',
  ],
  providers: [GarbageProfilesRecordModificationTableBusiness],
})
export class GarbageProfilesRecordModificationTableComponent
  extends PagedTableAbstractComponent<ModificationRecordModel>
  implements
    IComponent<IModel, PagedList<ModificationRecordModel>>,
    OnInit,
    OnChanges
{
  @Input()
  business: IBusiness<IModel, PagedList<ModificationRecordModel>>;
  @Input()
  load?: EventEmitter<GarbageProfilesRecordModificationTableArgs>;
  @Input()
  args: GarbageProfilesRecordModificationTableArgs =
    new GarbageProfilesRecordModificationTableArgs();
  @Input()
  selected?: ModificationRecordModel;
  @Output()
  selectedChange: EventEmitter<ModificationRecordModel> = new EventEmitter();
  @Output()
  loaded: EventEmitter<PagedList<ModificationRecordModel>> = new EventEmitter();
  @Output()
  picture: EventEmitter<ModificationRecordModel> = new EventEmitter();
  @Output()
  details: EventEmitter<ModificationRecordModel> = new EventEmitter();

  constructor(business: GarbageProfilesRecordModificationTableBusiness) {
    super();
    this.business = business;
  }
  widths: string[] = [];
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

  loadData(index: number, size: number = 10): void {
    this.business.load(index, size, this.args).then((x) => {
      this.page = x.Page;
      this.datas = x.Data;
      this.loaded.emit(x);
    });
  }

  ondetails(e: Event, item: ModificationRecordModel) {
    e.stopImmediatePropagation();
    this.details.emit(item);
  }
  onpicture(e: Event, item: ModificationRecordModel) {
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
