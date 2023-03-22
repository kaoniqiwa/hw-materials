import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MaintenanceProfilesLanguageTools } from 'src/app/garbage-profiles/tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from 'src/app/garbage-profiles/tools/maintenance-profile-source.tool';
import { MaintenanceProfileBaseFormDirective } from '../maintenance-profile-base-form/maintenance-profile-base-form.component';
import { MaintenanceProfileForm2Business } from './maintenance-profile-form2.business';

@Component({
  selector: 'maintenance-profile-form2',
  templateUrl: './maintenance-profile-form2.component.html',
  styleUrls: ['./maintenance-profile-form2.component.less'],
  providers: [MaintenanceProfileForm2Business],
})
export class MaintenanceProfileForm2Component
  extends MaintenanceProfileBaseFormDirective
  implements OnInit
{
  override formGroup: FormGroup<any> = new FormGroup({
    MaintenancePersonnel: new FormControl(),
    MaintenanceDeadline: new FormControl(),
  });
  constructor(
    protected override _business: MaintenanceProfileForm2Business,
    protected override _toastrService: ToastrService,
    protected override sourceTool: MaintenanceProfilesSourceTools,
    protected override languageTool: MaintenanceProfilesLanguageTools
  ) {
    super(_business, _toastrService, sourceTool, languageTool);
  }
  ngOnInit(): void {}
}
