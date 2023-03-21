import { DataWindowViewModel } from 'src/app/common/components/window-control/window.model';
import { FormState } from 'src/app/enum/form-state.enum';

export class MaintenanceProfileWindow {
  setting = new MaintenanceProfileSettingWindow();
  details = new MaintenanceProfileDeatilsWindow();
  clear() {
    this.setting.clear();
    this.details.clear();
  }
  close() {
    this.setting.show = false;
    this.details.show = false;
  }
}
class MaintenanceProfileSettingWindow extends DataWindowViewModel {
  clear(): void {}
  style = { width: '60%' };
}
class MaintenanceProfileDeatilsWindow extends DataWindowViewModel {
  clear(): void {
    this.formState = FormState.none;
    this.id = undefined;
  }
  style = {};
  formState: FormState = FormState.none;
  id?: string;
}
