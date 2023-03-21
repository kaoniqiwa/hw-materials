import { Component, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MaintenanceProfilesLanguageTools } from '../../tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from '../../tools/maintenance-profile-source.tool';
import { MaintenanceProfileTableArgs } from '../tables/maintenance-profile-table/maintenance-profile-table.model';

@Component({
  selector: 'maintenance-profile-manager',
  templateUrl: './maintenance-profile-manager.component.html',
  styleUrls: ['./maintenance-profile-manager.component.less'],
})
export class MaintenanceProfileManagerComponent {
  constructor(
    public source: MaintenanceProfilesSourceTools,
    public language: MaintenanceProfilesLanguageTools,

    private toastr: ToastrService
  ) {}

  args: MaintenanceProfileTableArgs = new MaintenanceProfileTableArgs();
  load: EventEmitter<MaintenanceProfileTableArgs> = new EventEmitter();
}
