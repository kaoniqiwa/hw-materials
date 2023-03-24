import { Component, Input, OnInit } from '@angular/core';
import { MaintenanceProfilesLanguageTools } from 'src/app/garbage-profiles/tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from 'src/app/garbage-profiles/tools/maintenance-profile-source.tool';
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
  constructor(
    public sourceTool: MaintenanceProfilesSourceTools,
    public languageTool: MaintenanceProfilesLanguageTools,
    private _business: MaintenanceProfileForm5Business
  ) {}
  ngOnInit(): void {}
}
