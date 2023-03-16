import { Component, Input, OnInit } from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { IComponent } from 'src/app/common/interfaces/component.interfact';
import { IModel } from 'src/app/common/interfaces/model.interface';
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

  constructor(business: GarbageStationProfilePartialDataMaterialBusiness) {
    this.business = business;
  }

  models: MaterialRecordModel[] = [];

  ngOnInit(): void {
    if (this.profileId) {
      this.business.load(this.profileId).then((x) => {
        this.models = x;
      });
    }
  }
}
