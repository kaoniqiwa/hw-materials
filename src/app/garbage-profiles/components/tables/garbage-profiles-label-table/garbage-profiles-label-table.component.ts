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
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { IComponent } from 'src/app/common/interfaces/component.interfact';
import { IModel } from 'src/app/common/interfaces/model.interface';
import { LabelModel } from 'src/app/model/label.model';

import { PagedList } from 'src/app/network/entity/page.entity';
import { PagedTableSelectionAbstractComponent } from '../table-paged-abstract.component';
import { GarbageProfilesLabelTableBusiness } from './garbage-profiles-label-table.business';
import { GarbageProfilesLabelTableArgs } from './garbage-profiles-label-table.model';

@Component({
  selector: 'garbage-profiles-label-table',
  templateUrl: './garbage-profiles-label-table.component.html',
  styleUrls: ['../table.less', './garbage-profiles-label-table.component.less'],
  providers: [GarbageProfilesLabelTableBusiness],
})
export class GarbageProfilesLabelTableComponent
  extends PagedTableSelectionAbstractComponent<LabelModel>
  implements IComponent<IModel, PagedList<LabelModel>>, OnInit, OnChanges
{
  @Input()
  business: IBusiness<IModel, PagedList<LabelModel>>;
  @Input()
  args: GarbageProfilesLabelTableArgs = new GarbageProfilesLabelTableArgs();
  @Input()
  load?: EventEmitter<GarbageProfilesLabelTableArgs>;
  @Input()
  selected?: LabelModel[];
  @Output()
  selectedChange: EventEmitter<LabelModel[]> = new EventEmitter();
  @Output()
  loaded: EventEmitter<PagedList<LabelModel>> = new EventEmitter();
  @Output()
  modify: EventEmitter<LabelModel> = new EventEmitter();
  constructor(business: GarbageProfilesLabelTableBusiness) {
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
        this.load.subscribe((args) => {
          this.args = args;
          this.loadData(1, this.pageSize);
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

  onupdate(e: Event, item: LabelModel) {
    e.stopImmediatePropagation();
    let plain = instanceToPlain(item);
    let instance = plainToInstance(LabelModel, plain);
    this.modify.emit(instance);
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
