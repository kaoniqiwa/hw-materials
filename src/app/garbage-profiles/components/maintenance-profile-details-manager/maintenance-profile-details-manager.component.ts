import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { MaintenanceProfile } from 'src/app/network/entity/maintenance-profile.entity';
import { StatePartialData } from 'src/app/network/entity/partial-data.interface';
import { User } from 'src/app/network/entity/user.model';
import { CreateMaintenanceProfileParams } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfilesLanguageTools } from '../../tools/maintenance-profile-language.too';
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

  @Output()
  ok: EventEmitter<void> = new EventEmitter();
  @Output()
  cancel: EventEmitter<void> = new EventEmitter();

  constructor(
    private business: MaintenanceProfileDetailsManagerBusiness,
    private toastr: ToastrService,
    private language: MaintenanceProfilesLanguageTools,
    local: LocalStorageService
  ) {
    this.user = local.user;
  }

  user: User;
  profile?: MaintenanceProfile;
  params = new MaintenanceProfileDetailsManagerParams();

  ngOnInit(): void {
    console.log(this.user);
    // if (this.data) {
    //   this.business.load(this.data.Id, this.data.ProfileState).then((data) => {
    //     this.profile = data;

    //     console.log(this.profile);
    //   });
    // }
  }

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
      // if (!params.FaultDate) {
      //   this.toastr.warning(`请输入${this.language['FaultDate']}`);
      //   return false;
      // }
    }
    return true;
  }

  /** 创建工单 */
  create(params: CreateMaintenanceProfileParams) {
    if (this.validate(params)) {
      this.business
        .create(params)
        .then((x) => {
          this.toastr.success('工单创建成功');
          this.ok.emit();
        })
        .catch((x) => {
          this.toastr.error('工单创建失败');
          console.error(x.error);
        });
    }
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
  complate() {
    if (this.data) {
      this.business.submit(this.data.Id, this.params.submit);
    }
  }

  submit(state?: number) {
    if (this.data) {
      switch (state) {
        case 1:
          this.business.distribute(this.data.Id, this.params.distribute);
          break;
        case 2:
          this.business.constructionapply(
            this.data.Id,
            this.params.constructionapply
          );
          break;
        case 3:
          this.business.constructionapply(
            this.data.Id,
            this.params.constructionapply
          );
          break;
        case 4:
          this.business.submit(this.data.Id, this.params.submit);
          break;
        default:
          break;
      }
    }
  }
}
