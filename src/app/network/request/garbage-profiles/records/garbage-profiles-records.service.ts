import { Injectable } from '@angular/core';
import { MaterialRecord } from 'src/app/network/entity/material-record.entity';
import { ModificationRecord } from 'src/app/network/entity/modification-record.entity';
import { GarbageProfilesRecordsUrl } from 'src/app/network/url/garbage_profiles/records/records.url';
import {
  BaseRequestService,
  BaseTypeRequestService,
} from '../../base-request.service';
import { HowellAuthHttpService } from '../../howell-auth-http.service';
import {
  GetMaterialRecordsParams,
  GetModificationRecordsParams,
} from './garbage-profiles-records.param';

@Injectable({
  providedIn: 'root',
})
export class GarbageProfilesRecordRequestService {
  private basic: BaseRequestService;
  constructor(_http: HowellAuthHttpService) {
    this.basic = new BaseRequestService(_http);
  }

  private _modification?: GarbageProfilesModificationRecordsRequestService;
  public get modification(): GarbageProfilesModificationRecordsRequestService {
    if (!this._modification) {
      this._modification = new GarbageProfilesModificationRecordsRequestService(
        this.basic
      );
    }
    return this._modification;
  }

  private _material?: GarbageProfilesMaterialRecordsRequestService;
  public get material(): GarbageProfilesMaterialRecordsRequestService {
    if (!this._material) {
      this._material = new GarbageProfilesMaterialRecordsRequestService(
        this.basic
      );
    }
    return this._material;
  }
}

class GarbageProfilesModificationRecordsRequestService {
  private type: BaseTypeRequestService<ModificationRecord>;

  constructor(private basic: BaseRequestService) {
    this.type = this.basic.type(ModificationRecord);
  }

  list(
    params: GetModificationRecordsParams = new GetModificationRecordsParams()
  ) {
    let url = GarbageProfilesRecordsUrl.modification.list();
    return this.type.paged(url, params);
  }
}

class GarbageProfilesMaterialRecordsRequestService {
  private type: BaseTypeRequestService<MaterialRecord>;

  constructor(private basic: BaseRequestService) {
    this.type = this.basic.type(MaterialRecord);
  }

  list(params: GetMaterialRecordsParams = new GetMaterialRecordsParams()) {
    let url = GarbageProfilesRecordsUrl.material.list();
    return this.type.paged(url, params);
  }
}
