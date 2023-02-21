import { Component, EventEmitter, OnInit } from '@angular/core';
import { MaterialModel } from 'src/app/model/material.model';
import { GarbageProfilesMaterialTableArgs } from '../tables/garbage-profiles-material-table/garbage-profiles-material-table.model';
import { GarbageProfilesMaterialManagerSourceBusiness } from './garbage-profiles-material-manager-source.business';
import { GarbageProfilesMaterialManagerSource } from './garbage-profiles-material-manager.model';

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

  ngOnInit(): void {
    this.sourceBusiness.load().then((x) => {
      this.source = x;
      this.source.categorys.unshift({ Id: 0, Name: '全部' });
    });
  }
  onselected(model: MaterialModel) {}

  onsearch() {
    this.load.emit(this.args);
  }
}
