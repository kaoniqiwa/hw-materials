import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MaintenanceProfilesLanguageTools } from 'src/app/garbage-profiles/tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from 'src/app/garbage-profiles/tools/maintenance-profile-source.tool';
import { MaintenanceProfileBaseFormDirective } from '../maintenance-profile-base-form/maintenance-profile-base-form.component';
import { MaintenanceProfileForm5Business } from './maintenance-profile-form4.business';

@Component({
  selector: 'maintenance-profile-form5',
  templateUrl: './maintenance-profile-form5.component.html',
  styleUrls: ['./maintenance-profile-form5.component.less'],
  providers: [MaintenanceProfileForm5Business],
})
export class MaintenanceProfileForm5Component
  extends MaintenanceProfileBaseFormDirective
  implements OnInit
{
  override formGroup: FormGroup<any> = new FormGroup({
    ProfileType: new FormControl(1),
    MaintenanceType: new FormControl(1),
    MaintenanceDescription: new FormControl(),
    FaultDate: new FormControl(),
  });
  constructor(
    protected override _business: MaintenanceProfileForm5Business,
    protected override _toastrService: ToastrService,
    protected override sourceTool: MaintenanceProfilesSourceTools,
    protected override languageTool: MaintenanceProfilesLanguageTools
  ) {
    super(_business, _toastrService, sourceTool, languageTool);
  }
  ngOnInit(): void {}
}
