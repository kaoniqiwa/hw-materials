import { Component, Input, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { FormState } from 'src/app/enum/form-state.enum';
import { MaintenanceProfile } from 'src/app/network/entity/maintenance-profile.entity';
import { StatePartialData } from 'src/app/network/entity/partial-data.interface';
import { User } from 'src/app/network/entity/user.model';
import { IParams } from 'src/app/network/request/IParams.interface';
import {
  ConstructionApplyParams,
  ConstructionApproveParams,
  CreateMaintenanceProfileParams,
  DistributeMaintenanceProfileParams,
  SubmitMaintenanceProfileParams,
} from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfileDetailsManagerBusiness } from './maintenance-profile-details-manager.business';

@Component({
  selector: 'maintenance-profile-details-manager',
  templateUrl: './maintenance-profile-details-manager.component.html',
  styleUrls: ['./maintenance-profile-details-manager.component.less'],
  providers: [MaintenanceProfileDetailsManagerBusiness],
})
export class MaintenanceProfileDetailsManagerComponent implements OnInit {
  @Input()
  data?: StatePartialData;

  @Input()
  formState: FormState = FormState.none;

  constructor(
    private business: MaintenanceProfileDetailsManagerBusiness,

    local: LocalStorageService
  ) {
    this.user = local.user;
  }

  user: User;
  profile?: MaintenanceProfile;
  params: IParams = new CreateMaintenanceProfileParams();

  ngOnInit(): void {
    console.log(this.user);
    if (this.data) {
      this.business.load(this.data.Id, this.data.ProfileState).then((data) => {
        this.profile = data;

        console.log(this.profile);
      });

      this.params = this.getParams(this.data.ProfileState);
    }
  }

  getParams(state: number) {
    switch (state) {
      case 1:
        return new DistributeMaintenanceProfileParams();
      case 2:
        return new ConstructionApplyParams();
      case 3:
        return new ConstructionApproveParams();
      case 4:
        return new SubmitMaintenanceProfileParams();
      default:
        return new CreateMaintenanceProfileParams();
    }
  }

  /** 创建工单 */
  create(params: CreateMaintenanceProfileParams) {
    this.business.create(params);
  }
  /** 分派维修工单 */
  distribute(params: DistributeMaintenanceProfileParams) {
    if (this.data) {
      this.business.distribute(this.data.Id, params);
    }
  }
  /** 申请工程维修（需要施工） */
  constructionapply(params: ConstructionApplyParams) {
    if (this.data) {
      this.business.constructionapply(this.data.Id, params);
    }
  }
  /** 审批工程维修（需要施工） */
  constructionapprove(params: ConstructionApproveParams) {
    if (this.data) {
      this.business.constructionapprove(this.data.Id, params);
    }
  }
  /** 提交维修完成或维修未完成 */
  submit(params: SubmitMaintenanceProfileParams) {
    if (this.data) {
      this.business.submit(this.data.Id, params);
    }
  }
}
