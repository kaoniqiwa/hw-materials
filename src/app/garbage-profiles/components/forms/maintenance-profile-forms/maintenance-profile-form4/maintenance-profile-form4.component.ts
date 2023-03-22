import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MaintenanceProfilesLanguageTools } from 'src/app/garbage-profiles/tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from 'src/app/garbage-profiles/tools/maintenance-profile-source.tool';
import { MaintenanceProfileBaseFormDirective } from '../maintenance-profile-base-form/maintenance-profile-base-form.component';
import { MaintenanceProfileForm4Business } from './maintenance-profile-form4.business';

@Component({
  selector: 'maintenance-profile-form4',
  templateUrl: './maintenance-profile-form4.component.html',
  styleUrls: ['./maintenance-profile-form4.component.less'],
  providers: [MaintenanceProfileForm4Business],
})
export class MaintenanceProfileForm4Component
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
    protected override _business: MaintenanceProfileForm4Business,
    protected override _toastrService: ToastrService,
    protected override sourceTool: MaintenanceProfilesSourceTools,
    protected override languageTool: MaintenanceProfilesLanguageTools
  ) {
    super(_business, _toastrService, sourceTool, languageTool);
  }
  ngOnInit(): void {}
}
