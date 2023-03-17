import { WindowViewModel } from 'src/app/common/components/window-control/window.model';
import { IObjectModel } from 'src/app/common/interfaces/model.interface';
import { FormState } from 'src/app/enum/form-state.enum';
import { PropertyValueModel } from 'src/app/model/property-value.model';
export class GarbageStationProfileWindow {
  details = new GarbageStationProfileDetailsWindow();
  setting = new GarbageStationProfileSettingWindow();
  picture = new GarbageStationProfilePictureWindow();

  confirm = new GarbageStationProfileConfirmWindow();
  partial = new GarbageStationProfilePartialDataWindow();
  filter = new GarbageStationProfileFilterWindow();
  putout = new GarbageStationProfileMaterialPutoutWindow();
  record = new GarbageStationProfileRecordWindow();

  clear() {
    this.details.clear();
    this.setting.clear();
    this.picture.clear();
    this.confirm.clear();
    this.partial.clear();
    this.filter.clear();
    this.putout.clear();
    this.record.material.clear();
    this.record.modification.clear();
  }
  close() {
    this.details.show = false;
    this.setting.show = false;
    this.picture.show = false;
    this.confirm.show = false;
    this.partial.show = false;
    this.filter.show = false;
    this.putout.show = false;
    this.record.material.show = false;
    this.record.modification.show = false;
  }
}

abstract class ClearWindowViewModel extends WindowViewModel {
  clear(): void {}
}

class GarbageStationProfileDetailsWindow extends ClearWindowViewModel {
  override clear(): void {
    this.state = FormState.none;
    this.selected = undefined;
  }
  style = {
    width: '600px',
    height: 'auto',
  };
  state: FormState = FormState.none;
  selected?: string;
}
class GarbageStationProfileSettingWindow extends ClearWindowViewModel {
  style = { width: '60%' };
}
class GarbageStationProfilePictureWindow extends ClearWindowViewModel {
  override clear(): void {
    this.urlId = undefined;
  }
  style = {
    width: '50%',
    height: '50%',
  };
  urlId?: string;
}
class GarbageStationProfileRecordModificationWindow extends ClearWindowViewModel {
  style = {};
}
class GarbageStationProfileRecordMaterialWindow extends ClearWindowViewModel {}
class GarbageStationProfileRecordWindow {
  material = new GarbageStationProfileRecordMaterialWindow();
  modification = new GarbageStationProfileRecordModificationWindow();
}
class GarbageStationProfileConfirmWindow extends ClearWindowViewModel {
  style = {
    width: '300px',
    height: '100px',
  };
}
class GarbageStationProfilePartialDataWindow extends ClearWindowViewModel {
  override clear(): void {
    this.model = undefined;
    this.id = undefined;
  }
  style = {
    width: 'auto',
    height: '600px',
  };
  model?: PropertyValueModel;
  id?: string;
}
class GarbageStationProfileFilterWindow extends ClearWindowViewModel {
  style = {
    width: '800px',
    height: 'auto',
  };
}
class GarbageStationProfileMaterialPutoutWindow extends ClearWindowViewModel {
  style = {};

  profile?: IObjectModel;
}
