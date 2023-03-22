import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MaintenanceProfilesLanguageTools } from 'src/app/garbage-profiles/tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from 'src/app/garbage-profiles/tools/maintenance-profile-source.tool';
import { MaintenanceProfileBaseFormDirective } from '../maintenance-profile-base-form/maintenance-profile-base-form.component';
import { MaintenanceProfileForm1Business } from './maintenance-profile-form1.business';

@Component({
  selector: 'maintenance-profile-form1',
  templateUrl: './maintenance-profile-form1.component.html',
  styleUrls: ['./maintenance-profile-form1.component.less'],
  providers: [MaintenanceProfileForm1Business],
})
export class MaintenanceProfileForm1Component
  extends MaintenanceProfileBaseFormDirective
  implements OnInit
{
  override formGroup: FormGroup<any> = new FormGroup({
    ProfileType: new FormControl(1),
    MaintenanceType: new FormControl(1),
    MaintenanceDescription: new FormControl(),
    FaultDate: new FormControl(),
    Customer: new FormControl(),
    CustomerPhoneNo: new FormControl(),
  });

  constructor(
    protected override _business: MaintenanceProfileForm1Business,
    protected override _toastrService: ToastrService,
    protected override sourceTool: MaintenanceProfilesSourceTools,
    protected override languageTool: MaintenanceProfilesLanguageTools
  ) {
    super(_business, _toastrService, sourceTool, languageTool);
  }
  ngOnInit(): void {
    console.log(this.sourceTool['ProfileType']);
  }
}
