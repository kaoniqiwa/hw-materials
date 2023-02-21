import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { IComponent } from 'src/app/common/interfaces/component.interfact';
import { IModel } from 'src/app/common/interfaces/model.interface';
import { MaterialModel } from 'src/app/model/material.model';
import { PagedList } from 'src/app/network/entity/page.entity';
import { PagedTableAbstractComponent } from '../table-paged-abstract.component';
import { GarbageProfilesMaterialTablBusiness } from './garbage-profiles-material-table.business';
import { GarbageProfilesMaterialTablConverter } from './garbage-profiles-material-table.converter';
import { GarbageProfilesMaterialTablArgs } from './garbage-profiles-material-table.model';

@Component({
  selector: 'garbage-profiles-material-table',
  templateUrl: './garbage-profiles-material-table.component.html',
  styleUrls: [
    '../table.less',
    './garbage-profiles-material-table.component.less',
  ],
  providers: [
    GarbageProfilesMaterialTablConverter,
    GarbageProfilesMaterialTablBusiness,
  ],
})
export class GarbageProfilesMaterialTableComponent
  extends PagedTableAbstractComponent<MaterialModel>
  implements IComponent<IModel, PagedList<MaterialModel>>, OnInit, OnChanges
{
  @Input()
  business: IBusiness<IModel, PagedList<MaterialModel>>;
  @Input()
  args: GarbageProfilesMaterialTablArgs = new GarbageProfilesMaterialTablArgs();
  @Input()
  load?: EventEmitter<GarbageProfilesMaterialTablArgs>;
  @Input()
  selected?: MaterialModel[] | undefined;
  @Output()
  selectedChange: EventEmitter<MaterialModel[]> = new EventEmitter();
  @Output()
  check: EventEmitter<MaterialModel> = new EventEmitter();
  constructor(business: GarbageProfilesMaterialTablBusiness) {
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
    this.business.load(this.args, index, size);
  }
  oncheck(e: Event, item: MaterialModel) {
    e.stopImmediatePropagation();
    this.check.emit(item);
  }
}
