import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConstructionApplyParams } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfilesLanguageTools } from '../../tools/maintenance-profile-language.too';
import { MaintenanceProfileDetailsConstructionApplyBusiness } from './maintenance-profile-details-construction-apply.business';

@Component({
  selector: 'maintenance-profile-details-construction-apply',
  templateUrl:
    './maintenance-profile-details-construction-apply.component.html',
  styleUrls: [
    './maintenance-profile-details-construction-apply.component.less',
  ],
  providers: [MaintenanceProfileDetailsConstructionApplyBusiness],
})
export class MaintenanceProfileDetailsConstructionApplyComponent
  implements OnInit
{
  @Input()
  profileId!: string;
  @Output()
  ok: EventEmitter<void> = new EventEmitter();
  constructor(
    public language: MaintenanceProfilesLanguageTools,
    private business: MaintenanceProfileDetailsConstructionApplyBusiness,
    private toastr: ToastrService
  ) {
    this.business = business;
  }

  params: ConstructionApplyParams = new ConstructionApplyParams();
  ngOnInit(): void {}

  submit() {
    if (this.profileId) {
      this.business
        .apply(this.profileId, this.params)
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
