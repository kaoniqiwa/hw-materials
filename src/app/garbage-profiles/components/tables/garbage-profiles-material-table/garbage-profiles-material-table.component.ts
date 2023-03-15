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
import { MaterialModel } from 'src/app/model/material.model';
import { PagedList } from 'src/app/network/entity/page.entity';
import { PagedTableSelectionAbstractComponent } from '../table-paged-abstract.component';
import { GarbageProfilesMaterialTablBusiness as GarbageProfilesMaterialTableBusiness } from './garbage-profiles-material-table.business';
import { GarbageProfilesMaterialTablConverter as GarbageProfilesMaterialTableConverter } from './garbage-profiles-material-table.converter';
import { GarbageProfilesMaterialTableArgs } from './garbage-profiles-material-table.model';

@Component({
  selector: 'garbage-profiles-material-table',
  templateUrl: './garbage-profiles-material-table.component.html',
  styleUrls: [
    '../table.less',
    './garbage-profiles-material-table.component.less',
  ],
  providers: [
    GarbageProfilesMaterialTableConverter,
    GarbageProfilesMaterialTableBusiness,
  ],
})
export class GarbageProfilesMaterialTableComponent
  extends PagedTableSelectionAbstractComponent<MaterialModel>
  implements IComponent<IModel, PagedList<MaterialModel>>, OnInit, OnChanges
{
  @Input()
  business: IBusiness<IModel, PagedList<MaterialModel>>;
  @Input()
  args: GarbageProfilesMaterialTableArgs =
    new GarbageProfilesMaterialTableArgs();
  @Input()
  load?: EventEmitter<GarbageProfilesMaterialTableArgs>;
  @Input()
  selected?: MaterialModel[] | undefined;
  @Output()
  selectedChange: EventEmitter<MaterialModel[]> = new EventEmitter();
  @Output()
  loaded: EventEmitter<PagedList<MaterialModel>> = new EventEmitter();
  @Output()
  putin: EventEmitter<MaterialModel> = new EventEmitter();
  @Output()
  putout: EventEmitter<MaterialModel> = new EventEmitter();
  @Output()
  timeline: EventEmitter<MaterialModel> = new EventEmitter();

  constructor(business: GarbageProfilesMaterialTableBusiness) {
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
    this.business.load(this.args, index, size).then((paged) => {
      this.page = paged.Page;
      this.datas = paged.Data;
      this.loaded.emit(paged);
    });
  }
  onputin(e: Event, item: MaterialModel) {
    e.stopImmediatePropagation();
    this.putin.emit(item);
  }
  onputout(e: Event, item: MaterialModel) {
    e.stopImmediatePropagation();
    this.putout.emit(item);
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

  ontimeline(e: Event, item: MaterialModel) {
    e.stopImmediatePropagation();
    this.timeline.emit(item);
  }
}
