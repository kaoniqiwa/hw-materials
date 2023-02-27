import { WindowViewModel } from 'src/app/common/components/window-control/window.model';
import { MaterialCategory } from 'src/app/network/entity/material-category.entity';

export class GarbageProfilesMaterialManagerSource {
  categorys: MaterialCategory[] = [];
}

export class GarbageProfilesMaterialRecordWindow extends WindowViewModel {
  style = {
    width: '60%',
  };
}
export class GarbageProfilesMaterialDetailsWindow extends WindowViewModel {}
export class GarbageProfilesMaterialPutInWindow extends WindowViewModel {
  constructor() {
    super();
    this.show = true;
  }
  style = {
    width: '50%',
  };
}
export class GarbageProfilesMaterialPutOutWindow extends WindowViewModel {
  constructor() {
    super();
    this.show = true;
  }
  style = {
    width: '50%',
  };
}
