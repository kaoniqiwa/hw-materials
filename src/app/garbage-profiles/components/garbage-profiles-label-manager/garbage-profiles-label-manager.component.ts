import { Component, EventEmitter } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ToastrService } from 'ngx-toastr';
import { LabelModel } from 'src/app/model/label.model';
import { PagedList } from 'src/app/network/entity/page.entity';

import { GarbageProfilesLabelTableArgs } from '../tables/garbage-profiles-label-table/garbage-profiles-label-table.model';
import { GarbageProfilesLabelManagerBusiness } from './garbage-profiles-label-manager.business';
import { GarbageProfilesLabelDetailsWindow } from './garbage-profiles-label-manager.model';

@Component({
  selector: 'garbage-profiles-label-manager',
  templateUrl: './garbage-profiles-label-manager.component.html',
  styleUrls: ['./garbage-profiles-label-manager.component.less'],
  providers: [GarbageProfilesLabelManagerBusiness],
})
export class GarbageProfilesLabelManagerComponent {
  constructor(
    private business: GarbageProfilesLabelManagerBusiness,
    private toastr: ToastrService
  ) {}
  load: EventEmitter<GarbageProfilesLabelTableArgs> = new EventEmitter();

  args: GarbageProfilesLabelTableArgs = new GarbageProfilesLabelTableArgs();

  window = {
    creater: new GarbageProfilesLabelDetailsWindow(),
    updater: new GarbageProfilesLabelDetailsWindow(),
  };

  selecteds: LabelModel[] = [];

  selected?: LabelModel;
  count = 0;

  onsearch() {
    this.load.emit(this.args);
  }

  onwindowclose() {
    this.window.creater.show = false;
  }

  oncreate() {
    this.selected = new LabelModel();
    this.selected.Id = this.count;
    this.selected.State = 0;
    this.window.creater.show = true;
  }
  onupdate(model: LabelModel) {
    let plain = instanceToPlain(model);
    this.selected = plainToInstance(LabelModel, plain);
    this.window.creater.show = true;
  }
  loaded(paged: PagedList<LabelModel>) {
    this.count = paged.Page.TotalRecordCount;
  }
  oncreateok(model: LabelModel) {
    this.business.create(model).then((x) => {
      this.load.emit(this.args);
      this.toastr.success(`成功创建1条标签`);
    });
    this.window.creater.show = false;
  }

  ondelete() {
    this.business.delete(this.selecteds).then((x) => {
      this.load.emit(this.args);
      this.toastr.success(`成功删除${x.length}条标签`);
    });
  }
}
