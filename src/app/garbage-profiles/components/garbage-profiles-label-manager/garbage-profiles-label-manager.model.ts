import { WindowViewModel } from 'src/app/common/components/window-control/window.model';
import { FormState } from 'src/app/enum/form-state.enum';
import { LabelModel } from 'src/app/model/label.model';

export class GarbageProfilesLabelDetailsWindow extends WindowViewModel {
  style = {
    width: '300px',
    height: '200px',
  };
  selected?: LabelModel;
  state: FormState = FormState.none;
}

export class GarbageProfilesLabelConfirmWindow extends WindowViewModel {
  style = {
    width: '300px',
    height: '100px',
  };
}
