import { Component, EventEmitter, OnInit } from '@angular/core';
import { MaterialModel } from 'src/app/model/material.model';
import { PutInMaterialsParams } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';
import { GarbageProfilesMaterialTableArgs } from '../tables/garbage-profiles-material-table/garbage-profiles-material-table.model';
import { GarbageProfilesMaterialManagerSourceBusiness } from './garbage-profiles-material-manager-source.business';
import { GarbageProfilesMaterialManagerBusiness } from './garbage-profiles-material-manager.business';
import {
  GarbageProfilesMaterialDetailsWindow,
  GarbageProfilesMaterialManagerSource,
  GarbageProfilesMaterialPictureWindow,
  GarbageProfilesMaterialPutInWindow,
  GarbageProfilesMaterialRecordWindow,
  GarbageProfilesMaterialTimelineWindow,
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
    putout: new GarbageProfilesMaterialRecordWindow(),
    picture: new GarbageProfilesMaterialPictureWindow(),
    timeline: new GarbageProfilesMaterialTimelineWindow(),
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
  onrecord() {
    this.window.record.show = true;
  }

  onwindowcancel() {
    this.window.putin.show = false;
    this.window.details.show = false;
    this.window.record.show = false;
    this.window.timeline.model = undefined;
    this.window.timeline.show = false;
  }

  onputin() {
    this.window.putin.show = true;
  }
  onputinok(item: PutInMaterialsParams) {
    this.business.putin(item);
    this.window.putin.show = false;
  }
  onputout() {
    this.window.putout.show = true;
  }

  onpicture(urls?: string[]) {
    if (urls && urls.length > 0) {
      this.window.picture.urlId = urls[0];
      this.window.picture.show = true;
    }
  }
  ontimeline(item: MaterialModel) {
    this.window.timeline.model = item;
    this.window.timeline.show = true;
  }
}
