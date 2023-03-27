import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MaintenanceProfilesLanguageTools } from 'src/app/garbage-profiles/tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from 'src/app/garbage-profiles/tools/maintenance-profile-source.tool';
import { MaintenanceProfile } from 'src/app/network/entity/maintenance-profile.entity';
import { SubmitMaintenanceProfileParams } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfileForm3Business } from '../maintenance-profile-form3/maintenance-profile-form3.business';
import { MaintenanceProfileForm5Business } from './maintenance-profile-form5.business';

@Component({
  selector: 'maintenance-profile-form5',
  templateUrl: './maintenance-profile-form5.component.html',
  styleUrls: ['./maintenance-profile-form5.component.less'],
  providers: [MaintenanceProfileForm5Business],
})
export class MaintenanceProfileForm5Component implements OnInit {
  @Input() formId = '';

  @Input()
  params: SubmitMaintenanceProfileParams = new SubmitMaintenanceProfileParams();

  @Output()
  paramsChange = new EventEmitter();
  get disabled() {
    return this.stepIndex < this.profileState;
  }
  profileState = 0;
  stepIndex = 4;
  model?: MaintenanceProfile;
  showPutout = false;

  constructor(
    public sourceTool: MaintenanceProfilesSourceTools,
    public languageTool: MaintenanceProfilesLanguageTools,
    private _business: MaintenanceProfileForm5Business
  ) {}
  ngOnInit(): void {
    this._init();
    console.log(this.sourceTool['FaultType']);
  }
  private async _init() {
    if (this.formId) {
      this.model = await this._business.getMaintenanceModel(this.formId);
      console.log('model', this.model);
      this.profileState = this.model.ProfileState;

      this.params.Repaired = !!this.model.FaultType;
      this.params.FaultType = this.model.FaultType;
      this.params.FaultDescription = this.model.FaultDescription;
      this.params.MaterialItems = this.model.MaterialItems;
      this.params.SceneImageUrls = this.model.SceneImageUrls ?? [];
    }
  }
  changeRepaired() {
    if (!this.params.Repaired) {
      this.params.FaultType = void 0;
      this.params.FaultDescription = void 0;
    }
  }
  uploadImage(id: string) {
    // this.params.SceneImageUrls.push(id);
    console.log(id);
  }
}
