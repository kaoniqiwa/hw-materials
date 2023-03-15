import { WindowViewModel } from 'src/app/common/components/window-control/window.model';
import { MaterialRecordModel } from 'src/app/model/material-record.model';
import { MaterialModel } from 'src/app/model/material.model';
import { MaterialCategory } from 'src/app/network/entity/material-category.entity';

export class GarbageProfilesMaterialManagerSource {
  categorys: MaterialCategory[] = [];
}

export class GarbageProfilesMaterialRecordDetailsWindow extends WindowViewModel {
  style = {
    width: '50%',
    height: '50%',
  };
  model?: MaterialRecordModel;
}

export class GarbageProfilesMaterialRecordWindow extends WindowViewModel {
  style = {};
  details = new GarbageProfilesMaterialRecordDetailsWindow();

  ondetails(model: MaterialRecordModel) {
    this.details.model = model;
    this.details.show = true;
  }
}
export class GarbageProfilesMaterialDetailsWindow extends WindowViewModel {}
export class GarbageProfilesMaterialPutInWindow extends WindowViewModel {
  style = {
    width: '50%',
  };
}
export class GarbageProfilesMaterialPutOutWindow extends WindowViewModel {
  style = {
    width: '50%',
  };
}
export class GarbageProfilesMaterialPictureWindow extends WindowViewModel {
  style = {
    width: '50%',
    height: '50%',
  };
  urlId?: string;
}
export class GarbageProfilesMaterialTimelineWindow extends WindowViewModel {
  style = {};
  model?: MaterialModel;
}
