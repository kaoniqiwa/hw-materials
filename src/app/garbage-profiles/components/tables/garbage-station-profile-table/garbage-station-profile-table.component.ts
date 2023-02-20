import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { IComponent } from 'src/app/common/interfaces/component.interfact';
import { IModel } from 'src/app/common/interfaces/model.interface';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { Page, PagedList } from 'src/app/network/entity/page.entity';
import { GarbageStationProfileTableBusiness } from './garbage-station-profile-table.business';
import { GarbageStationProfileTableConverter } from './garbage-station-profile-table.converter';
import { GarbageStationProfileTableArgs } from './garbage-station-profile-table.model';

@Component({
  selector: 'garbage-station-profile-table',
  templateUrl: './garbage-station-profile-table.component.html',
  styleUrls: [
    '../table.less',
    './garbage-station-profile-table.component.less',
  ],
  providers: [
    GarbageStationProfileTableConverter,
    GarbageStationProfileTableBusiness,
  ],
})
export class GarbageStationProfileTableComponent
  implements
    IComponent<IModel, PagedList<GarbageStationProfileModel>>,
    OnInit,
    OnChanges
{
  @Input()
  business: IBusiness<IModel, PagedList<GarbageStationProfileModel>>;

  @Input()
  args: GarbageStationProfileTableArgs = new GarbageStationProfileTableArgs();

  @Input()
  load?: EventEmitter<GarbageStationProfileTableArgs>;

  constructor(business: GarbageStationProfileTableBusiness) {
    this.business = business;
  }

  widths = [];
  datas: GarbageStationProfileModel[] = [];
  page: Page = new Page();

  ngOnChanges(changes: SimpleChanges): void {
    // this.loadData();
  }
  ngOnInit(): void {
    this.loadData(1);
  }

  loadData(index: number, size: number = 10) {
    this.business.load(this.args, index, size).then((paged) => {
      this.page = paged.Page;
      this.datas = paged.Data;
    });
  }

  onitemclicked(item: GarbageStationProfileModel) {}
}
