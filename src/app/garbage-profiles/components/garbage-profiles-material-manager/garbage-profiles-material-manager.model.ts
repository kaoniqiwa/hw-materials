import { DataWindowViewModel } from 'src/app/common/components/window-control/window.model';
import { MaterialRecordModel } from 'src/app/model/material-record.model';
import { MaterialModel } from 'src/app/model/material.model';
import { MaterialCategory } from 'src/app/network/entity/material-category.entity';

export class GarbageProfilesMaterialWindow {
  details = new GarbageProfilesMaterialDetailsWindow();
  record = new GarbageProfilesMaterialRecordWindow();
  putin = new GarbageProfilesMaterialPutInWindow();
  putout = new GarbageProfilesMaterialPutOutWindow();
  picture = new GarbageProfilesMaterialPictureWindow();
  timeline = new GarbageProfilesMaterialTimelineWindow();
  close() {
    this.details.show = false;
    this.record.show = false;
    this.putin.show = false;
    this.putout.show = false;
    this.picture.show = false;
    this.timeline.show = false;
  }
  clear() {
    this.details.clear();
    this.record.clear();
    this.putin.clear();
    this.putout.clear();
    this.picture.clear();
    this.timeline.clear();
  }
}

export class GarbageProfilesMaterialManagerSource {
  categorys: MaterialCategory[] = [];
}

class GarbageProfilesMaterialRecordDetailsWindow extends DataWindowViewModel {
  style = {
    width: '50%',
    height: '50%',
  };
  model?: MaterialRecordModel;
  clear() {
    this.model = undefined;
  }
}

class GarbageProfilesMaterialRecordWindow extends DataWindowViewModel {
  clear(): void {
    this.details.clear();
  }
  style = {};
  details = new GarbageProfilesMaterialRecordDetailsWindow();

  ondetails(model: MaterialRecordModel) {
    this.details.model = model;
    this.details.show = true;
  }
}
class GarbageProfilesMaterialDetailsWindow extends DataWindowViewModel {
  clear(): void {}
}
class GarbageProfilesMaterialPutInWindow extends DataWindowViewModel {
  clear(): void {}
  style = {};
}
class GarbageProfilesMaterialPutOutWindow extends DataWindowViewModel {
  clear(): void {
    this.id = undefined;
  }
  style = {};
  id?: string;
  override show = true;
}
class GarbageProfilesMaterialPictureWindow extends DataWindowViewModel {
  clear(): void {
    this.urlId = undefined;
  }
  style = {
    width: '50%',
    height: '50%',
  };
  urlId?: string;
}
class GarbageProfilesMaterialTimelineWindow extends DataWindowViewModel {
  clear(): void {
    this.model = undefined;
  }
  style = {};
  model?: MaterialModel;
}
