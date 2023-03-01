import { WindowViewModel } from 'src/app/common/components/window-control/window.model';
import { MaterialCategory } from 'src/app/network/entity/material-category.entity';

export class GarbageProfilesMaterialManagerSource {
  categorys: MaterialCategory[] = [];
}

export class GarbageProfilesMaterialRecordWindow extends WindowViewModel {
  constructor() {
    super();
    this.show = true;
  }
  style = {};
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
  url?: string;
}
