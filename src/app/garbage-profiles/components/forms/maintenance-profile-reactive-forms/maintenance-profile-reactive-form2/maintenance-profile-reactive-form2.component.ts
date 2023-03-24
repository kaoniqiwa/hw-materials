import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MaintenanceProfilesLanguageTools } from 'src/app/garbage-profiles/tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from 'src/app/garbage-profiles/tools/maintenance-profile-source.tool';
import { MaintenanceProfileReactiveFormDirective } from '../maintenance-profile-reactive-form/maintenance-profile-reactive-form.component';
import { MaintenanceProfileReactiveForm2Business } from './maintenance-profile-reactive-form2.business';

@Component({
  selector: 'maintenance-profile-reactive-form2',
  templateUrl: './maintenance-profile-reactive-form2.component.html',
  styleUrls: ['./maintenance-profile-reactive-form2.component.less'],
  providers: [MaintenanceProfileReactiveForm2Business],
})
export class MaintenanceProfileReactiveForm2Component
  extends MaintenanceProfileReactiveFormDirective
  implements OnInit
{
  override formGroup: FormGroup<any> = new FormGroup({
    MaintenancePersonnel: new FormControl(),
    MaintenanceDeadline: new FormControl(),
  });
  constructor(
    protected override _business: MaintenanceProfileReactiveForm2Business,
    protected override _toastrService: ToastrService,
    protected override sourceTool: MaintenanceProfilesSourceTools,
    protected override languageTool: MaintenanceProfilesLanguageTools
  ) {
    super(_business, _toastrService, sourceTool, languageTool);
  }
  ngOnInit(): void {}
}
