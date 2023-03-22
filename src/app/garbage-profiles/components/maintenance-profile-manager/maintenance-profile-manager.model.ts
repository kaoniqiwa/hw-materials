import { DataWindowViewModel } from 'src/app/common/components/window-control/window.model';
import { FormState } from 'src/app/enum/form-state.enum';

export class MaintenanceProfileWindow {
  setting = new MaintenanceProfileSettingWindow();
  details = new MaintenanceProfileDeatilsWindow();
  filter = new MaintenanceProfileFilterWindow();
  picture = new MaintenanceProfilePictureWindow();
  clear() {
    this.setting.clear();
    this.details.clear();
    this.filter.clear();
    this.picture.clear();
  }
  close() {
    this.setting.show = false;
    this.details.show = false;
    this.filter.show = false;
    this.picture.single.show = false;
    this.picture.multiple.show = false;
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

class MaintenanceProfileFilterWindow extends DataWindowViewModel {
  clear(): void {}
  style = {
    width: '800px',
    height: 'auto',
  };
}
class MaintenanceProfilePictureMultipleWindow extends DataWindowViewModel {
  override clear(): void {
    this.ids = [];
  }
  style = {
    width: '50%',
    height: '50%',
  };
  ids: string[] = [];
}
class MaintenanceProfilePictureSingleWindow extends DataWindowViewModel {
  override clear(): void {
    this.id = undefined;
  }
  style = {
    width: '50%',
    height: '50%',
  };
  id?: string;
}
class MaintenanceProfilePictureWindow {
  clear(): void {
    this.single.clear();
    this.multiple.clear();
  }

  single = new MaintenanceProfilePictureSingleWindow();
  multiple = new MaintenanceProfilePictureMultipleWindow();
}
