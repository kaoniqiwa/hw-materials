import { Component, Input, OnInit } from '@angular/core';
import { DateTimePickerView } from 'src/app/common/directives/date-time-picker/date-time-picker.directive';
import { UserType } from 'src/app/enum/user-type.enum';
import { MaintenanceProfilesLanguageTools } from 'src/app/garbage-profiles/tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from 'src/app/garbage-profiles/tools/maintenance-profile-source.tool';
import { Contract } from 'src/app/network/entity/contact.entity';
import { MaintenanceProfile } from 'src/app/network/entity/maintenance-profile.entity';
import { DistributeMaintenanceProfileParams } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfileForm2Business } from './maintenance-profile-form2.business';

@Component({
  selector: 'maintenance-profile-form2',
  templateUrl: './maintenance-profile-form2.component.html',
  styleUrls: ['./maintenance-profile-form2.component.less'],
  providers: [MaintenanceProfileForm2Business],
})
export class MaintenanceProfileForm2Component implements OnInit {
  DateTimePickerView = DateTimePickerView;

  @Input() formId = '';

  @Input() params: DistributeMaintenanceProfileParams =
    new DistributeMaintenanceProfileParams();

  get disabled() {
    return this.stepIndex < this.profileState;
  }

  profileState = 0;
  stepIndex = 1;
  model?: MaintenanceProfile;

  contracts: Contract[] = [];

  constructor(
    public sourceTool: MaintenanceProfilesSourceTools,
    public languageTool: MaintenanceProfilesLanguageTools,
    private _business: MaintenanceProfileForm2Business
  ) {}
  ngOnInit(): void {
    this._init();
  }
  private async _init() {
    let contracts = await this._business.listContracts();
    console.log(contracts);
    this.contracts = contracts.filter(
      (contract) =>
        contract.UserType == UserType.maintenance_admin ||
        contract.UserType == UserType.maintenance
    );
    if (this.formId) {
      this.model = await this._business.getMaintenanceModel(this.formId);
      console.log('model', this.model);
      this.profileState = this.model.ProfileState;
      this.params.MaintenanceUserId = this.model.MaintenanceUserId
        ? this.model.MaintenanceUserId
        : this.contracts.length
        ? this.contracts[0].Id
        : '';
      if (this.model.MaintenanceDeadline)
        this.params.MaintenanceDeadline = this.model.MaintenanceDeadline;
    }
  }
}
