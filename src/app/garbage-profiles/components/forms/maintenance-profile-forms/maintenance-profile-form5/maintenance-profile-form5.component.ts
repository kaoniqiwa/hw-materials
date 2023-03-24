import { Component, Input, OnInit } from '@angular/core';
import { MaintenanceProfileForm5Business } from './maintenance-profile-form4.business';

@Component({
  selector: 'maintenance-profile-form5',
  templateUrl: './maintenance-profile-form5.component.html',
  styleUrls: ['./maintenance-profile-form5.component.less'],
  providers: [MaintenanceProfileForm5Business],
})
export class MaintenanceProfileForm5Component implements OnInit {
  @Input() formId = '';

  ngOnInit(): void {}
}
