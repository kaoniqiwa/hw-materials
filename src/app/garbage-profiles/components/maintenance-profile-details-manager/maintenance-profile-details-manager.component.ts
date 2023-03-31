import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { MaintenanceProfile } from 'src/app/network/entity/maintenance-profile.entity';
import { User } from 'src/app/network/entity/user.model';
import { MaintenanceProfilesLanguageTools } from '../../tools/maintenance-profile-language.too';
import { MaintenanceProfileDetailsManagerBusiness } from './maintenance-profile-details-manager.business';
import { MaintenanceProfileDetailsManagerParams } from './maintenance-profile-details-manager.model';

@Component({
  selector: 'maintenance-profile-details-manager',
  templateUrl: './maintenance-profile-details-manager.component.html',
  styleUrls: ['./maintenance-profile-details-manager.component.less'],
  providers: [MaintenanceProfileDetailsManagerBusiness],
})
export class MaintenanceProfileDetailsManagerComponent implements OnInit {
  @Input()
  profileId?: string;
  @Output()
  pictures: EventEmitter<string[]> = new EventEmitter();

  @Output()
  ok: EventEmitter<void> = new EventEmitter();
  @Output()
  cancel: EventEmitter<void> = new EventEmitter();
  @Output()
  construction: EventEmitter<MaintenanceProfile> = new EventEmitter();

  constructor(
    private business: MaintenanceProfileDetailsManagerBusiness,
    public language: MaintenanceProfilesLanguageTools,
    local: LocalStorageService
  ) {
    this.user = local.user;
  }

  debug = false;

  user: User;
  data?: MaintenanceProfile;
  params = new MaintenanceProfileDetailsManagerParams();

  ngOnInit(): void {
    if (this.profileId) {
      this.business.load(this.profileId).then((data) => {
        this.data = data;
      });
    }
  }

  onpictures(urls?: string[]) {
    if (urls) {
      this.pictures.emit(urls);
    }
  }
}
