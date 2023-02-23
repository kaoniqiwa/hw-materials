import { Component, EventEmitter, OnInit } from '@angular/core';
import { MaterialRecordType } from 'src/app/enum/material-record-type.enum';
import { MaterialModel } from 'src/app/model/material.model';
import { GarbageProfilesMaterialTableArgs } from '../tables/garbage-profiles-material-table/garbage-profiles-material-table.model';
import { GarbageProfilesMaterialManagerSourceBusiness } from './garbage-profiles-material-manager-source.business';
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
  providers: [GarbageProfilesMaterialManagerSourceBusiness],
})
export class GarbageProfilesMaterialManagerComponent implements OnInit {
  constructor(
    public sourceBusiness: GarbageProfilesMaterialManagerSourceBusiness
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

  onputin(model: MaterialModel) {
    this.selected = model;
    this.window.putin.show = true;
  }
  onputout(model: MaterialModel) {
    this.selected = model;
    this.window.details.show = true;
  }
}
