import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Contract } from 'src/app/network/entity/contact.entity';
import { DistributeMaintenanceProfileParams } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfilesLanguageTools } from '../../tools/maintenance-profile-language.too';
import { MaintenanceProfileDetailsDistributeBusiness } from './maintenance-profile-details-distribute.business';

@Component({
  selector: 'maintenance-profile-details-distribute',
  templateUrl: './maintenance-profile-details-distribute.component.html',
  styleUrls: ['./maintenance-profile-details-distribute.component.less'],
  providers: [MaintenanceProfileDetailsDistributeBusiness],
})
export class MaintenanceProfileDetailsDistributeComponent implements OnInit {
  @Input()
  profileId: string = '';
  @Output()
  ok: EventEmitter<string> = new EventEmitter();
  @Output()
  details: EventEmitter<string> = new EventEmitter();

  constructor(
    private business: MaintenanceProfileDetailsDistributeBusiness,
    public language: MaintenanceProfilesLanguageTools,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    if (!this.params.MaintenanceDeadline) {
      let today = new Date();
      today.setDate(today.getDate() + 1);
      this.params.MaintenanceDeadline = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59
      );
    }

    this.business.get().then((x) => {
      this.contracts = x;
    });
  }

  params: DistributeMaintenanceProfileParams =
    new DistributeMaintenanceProfileParams();
  contracts: Contract[] = [];
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
          this.ok.emit(this.profileId);
          this.toastr.success('操作成功');
        })
        .catch((x) => {
          this.toastr.error('操作失败');
          console.error(x);
        });
    }
  }

  ondetails() {
    this.details.emit(this.profileId);
  }
}
