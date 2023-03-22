import { Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MaintenanceProfilesLanguageTools } from 'src/app/garbage-profiles/tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from 'src/app/garbage-profiles/tools/maintenance-profile-source.tool';
import { MaintenanceProfileBaseFormBusiness } from './maintenance-profile-base-form.business';

@Directive({
  selector: 'maintenance-profile-base-form',
})
export class MaintenanceProfileBaseFormDirective {
  protected formGroup: FormGroup = new FormGroup({});

  constructor(
    protected _business: MaintenanceProfileBaseFormBusiness,
    protected _toastrService: ToastrService,
    protected sourceTool: MaintenanceProfilesSourceTools,
    protected languageTool: MaintenanceProfilesLanguageTools
  ) {}
}
