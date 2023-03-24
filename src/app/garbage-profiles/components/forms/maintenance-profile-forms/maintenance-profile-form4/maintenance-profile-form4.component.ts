import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MaintenanceProfilesLanguageTools } from 'src/app/garbage-profiles/tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from 'src/app/garbage-profiles/tools/maintenance-profile-source.tool';
import { MaintenanceProfileForm4Business } from './maintenance-profile-form4.business';

@Component({
  selector: 'maintenance-profile-form4',
  templateUrl: './maintenance-profile-form4.component.html',
  styleUrls: ['./maintenance-profile-form4.component.less'],
  providers: [MaintenanceProfileForm4Business],
})
export class MaintenanceProfileForm4Component implements OnInit {
  @Input() formId = '';

  ngOnInit(): void {}
}
