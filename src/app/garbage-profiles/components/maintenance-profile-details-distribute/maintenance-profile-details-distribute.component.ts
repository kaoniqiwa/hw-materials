import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DistributeMaintenanceProfileParams } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfilesLanguageTools } from '../../tools/maintenance-profile-language.too';
import { MaintenanceProfileDetailsDistributeBusiness } from './maintenance-profile-details-distribute.business';

@Component({
  selector: 'maintenance-profile-details-distribute',
  templateUrl: './maintenance-profile-details-distribute.component.html',
  styleUrls: ['./maintenance-profile-details-distribute.component.less'],
  providers: [MaintenanceProfileDetailsDistributeBusiness],
})
export class MaintenanceProfileDetailsDistributeComponent {
  @Input()
  profileId: string = '';
  @Output()
  ok: EventEmitter<void> = new EventEmitter();

  constructor(
    private business: MaintenanceProfileDetailsDistributeBusiness,
    private language: MaintenanceProfilesLanguageTools,
    private toastr: ToastrService
  ) {}

  params: DistributeMaintenanceProfileParams =
    new DistributeMaintenanceProfileParams();

  validate(params: DistributeMaintenanceProfileParams) {
    if (!params.MaintenanceUserId) {
      this.toastr.warning(`请输入${this.language['DistributionPersonnel']}`);
      return false;
    }
    if (!params.MaintenanceDeadline) {
      this.toastr.warning(`请输入${this.language['MaintenanceDeadline']}`);
      return false;
    }
    return true;
  }

  submit() {
    if (this.validate(this.params)) {
      this.business
        .distribute(this.profileId, this.params)
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
