import { Component, Input, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { FormState } from 'src/app/enum/form-state.enum';
import { MaintenanceProfile } from 'src/app/network/entity/maintenance-profile.entity';
import { StatePartialData } from 'src/app/network/entity/partial-data.interface';
import { User } from 'src/app/network/entity/user.model';
import { MaintenanceProfileDetailsManagerBusiness } from './maintenance-profile-details-manager.business';
import { MaintenanceProfileDetailsManagerParams } from './maintenance-profile-details-manager.model';

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
  params = new MaintenanceProfileDetailsManagerParams();

  ngOnInit(): void {
    console.log(this.user);
    if (this.data) {
      this.business.load(this.data.Id, this.data.ProfileState).then((data) => {
        this.profile = data;

        console.log(this.profile);
      });
    }
  }

  /** 创建工单 */
  create() {
    this.business.create(this.params.create);
  }
  /** 分派维修工单 */
  distribute() {
    if (this.data) {
      this.business.distribute(this.data.Id, this.params.distribute);
    }
  }
  /** 申请工程维修（需要施工） */
  constructionapply() {
    if (this.data) {
      this.business.constructionapply(
        this.data.Id,
        this.params.constructionapply
      );
    }
  }
  /** 审批工程维修（需要施工） */
  constructionapprove() {
    if (this.data) {
      this.business.constructionapprove(
        this.data.Id,
        this.params.constructionapprove
      );
    }
  }
  /** 提交维修完成或维修未完成 */
  submit() {
    if (this.data) {
      this.business.submit(this.data.Id, this.params.submit);
    }
  }
}
