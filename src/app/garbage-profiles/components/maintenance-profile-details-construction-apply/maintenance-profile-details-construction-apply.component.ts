import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IComponent } from 'src/app/common/interfaces/component.interfact';
import { IModel } from 'src/app/common/interfaces/model.interface';
import { MaintenanceProfile } from 'src/app/network/entity/maintenance-profile.entity';
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
  implements IComponent<IModel, MaintenanceProfile>, OnInit
{
  @Input()
  business: MaintenanceProfileDetailsConstructionApplyBusiness;
  @Input()
  profileId!: string;
  @Input()
  params: ConstructionApplyParams = new ConstructionApplyParams();
  @Output()
  paramsChange: EventEmitter<ConstructionApplyParams> = new EventEmitter();
  @Output()
  ok: EventEmitter<void> = new EventEmitter();
  constructor(
    public language: MaintenanceProfilesLanguageTools,
    business: MaintenanceProfileDetailsConstructionApplyBusiness,
    private toastr: ToastrService
  ) {
    this.business = business;
  }

  data?: MaintenanceProfile;

  ngOnInit(): void {
    if (this.profileId) {
      this.business.load(this.profileId).then((x) => {
        this.data = x;
        console.log(this.data);
      });
    }
  }

  onok() {
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
