import { Component, EventEmitter, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MaterialModel } from 'src/app/model/material.model';
import {
  PutInMaterialsParams,
  PutOutMaterialsParams,
} from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';
import { GarbageProfilesMaterialTableArgs } from '../tables/garbage-profiles-material-table/garbage-profiles-material-table.model';
import { GarbageProfilesMaterialManagerSourceBusiness } from './garbage-profiles-material-manager-source.business';
import { GarbageProfilesMaterialManagerBusiness } from './garbage-profiles-material-manager.business';
import {
  GarbageProfilesMaterialManagerSource,
  GarbageProfilesMaterialWindow,
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
    private business: GarbageProfilesMaterialManagerBusiness,
    private toastr: ToastrService
  ) {}
  title = '物料档案';
  args: GarbageProfilesMaterialTableArgs =
    new GarbageProfilesMaterialTableArgs();

  load: EventEmitter<GarbageProfilesMaterialTableArgs> = new EventEmitter();
  excel: EventEmitter<string> = new EventEmitter();

  source: GarbageProfilesMaterialManagerSource =
    new GarbageProfilesMaterialManagerSource();

  window = new GarbageProfilesMaterialWindow();

  selected: MaterialModel = new MaterialModel();

  ngOnInit(): void {
    this.sourceBusiness.load().then((x) => {
      this.source = x;
    });
  }

  onsearch() {
    this.load.emit(this.args);
  }
  onrecord() {
    this.window.record.show = true;
  }

  onwindowcancel() {
    this.window.clear();
    this.window.close();
  }

  toputin() {
    this.window.putin.show = true;
  }
  onputinok(item: PutInMaterialsParams) {
    this.business
      .putin(item)
      .then((x) => {
        this.toastr.success('入库成功');
        this.load.emit(this.args);
      })
      .catch((x) => {
        this.toastr.warning('入库失败');
        console.error(x);
      })
      .finally(() => {
        this.window.putin.show = false;
      });
  }
  toputout() {
    this.window.putout.show = true;
  }
  onputout(params: PutOutMaterialsParams) {
    this.business
      .putout(params)
      .then((x) => {
        this.toastr.success('出库成功');
        this.load.emit(this.args);
      })
      .catch((x) => {
        this.toastr.warning('出库失败');
        console.error(x);
      })
      .finally(() => {
        this.window.putout.show = false;
      });
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
  toexcel() {
    this.excel.emit(this.title);
  }
}
