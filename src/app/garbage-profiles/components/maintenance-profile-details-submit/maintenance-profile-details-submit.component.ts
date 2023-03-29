import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PutOutMaterialsParams } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';
import { SubmitMaintenanceProfileParams } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfilesLanguageTools } from '../../tools/maintenance-profile-language.too';
import { MaintenanceProfileDetailsSubmitBusiness } from './maintenance-profile-details-submit.business';

@Component({
  selector: 'maintenance-profile-details-submit',
  templateUrl: './maintenance-profile-details-submit.component.html',
  styleUrls: ['./maintenance-profile-details-submit.component.less'],
  providers: [MaintenanceProfileDetailsSubmitBusiness],
})
export class MaintenanceProfileDetailsSubmitComponent {
  @Input()
  profileId!: string;
  @Output()
  ok: EventEmitter<void> = new EventEmitter();
  constructor(
    private business: MaintenanceProfileDetailsSubmitBusiness,
    private language: MaintenanceProfilesLanguageTools,
    private toastr: ToastrService
  ) {}
  params: {
    submit: SubmitMaintenanceProfileParams;
    putout?: PutOutMaterialsParams;
  } = {
    submit: new SubmitMaintenanceProfileParams(),
  };

  private validate(params: SubmitMaintenanceProfileParams) {
    console.log(params);
    if (!params.SceneImageUrls || params.SceneImageUrls.length === 0) {
      this.toastr.warning('至少一张照片');
      return false;
    }
    if (params.Repaired) {
      if (!params.FaultType) {
        this.toastr.warning(`请选择${this.language['FaultType']}`);
        return false;
      }
    }

    return true;
  }

  async submit() {
    if (this.validate(this.params.submit)) {
      let goon = true;
      if (this.params.putout) {
        let result = await this.onputout(this.params.putout);
        goon = !!result;
        if (goon && result) {
          this.params.submit.MaterialItems = result.MaterialItems;
        }
      }
      if (goon) {
        this.business
          .submit(this.profileId, this.params.submit)
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

  onputout(params: PutOutMaterialsParams) {
    return this.business
      .putout(params)
      .then((x) => {
        this.toastr.success('出库成功');
        return x;
      })
      .catch((x) => {
        this.toastr.error('出库失败');
        console.error(x);
        return undefined;
      });
  }

  async toputout(params: PutOutMaterialsParams) {
    this.params.putout = params;
    let data = await this.business.get(this.profileId);
    this.params.putout.ProfileId = data.GarbageStationProfileId;
    this.params.putout.ProfileName = data.GarbageStationName;
  }
}
