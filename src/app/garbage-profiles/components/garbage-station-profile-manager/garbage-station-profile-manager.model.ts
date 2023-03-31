import { DataWindowViewModel } from 'src/app/common/components/window-control/window.model';
import { FormState } from 'src/app/enum/form-state.enum';
import { ModificationRecordModel } from 'src/app/model/modification-record.model';
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
    this.record.modification.table.show = false;
    this.record.modification.details.show = false;
  }
}

class GarbageStationProfileDetailsWindow extends DataWindowViewModel {
  clear(): void {
    this.form = FormState.none;
    this.selected = undefined;
    this.state = 0;
  }
  style = {
    width: '600px',
    height: 'auto',
  };
  form: FormState = FormState.none;
  state: number = 0;
  selected?: string;
}
class GarbageStationProfileSettingWindow extends DataWindowViewModel {
  clear(): void {}
  style = { width: '60%' };
}
class GarbageStationProfilePictureWindow extends DataWindowViewModel {
  clear(): void {
    this.urlId = undefined;
  }
  style = {
    width: '50%',
    height: '50%',
  };
  urlId?: string;
}

class GarbageStationProfileRecordModificationTableWindow extends DataWindowViewModel {
  clear(): void {}
  style = {};
}
class GarbageStationProfileRecordModificationDetailsWindow extends DataWindowViewModel {
  clear(): void {
    this.model = undefined;
  }
  style = {
    width: '40%',
    height: 'auto',
  };
  model?: ModificationRecordModel;
}

class GarbageStationProfileRecordModificationWindow {
  clear() {
    this.table.clear();
    this.details.clear();
  }
  table = new GarbageStationProfileRecordModificationTableWindow();
  details = new GarbageStationProfileRecordModificationDetailsWindow();
  ondetails(model: ModificationRecordModel) {
    this.details.model = model;
    this.details.show = true;
  }
}
class GarbageStationProfileRecordMaterialWindow extends DataWindowViewModel {
  clear(): void {}
}
class GarbageStationProfileRecordWindow {
  material = new GarbageStationProfileRecordMaterialWindow();
  modification = new GarbageStationProfileRecordModificationWindow();
}
class GarbageStationProfileConfirmWindow extends DataWindowViewModel {
  clear(): void {}
  style = {
    width: '300px',
    height: '100px',
  };
}
class GarbageStationProfilePartialDataWindow extends DataWindowViewModel {
  clear(): void {
    this.model = undefined;
    this.id = undefined;
  }
  style = {
    width: 'auto',
    height: '700px',
    maxWidth: '960px',
  };
  model?: PropertyValueModel;
  id?: string;
}
class GarbageStationProfileFilterWindow extends DataWindowViewModel {
  clear(): void {}
  style = {
    width: '800px',
    height: 'auto',
  };
}
class GarbageStationProfileMaterialPutoutWindow extends DataWindowViewModel {
  clear(): void {}
  style = {};

  id?: string;
}
