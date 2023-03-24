import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MaintenanceProfilesLanguageTools } from 'src/app/garbage-profiles/tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from 'src/app/garbage-profiles/tools/maintenance-profile-source.tool';
import { MaintenanceProfileReactiveFormDirective } from '../maintenance-profile-reactive-form/maintenance-profile-reactive-form.component';
import { MaintenanceProfileReactiveForm3Business } from './maintenance-profile-reactive-form3.business';

@Component({
  selector: 'maintenance-profile-reactive-form3',
  templateUrl: './maintenance-profile-reactive-form3.component.html',
  styleUrls: ['./maintenance-profile-reactive-form3.component.less'],
  providers: [MaintenanceProfileReactiveForm3Business],
})
export class MaintenanceProfileReactiveForm3Component
  extends MaintenanceProfileReactiveFormDirective
  implements OnInit
{
  override formGroup: FormGroup<any> = new FormGroup({
    FaultType: new FormControl(1),
    FaultDescription: new FormControl(1),
    MaintenanceTime: new FormControl(),
    SceneImageUrls: new FormControl(),
  });
  constructor(
    protected override _business: MaintenanceProfileReactiveForm3Business,
    protected override _toastrService: ToastrService,
    protected override sourceTool: MaintenanceProfilesSourceTools,
    protected override languageTool: MaintenanceProfilesLanguageTools
  ) {
    super(_business, _toastrService, sourceTool, languageTool);
  }
  ngOnInit(): void {}
}
