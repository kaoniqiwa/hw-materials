import { Component, EventEmitter } from '@angular/core';
import { LabelModel } from 'src/app/model/label.model';

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
  constructor(private business: GarbageProfilesLabelManagerBusiness) {}
  load: EventEmitter<GarbageProfilesLabelTableArgs> = new EventEmitter();
  args: GarbageProfilesLabelTableArgs = new GarbageProfilesLabelTableArgs();

  window = {
    details: new GarbageProfilesLabelDetailsWindow(),
  };

  selected?: LabelModel;

  onsearch() {
    this.load.emit(this.args);
  }

  onwindowclose() {
    this.window.details.show = false;
  }

  oncreate() {
    this.selected = new LabelModel();

    this.window.details.show = true;
  }
  oncreateok(model: LabelModel) {
    this.business.create(model).then((x) => {
      this.load.emit(this.args);
    });
  }
}
