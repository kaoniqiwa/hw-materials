import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MaintenanceProfilesLanguageTools } from 'src/app/garbage-profiles/tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from 'src/app/garbage-profiles/tools/maintenance-profile-source.tool';
import { MaintenanceProfileBaseFormDirective } from '../maintenance-profile-base-form/maintenance-profile-base-form.component';
import { MaintenanceProfileForm3Business } from './maintenance-profile-form3.business';

@Component({
  selector: 'maintenance-profile-form3',
  templateUrl: './maintenance-profile-form3.component.html',
  styleUrls: ['./maintenance-profile-form3.component.less'],
  providers: [MaintenanceProfileForm3Business],
})
export class MaintenanceProfileForm3Component
  extends MaintenanceProfileBaseFormDirective
  implements OnInit
{
  override formGroup: FormGroup<any> = new FormGroup({
    FaultType: new FormControl(1),
    FaultDescription: new FormControl(1),
    MaintenanceTime: new FormControl(),
    SceneImageUrls: new FormControl(),
  });
  constructor(
    protected override _business: MaintenanceProfileForm3Business,
    protected override _toastrService: ToastrService,
    protected override sourceTool: MaintenanceProfilesSourceTools,
    protected override languageTool: MaintenanceProfilesLanguageTools
  ) {
    super(_business, _toastrService, sourceTool, languageTool);
  }
  ngOnInit(): void {}
}
