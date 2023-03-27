import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MaintenanceProfilesLanguageTools } from 'src/app/garbage-profiles/tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from 'src/app/garbage-profiles/tools/maintenance-profile-source.tool';
import { MaintenanceProfile } from 'src/app/network/entity/maintenance-profile.entity';
import {
  ConstructionApplyParams,
  SubmitMaintenanceProfileParams,
} from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfileForm3Business } from './maintenance-profile-form3.business';

@Component({
  selector: 'maintenance-profile-form3',
  templateUrl: './maintenance-profile-form3.component.html',
  styleUrls: ['./maintenance-profile-form3.component.less'],
  providers: [MaintenanceProfileForm3Business],
})
export class MaintenanceProfileForm3Component implements OnInit {
  profileState = 0;
  stepIndex = 2;

  @Input() formId = '';

  @Input()
  params: ConstructionApplyParams = new ConstructionApplyParams();

  @Output()
  paramsChange = new EventEmitter();

  private _disabled = this.stepIndex < this.profileState;
  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(val: boolean) {
    this._disabled = val;
  }

  model?: MaintenanceProfile;

  constructor(
    public sourceTool: MaintenanceProfilesSourceTools,
    public languageTool: MaintenanceProfilesLanguageTools,
    private _business: MaintenanceProfileForm3Business
  ) {}
  ngOnInit(): void {
    this._init();
  }
  private async _init() {
    if (this.formId) {
      this.model = await this._business.getMaintenanceModel(this.formId);
      console.log('model', this.model);
      this.profileState = this.model.ProfileState;
      this.params.ConstructionReason = this.model.MaintenanceUserId ?? '';
    }
  }
}
