import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MaintenanceProfilesLanguageTools } from 'src/app/garbage-profiles/tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from 'src/app/garbage-profiles/tools/maintenance-profile-source.tool';
import { SubmitMaintenanceProfileParams } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfileForm3Business } from './maintenance-profile-form3.business';

@Component({
  selector: 'maintenance-profile-form3',
  templateUrl: './maintenance-profile-form3.component.html',
  styleUrls: ['./maintenance-profile-form3.component.less'],
  providers: [MaintenanceProfileForm3Business],
})
export class MaintenanceProfileForm3Component implements OnInit {
  @Input() formId = '';

  @Input()
  params: SubmitMaintenanceProfileParams = new SubmitMaintenanceProfileParams();
  constructor(
    public sourceTool: MaintenanceProfilesSourceTools,
    public languageTool: MaintenanceProfilesLanguageTools,
    private _business: MaintenanceProfileForm3Business
  ) {}
  ngOnInit(): void {}
}
