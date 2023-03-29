import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DateTimePickerView } from 'src/app/common/directives/date-time-picker/date-time-picker.directive';
import { ConstructionApproveParams } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfilesLanguageTools } from '../../tools/maintenance-profile-language.too';
import { MaintenanceProfileDetailsConstructionApproveBusiness } from './maintenance-profile-details-construction-approve.business';

@Component({
  selector: 'maintenance-profile-details-construction-approve',
  templateUrl:
    './maintenance-profile-details-construction-approve.component.html',
  styleUrls: [
    './maintenance-profile-details-construction-approve.component.less',
  ],
  providers: [MaintenanceProfileDetailsConstructionApproveBusiness],
})
export class MaintenanceProfileDetailsConstructionApproveComponent
  implements OnInit
{
  @Input()
  profileId!: string;
  @Input()
  agree: boolean = false;

  @Output()
  ok: EventEmitter<void> = new EventEmitter();
  constructor(
    public language: MaintenanceProfilesLanguageTools,
    private business: MaintenanceProfileDetailsConstructionApproveBusiness,
    private toastr: ToastrService
  ) {
    this.business = business;
  }
  params: ConstructionApproveParams = new ConstructionApproveParams();
  DateTimePickerView = DateTimePickerView;

  ngOnInit(): void {
    this.params.ApproveOrNot = this.agree;

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

  submit() {
    if (this.profileId) {
      this.business
        .approve(this.profileId, this.params)
        .then((x) => {
          this.toastr.success('操作成功');
          this.ok.emit();
        })
        .catch((x) => {
          this.toastr.error('操作失败');
          console.log(x);
        });
    }
  }
}
