import { Component, Input, OnInit } from '@angular/core';
import { DateTimePickerView } from 'src/app/common/directives/date-time-picker/date-time-picker.directive';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { IComponent } from 'src/app/common/interfaces/component.interfact';
import { IModel } from 'src/app/common/interfaces/model.interface';
import { DateTimeTool } from 'src/app/common/tools/datetime.tool';
import { MaterialRecordType } from 'src/app/enum/material-record-type.enum';

import { MaterialModel } from 'src/app/model/material.model';
import { GarbageProfilesMaterialRecordTimelineBusiness } from './garbage-profiles-material-record-timeline.business';
import {
  GarbageProfilesMaterialRecordTimelineArgs,
  SingleMaterialRecordModel,
} from './garbage-profiles-material-record-timeline.model';

@Component({
  selector: 'garbage-profiles-material-record-timeline',
  templateUrl: './garbage-profiles-material-record-timeline.component.html',
  styleUrls: ['./garbage-profiles-material-record-timeline.component.less'],
  providers: [GarbageProfilesMaterialRecordTimelineBusiness],
})
export class GarbageProfilesMaterialRecordTimelineComponent
  implements IComponent<IModel, SingleMaterialRecordModel[]>, OnInit
{
  @Input()
  business: IBusiness<IModel, SingleMaterialRecordModel[]>;
  @Input()
  material?: MaterialModel;
  constructor(business: GarbageProfilesMaterialRecordTimelineBusiness) {
    this.business = business;
    this.args = {
      duration: DateTimeTool.allMonth(new Date()),
      asc: false,
    };
  }
  args: GarbageProfilesMaterialRecordTimelineArgs;
  models: SingleMaterialRecordModel[] = [];
  MaterialRecordType = MaterialRecordType;
  DateTimePickerView = DateTimePickerView;
  asc: boolean = false;

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    if (this.material) {
      this.business.load(this.material.Id, this.args).then((x) => {
        this.models = x;
        this.asc = this.args.asc;
      });
    }
  }

  onsearch() {
    this.loadData();
  }
}
