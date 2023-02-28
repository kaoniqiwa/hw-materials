import { WindowViewModel } from 'src/app/common/components/window-control/window.model';
import { FormState } from 'src/app/enum/form-state.enum';

export class GarbageStationProfileDetailsWindow extends WindowViewModel {
  style = {
    width: '600px',
    height: '550px',
  };
  state: FormState = FormState.none;
}
