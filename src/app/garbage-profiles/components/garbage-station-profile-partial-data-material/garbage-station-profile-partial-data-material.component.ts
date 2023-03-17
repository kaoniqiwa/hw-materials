import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { IComponent } from 'src/app/common/interfaces/component.interfact';
import {
  IModel,
  IObjectModel,
} from 'src/app/common/interfaces/model.interface';
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
  business: IBusiness<IModel, MaterialRecordModel[]>;
  @Input()
  load?: EventEmitter<void>;
  @Output()
  putout: EventEmitter<IObjectModel> = new EventEmitter();

  constructor(business: GarbageStationProfilePartialDataMaterialBusiness) {
    this.business = business;
  }

  models: MaterialRecordModel[] = [];
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
        this.models = x;
        if (this.models && this.models.length > 0) {
          this.selected = this.models[0];
        }
      });
    }
  }

  ontabchange(index: number) {
    this.index = index;
    this.selected = this.models[index];
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
