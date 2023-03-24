import { Component, Input, OnInit } from '@angular/core';
import { DateTimePickerView } from 'src/app/common/directives/date-time-picker/date-time-picker.directive';
import { MaintenanceProfilesLanguageTools } from 'src/app/garbage-profiles/tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from 'src/app/garbage-profiles/tools/maintenance-profile-source.tool';
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

  constructor(
    public sourceTool: MaintenanceProfilesSourceTools,
    public languageTool: MaintenanceProfilesLanguageTools,
    private _business: MaintenanceProfileForm2Business
  ) {}
  ngOnInit(): void {}
}
