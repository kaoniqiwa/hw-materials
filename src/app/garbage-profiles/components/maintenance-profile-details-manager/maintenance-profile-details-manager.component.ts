import { Component, Input, OnInit } from '@angular/core';
import { FormState } from 'src/app/enum/form-state.enum';

@Component({
  selector: 'maintenance-profile-details-manager',
  templateUrl: './maintenance-profile-details-manager.component.html',
  styleUrls: ['./maintenance-profile-details-manager.component.less'],
})
export class MaintenanceProfileDetailsManagerComponent implements OnInit {
  @Input() formId?: string;

  @Input() formState = FormState.none;

  constructor() {}
  ngOnInit(): void {
    console.log(this.formId);
  }
}
