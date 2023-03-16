import { WindowViewModel } from 'src/app/common/components/window-control/window.model';
import { FormState } from 'src/app/enum/form-state.enum';
import { PropertyValueModel } from 'src/app/model/property-value.model';

export class GarbageStationProfileDetailsWindow extends WindowViewModel {
  style = {
    width: '600px',
    height: 'auto',
  };
  state: FormState = FormState.none;
  selected?: string;
}
export class GarbageStationProfileSettingWindow extends WindowViewModel {
  style = { width: '60%' };
}
export class GarbageStationProfilePictureWindow extends WindowViewModel {
  style = {
    width: '50%',
    height: '50%',
  };
  urlId?: string;
}
export class GarbageStationProfileRecordModificationWindow extends WindowViewModel {
  style = {};
}
export class GarbageStationProfileRecordMaterialWindow extends WindowViewModel {}
export class GarbageStationProfileRecordWindow {
  material = new GarbageStationProfileRecordMaterialWindow();
  modification = new GarbageStationProfileRecordModificationWindow();
}
export class GarbageStationProfileConfirmWindow extends WindowViewModel {
  style = {
    width: '300px',
    height: '100px',
  };
}
export class GarbageStationProfilePartialDataWindow extends WindowViewModel {
  style = {
    width: 'auto',
    height: '600px',
  };
  model?: PropertyValueModel;
  id?: string;
}
export class GarbageStationProfileFilterWindow extends WindowViewModel {
  style = {
    width: '800px',
    height: 'auto',
  };
  override show: boolean = false;
}
