import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MaintenanceProfilesLanguageTools } from 'src/app/garbage-profiles/tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from 'src/app/garbage-profiles/tools/maintenance-profile-source.tool';
import { MaintenanceProfile } from 'src/app/network/entity/maintenance-profile.entity';
import { ConstructionApproveParams } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfileForm4Business } from './maintenance-profile-form4.business';

@Component({
  selector: 'maintenance-profile-form4',
  templateUrl: './maintenance-profile-form4.component.html',
  styleUrls: ['./maintenance-profile-form4.component.less'],
  providers: [MaintenanceProfileForm4Business],
})
export class MaintenanceProfileForm4Component implements OnInit {
  @Input() formId = '';

  @Input()
  params: ConstructionApproveParams = new ConstructionApproveParams();

  @Output()
  paramsChange = new EventEmitter();
  get disabled() {
    return this.stepIndex < this.profileState;
  }
  profileState = 0;
  stepIndex = 1;
  model?: MaintenanceProfile;
  constructor(
    public sourceTool: MaintenanceProfilesSourceTools,
    public languageTool: MaintenanceProfilesLanguageTools,
    private _business: MaintenanceProfileForm4Business
  ) {}
  ngOnInit(): void {
    this._init();
  }
  private async _init() {
    if (this.formId) {
      this.model = await this._business.getMaintenanceModel(this.formId);
      console.log('model', this.model);
      this.profileState = this.model.ProfileState;

      this.params.ConstructionApprovalReason =
        this.model.ConstructionApprovalReason;
      this.params.ApproveOrNot = !this.model.ConstructionApprovalReason;

      if (this.model.MaintenanceDeadline) {
        this.params.MaintenanceDeadline = this.model.MaintenanceDeadline;
      }
    }
  }
}
