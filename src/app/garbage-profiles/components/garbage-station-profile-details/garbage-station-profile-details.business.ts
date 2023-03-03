import { Injectable } from '@angular/core';
import { Division } from 'src/app/network/entity/division.entity';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { GetGarbageProfilesBasicDivisionsParams } from 'src/app/network/request/garbage-profiles/basics/garbage-profiles-basics.params';
import { GarbageProfilesBasicRequestService } from 'src/app/network/request/garbage-profiles/basics/garbage-profiles-basics.service';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { ProfileDetailsDivisionSearchInfo } from './garbage-station-profile-details.model';

const NULL_KEY = 'null';

@Injectable()
export class GarbageStationProfileDetailsBusiness {
  private _divisionMap: Map<string, Division[]> = new Map();

  constructor(
    private _garbageStationProfilesRequest: GarbageStationProfilesRequestService,
    private _garbageProfilesBasicRequest: GarbageProfilesBasicRequestService
  ) {}
  getModel(id: string) {
    return this._garbageStationProfilesRequest.get(id);
  }
  createModel(model: GarbageStationProfile) {
    return this._garbageStationProfilesRequest.create(model);
  }
  updateModel(model: GarbageStationProfile) {
    return this._garbageStationProfilesRequest.update(model);
  }

  /**
   * 本地保存数据
   * @param searchInfo
   */
  async getDivision(searchInfo: ProfileDetailsDivisionSearchInfo) {
    let res: Division[] = [];

    let key: string = '';
    if (searchInfo.ParentIdIsNull) {
      key = NULL_KEY;
    } else {
      key = searchInfo.ParentId ?? '';
    }
    if (this._divisionMap.has(key)) {
      res = this._divisionMap.get(key)!;
    } else {
      let { Data } = await this._getDivision(searchInfo);

      this._divisionMap.set(key, Data);

      res = Data;
    }
    return res;
  }

  // 仅负责请求数据
  private _getDivision(searchInfo: ProfileDetailsDivisionSearchInfo) {
    let params = new GetGarbageProfilesBasicDivisionsParams();
    if (searchInfo.ParentId) params.ParentId = searchInfo.ParentId;
    if (searchInfo.Name) params.Name = searchInfo.Name;
    if (searchInfo.ParentIdIsNull)
      params.ParentIdIsNull = searchInfo.ParentIdIsNull;

    return this._garbageProfilesBasicRequest.division.list(params);
  }
}
