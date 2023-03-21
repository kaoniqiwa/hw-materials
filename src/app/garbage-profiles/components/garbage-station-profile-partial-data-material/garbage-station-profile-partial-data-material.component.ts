import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { IComponent } from 'src/app/common/interfaces/component.interfact';
import {
  IModel,
  IObjectModel,
} from 'src/app/common/interfaces/model.interface';
import { MaterialItemModel } from 'src/app/model/material-item.model';
import { MaterialRecordModel } from 'src/app/model/material-record.model';
import { GarbageStationProfilePartialDataMaterialBusiness } from './garbage-station-profile-partial-data-material.business';

@Component({
  selector: 'garbage-station-profile-partial-data-material',
  templateUrl: './garbage-station-profile-partial-data-material.component.html',
  styleUrls: ['./garbage-station-profile-partial-data-material.component.less'],
  providers: [GarbageStationProfilePartialDataMaterialBusiness],
})
export class GarbageStationProfilePartialDataMaterialComponent
  implements IComponent<IModel, MaterialRecordModel[]>, OnInit
{
  @Input()
  profileId?: string;
  @Input()
  models?: MaterialItemModel[];
  @Input()
  business: IBusiness<IModel, MaterialRecordModel[]>;
  @Input()
  load?: EventEmitter<void>;
  @Output()
  putout: EventEmitter<IObjectModel> = new EventEmitter();

  constructor(business: GarbageStationProfilePartialDataMaterialBusiness) {
    this.business = business;
  }

  records: MaterialRecordModel[] = [];
  index: number = 0;
  selected?: MaterialRecordModel;

  ngOnInit(): void {
    this.loadData();
    if (this.load) {
      this.load.subscribe((x) => {
        this.loadData();
      });
    }
  }

  loadData() {
    if (this.profileId) {
      this.business.load(this.profileId).then((x) => {
        this.records = x;
        if (this.records && this.records.length > 0) {
          this.selected = this.records[0];
        }
      });
    }
  }

  ontabchange(index: number) {
    this.index = index;
    this.selected = this.records[index];
  }

  onputout() {
    if (this.selected) {
      this.putout.emit({
        Id: this.selected.ProfileId!,
        Name: this.selected.ProfileName!,
      });
    }
  }
}
