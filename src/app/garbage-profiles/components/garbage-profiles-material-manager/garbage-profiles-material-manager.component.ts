import { Component, EventEmitter, OnInit } from '@angular/core';
import { MaterialRecordType } from 'src/app/enum/material-record-type.enum';
import { MaterialModel } from 'src/app/model/material.model';
import { PutInMaterialsParams } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';
import { GarbageProfilesMaterialTableArgs } from '../tables/garbage-profiles-material-table/garbage-profiles-material-table.model';
import { GarbageProfilesMaterialManagerSourceBusiness } from './garbage-profiles-material-manager-source.business';
import { GarbageProfilesMaterialManagerBusiness } from './garbage-profiles-material-manager.business';
import {
  GarbageProfilesMaterialDetailsWindow,
  GarbageProfilesMaterialManagerSource,
  GarbageProfilesMaterialPutInWindow,
  GarbageProfilesMaterialRecordWindow,
} from './garbage-profiles-material-manager.model';

@Component({
  selector: 'garbage-profiles-material-manager',
  templateUrl: './garbage-profiles-material-manager.component.html',
  styleUrls: ['./garbage-profiles-material-manager.component.less'],
  providers: [
    GarbageProfilesMaterialManagerSourceBusiness,
    GarbageProfilesMaterialManagerBusiness,
  ],
})
export class GarbageProfilesMaterialManagerComponent implements OnInit {
  constructor(
    public sourceBusiness: GarbageProfilesMaterialManagerSourceBusiness,
    private business: GarbageProfilesMaterialManagerBusiness
  ) {}

  args: GarbageProfilesMaterialTableArgs =
    new GarbageProfilesMaterialTableArgs();

  load: EventEmitter<GarbageProfilesMaterialTableArgs> = new EventEmitter();

  source: GarbageProfilesMaterialManagerSource =
    new GarbageProfilesMaterialManagerSource();

  window = {
    details: new GarbageProfilesMaterialDetailsWindow(),
    record: new GarbageProfilesMaterialRecordWindow(),
    putin: new GarbageProfilesMaterialPutInWindow(),
  };

  selected: MaterialModel = new MaterialModel();

  ngOnInit(): void {
    this.sourceBusiness.load().then((x) => {
      this.source = x;
      this.source.categorys.unshift({ Id: 0, Name: '全部' });
    });
  }

  onsearch() {
    this.load.emit(this.args);
  }
  onrecordin() {
    this.window.record.type = MaterialRecordType.in;
    this.window.record.show = true;
  }
  onrecordout() {
    this.window.record.type = MaterialRecordType.out;
    this.window.record.show = true;
  }

  onputout(model: MaterialModel) {
    this.selected = model;
    this.window.details.show = true;
  }
  onwindowcancel() {
    this.window.putin.show = false;
    this.window.details.show = false;
    this.window.record.show = false;
  }

  onputin(model: MaterialModel) {
    this.selected = model;
    this.window.putin.show = true;
  }
  onputinok(item: PutInMaterialsParams) {
    this.business.putin(item);
    this.window.putin.show = false;
  }
}
