import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MaintenanceProfilesLanguageTools } from 'src/app/garbage-profiles/tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from 'src/app/garbage-profiles/tools/maintenance-profile-source.tool';
import { MaintenanceProfileReactiveFormDirective } from '../maintenance-profile-reactive-form/maintenance-profile-reactive-form.component';
import { MaintenanceProfileReactiveForm5Business } from './maintenance-profile-reactive-form5.business';

@Component({
  selector: 'maintenance-profile-reactive-form5',
  templateUrl: './maintenance-profile-reactive-form5.component.html',
  styleUrls: ['./maintenance-profile-reactive-form5.component.less'],
  providers: [MaintenanceProfileReactiveForm5Business],
})
export class MaintenanceProfileReactiveForm5Component
  extends MaintenanceProfileReactiveFormDirective
  implements OnInit
{
  override formGroup: FormGroup<any> = new FormGroup({
    ProfileType: new FormControl(1),
    MaintenanceType: new FormControl(1),
    MaintenanceDescription: new FormControl(),
    FaultDate: new FormControl(),
  });
  constructor(
    protected override _business: MaintenanceProfileReactiveForm5Business,
    protected override _toastrService: ToastrService,
    protected override sourceTool: MaintenanceProfilesSourceTools,
    protected override languageTool: MaintenanceProfilesLanguageTools
  ) {
    super(_business, _toastrService, sourceTool, languageTool);
  }
  ngOnInit(): void {}
}
