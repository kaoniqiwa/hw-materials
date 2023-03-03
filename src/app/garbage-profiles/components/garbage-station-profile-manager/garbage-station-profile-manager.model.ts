import { WindowViewModel } from 'src/app/common/components/window-control/window.model';
import { FormState } from 'src/app/enum/form-state.enum';

export class GarbageStationProfileDetailsWindow extends WindowViewModel {
  style = {
    width: '600px',
    height: 'auto',
  };
  state: FormState = FormState.none;
}
export class GarbageStationProfileSettingWindow extends WindowViewModel {
  style = {
    width: '600px',
  };
}
export class GarbageStationProfilePictureWindow extends WindowViewModel {
  style = {
    width: '50%',
    height: '50%',
  };
  urlId?: string;
}
