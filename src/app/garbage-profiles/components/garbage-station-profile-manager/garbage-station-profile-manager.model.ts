import { WindowViewModel } from 'src/app/common/components/window-control/window.model';
import { FormState } from 'src/app/enum/form-state.enum';
import { PropertyValueModel } from 'src/app/model/property-value.model';

export class GarbageStationProfileDetailsWindow extends WindowViewModel {
  style = {
    width: '600px',
    height: 'auto',
  };
  state: FormState = FormState.none;
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
export class GarbageStationProfileRecordWindow extends WindowViewModel {
  style = {};
}
export class GarbageStationProfileConfirmWindow extends WindowViewModel {
  style = {
    width: '300px',
    height: '100px',
  };
}
export class GarbageStationProfilePartialDataWindow extends WindowViewModel {
  style = {
    width: '600px',
    height: 'auto',
  };
  model?: PropertyValueModel;
}
export class GarbageStationProfileFilterWindow extends WindowViewModel {
  style = {
    width: '800px',
    height: 'auto',
  };
}
