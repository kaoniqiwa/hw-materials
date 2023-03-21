import { Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { UserConfigType } from 'src/app/enum/user-config-type.enum';
import { UserRequestService } from 'src/app/network/request/user/user-request.service';
import { MaintenanceProfileTableDefaultNames } from './maintenance-profile-table.model';

@Injectable()
export class MaintenanceProfileTableConfigBusiness {
  constructor(
    private config: UserRequestService,
    private local: LocalStorageService
  ) {}

  async get(ids?: string[]) {
    if (!ids) {
      ids = (await this.config.config.get(
        this.local.user.Id,
        UserConfigType.MaintenanceProfileProperty
      )) as string[];
    }
    if (!ids || ids.length === 0) {
      ids = MaintenanceProfileTableDefaultNames;
    }

    return ids;
  }
}
