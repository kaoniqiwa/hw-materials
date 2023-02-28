import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/source.tool';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { PagedTableSelectionAbstractComponent } from '../table-paged-abstract.component';
import { GarbageStationProfileTableBusiness } from './garbage-station-profile-table.business';
import { GarbageStationProfileTableConverter } from './garbage-station-profile-table.converter';
import {
  GarbageStationProfileTableArgs,
  IGarbageStationProfileTableBusiness,
  IGarbageStationProfileTableComponent,
} from './garbage-station-profile-table.model';

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
  extends PagedTableSelectionAbstractComponent<GarbageStationProfileModel>
  implements IGarbageStationProfileTableComponent, OnInit, OnChanges
{
  @Input()
  business: IGarbageStationProfileTableBusiness;

  @Input()
  args: GarbageStationProfileTableArgs = new GarbageStationProfileTableArgs();

  @Input()
  load?: EventEmitter<GarbageStationProfileTableArgs>;

  @Input()
  selected?: GarbageStationProfileModel[];
  @Output()
  selectedChange: EventEmitter<GarbageStationProfileModel[]> =
    new EventEmitter();
  @Output()
  loaded: EventEmitter<GarbageStationProfileModel[]> = new EventEmitter();
  @Output()
  check: EventEmitter<GarbageStationProfileModel> = new EventEmitter();

  constructor(
    business: GarbageStationProfileTableBusiness,
    public source: GarbageStationProfilesSourceTools
  ) {
    super();
    this.business = business;
  }

  widths = [];

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
  ngOnInit(): void {
    this.loadData(1);
  }

  loadData(index: number, size: number = 10) {
    this.selected = undefined;
    this.business.load(this.args, index, size).then((paged) => {
      this.page = paged.Page;
      this.datas = paged.Data;
      this.loaded.emit(this.datas);
    });
  }

  async onupdate(e: Event, item: GarbageStationProfileModel) {
    this.check.emit(item);
    e.stopImmediatePropagation();
  }
}
