import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WindowViewModel } from 'src/app/common/components/window-control/window.model';
import { CreateMaintenanceProfileParams } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfilesLanguageTools } from '../../tools/maintenance-profile-language.too';
import { MaintenanceProfileDetailsCreateBusiness } from './maintenance-profile-details-create.business';

@Component({
  selector: 'maintenance-profile-details-create',
  templateUrl: './maintenance-profile-details-create.component.html',
  styleUrls: ['./maintenance-profile-details-create.component.less'],
  providers: [MaintenanceProfileDetailsCreateBusiness],
})
export class MaintenanceProfileDetailsCreateComponent {
  @Input()
  window = new WindowViewModel();
  @Input()
  style: any;
  @Output()
  ok: EventEmitter<void> = new EventEmitter();
  params: CreateMaintenanceProfileParams = new CreateMaintenanceProfileParams();
  constructor(
    private business: MaintenanceProfileDetailsCreateBusiness,
    private language: MaintenanceProfilesLanguageTools,
    private toastr: ToastrService
  ) {}
  validate(params: CreateMaintenanceProfileParams) {
    if (params.ProfileType === 1) {
      if (!params.Customer) {
        this.toastr.warning(`请输入${this.language['Customer']}`);
        return false;
      }
      if (!params.CustomerPhoneNo) {
        this.toastr.warning(`请输入${this.language['CustomerPhoneNo']}`);
        return false;
      }
      if (!params.FaultDate) {
        this.toastr.warning(`请输入${this.language['FaultDate']}`);
        return false;
      }
    }
    return true;
  }
  create() {
    if (this.validate(this.params)) {
      this.business
        .create(this.params)
        .then((x) => {
          this.ok.emit();
          this.toastr.success('操作成功');
        })
        .catch((x) => {
          this.toastr.error('操作失败');
          console.error(x);
        });
    }
  }
}
