import { Component, EventEmitter } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ToastrService } from 'ngx-toastr';
import { FormState } from 'src/app/enum/form-state.enum';
import { LabelModel } from 'src/app/model/label.model';
import { PagedList } from 'src/app/network/entity/page.entity';

import { GarbageProfilesLabelTableArgs } from '../tables/garbage-profiles-label-table/garbage-profiles-label-table.model';
import { GarbageProfilesLabelManagerBusiness } from './garbage-profiles-label-manager.business';
import {
  GarbageProfilesLabelConfirmWindow,
  GarbageProfilesLabelDetailsWindow,
} from './garbage-profiles-label-manager.model';

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
    details: new GarbageProfilesLabelDetailsWindow(),
    confirm: new GarbageProfilesLabelConfirmWindow(),
  };

  selecteds: LabelModel[] = [];
  count = 0;

  onsearch() {
    this.load.emit(this.args);
  }

  onwindowclose() {
    this.window.details.selected = undefined;
    this.window.details.show = false;
    this.window.confirm.show = false;
  }

  oncreate() {
    this.window.details.selected = new LabelModel();
    this.window.details.selected.Id = this.count;
    this.window.details.selected.State = 0;
    this.window.details.state = FormState.add;
    this.window.details.show = true;
  }
  onupdate(model: LabelModel) {
    let plain = instanceToPlain(model);
    this.window.details.selected = plainToInstance(LabelModel, plain);
    this.window.details.state = FormState.edit;
    this.window.details.show = true;
  }
  loaded(paged: PagedList<LabelModel>) {
    this.count = paged.Page.TotalRecordCount;
  }
  oncreateok(model: LabelModel) {
    this.load.emit(this.args);
    switch (this.window.details.state) {
      case FormState.add:
        this.toastr.success(`成功创建1条标签`);
        break;
      case FormState.edit:
        this.toastr.success(`成功修改1条标签`);
        break;

      default:
        break;
    }
    this.onwindowclose();
  }

  todelete() {
    this.window.confirm.show = true;
  }

  ondelete() {
    this.business.delete(this.selecteds).then((x) => {
      this.load.emit(this.args);
      this.toastr.success(`成功删除${x.length}条标签`);
      this.selecteds = [];
    });
    this.onwindowclose();
  }
}
