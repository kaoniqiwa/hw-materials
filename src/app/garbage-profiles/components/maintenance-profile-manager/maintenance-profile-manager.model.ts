import { DataWindowViewModel } from 'src/app/common/components/window-control/window.model';
import { PropertyValueModel } from 'src/app/model/property-value.model';
import { ConstructionApplyParams } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';

export class MaintenanceProfileWindow {
  setting = new MaintenanceProfileSettingWindow();
  details = new MaintenanceProfileDeatilsWindow();
  filter = new MaintenanceProfileFilterWindow();
  picture = new MaintenanceProfilePictureWindow();
  partial = new MaintenanceProfilePartialDataWindow();

  create = new MaintenanceProfileCreateWindow();
  distribute = new MaintenanceProfileDistributeWindow();
  construction = new MaintenanceProfileConstructionWindow();
  submit = new MaintenanceProfileSubmitWindow();
  complete = new MaintenanceProfileCompleteWindow();
  clear() {
    this.setting.clear();
    this.details.clear();
    this.filter.clear();
    this.picture.clear();
    this.partial.clear();
    this.construction.clear();
    this.create.clear();
    this.distribute.clear();
    this.submit.clear();
    this.complete.clear();
  }
  close() {
    this.setting.show = false;
    this.details.show = false;
    this.filter.show = false;
    this.picture.single.show = false;
    this.picture.multiple.show = false;
    this.partial.show = false;
    this.construction.apply.show = false;
    this.construction.approve.show = false;
    this.create.show = false;
    this.distribute.show = false;
    this.submit.show = false;
    this.complete.show = false;
  }
}
class MaintenanceProfileSettingWindow extends DataWindowViewModel {
  clear(): void {}
  style = { width: '60%' };
}
class MaintenanceProfileDeatilsWindow extends DataWindowViewModel {
  clear(): void {
    this.id = '';
  }
  style = {
    width: '70%',
  };
  id = '';
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
class MaintenanceProfilePartialDataWindow extends DataWindowViewModel {
  override clear(): void {
    this.model = undefined;
    this.id = undefined;
  }
  style = {
    width: 'auto',
    height: '700px',
  };
  model?: PropertyValueModel;
  id?: string;
}
class MaintenanceProfileConstructionApplyWindow extends DataWindowViewModel {
  clear(): void {
    this.params = new ConstructionApplyParams();
    this.id = '';
  }
  style = {
    width: '50%',
    height: 'auto',
  };
  params: ConstructionApplyParams = new ConstructionApplyParams();
  id: string = '';
}

class MaintenanceProfileConstructionApproveWindow extends DataWindowViewModel {
  clear(): void {
    this.id = '';
  }
  style = {
    width: '50%',
    height: 'auto',
  };
  id = '';
  agree!: boolean;
}

class MaintenanceProfileConstructionWindow extends DataWindowViewModel {
  clear(): void {
    this.apply.clear();
    this.approve.clear();
    this.state = undefined;
  }
  apply = new MaintenanceProfileConstructionApplyWindow();
  approve = new MaintenanceProfileConstructionApproveWindow();
  state?: number;
}
class MaintenanceProfileCreateWindow extends DataWindowViewModel {
  clear(): void {}
  style = {
    width: '50%',
    height: 'auto',
  };
}
class MaintenanceProfileDistributeWindow extends DataWindowViewModel {
  clear(): void {
    this.id = '';
  }
  style = {
    width: '25%',
    height: 'auto',
  };
  id: string = '';
}
class MaintenanceProfileSubmitWindow extends DataWindowViewModel {
  clear(): void {
    this.id = '';
  }
  style = {
    width: '50%',
    height: 'auto',
  };
  id: string = '';
}
class MaintenanceProfileCompleteWindow extends DataWindowViewModel {
  clear(): void {
    this.id = '';
  }
  style = {
    width: '500px',
    height: 'auto',
  };
  id: string = '';
}
