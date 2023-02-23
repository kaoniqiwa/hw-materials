import { WindowViewModel } from 'src/app/common/components/window-control/window.model';
import { MaterialRecordType } from 'src/app/enum/material-record-type.enum';
import { MaterialCategory } from 'src/app/network/entity/material-category.entity';

export class GarbageProfilesMaterialManagerSource {
  categorys: MaterialCategory[] = [];
}

export class GarbageProfilesMaterialRecordWindow extends WindowViewModel {
  type: MaterialRecordType = MaterialRecordType.in;
}
export class GarbageProfilesMaterialDetailsWindow extends WindowViewModel {}
export class GarbageProfilesMaterialPutInWindow extends WindowViewModel {
  style = {
    width: '400px',
    height: '670px',
  };
}
