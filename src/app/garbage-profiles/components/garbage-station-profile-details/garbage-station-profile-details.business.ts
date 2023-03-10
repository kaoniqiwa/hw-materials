import { Injectable } from '@angular/core';
import { Division } from 'src/app/network/entity/division.entity';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { IPartialData } from 'src/app/network/entity/partial-data.interface';
import { GetGarbageProfilesBasicDivisionsParams } from 'src/app/network/request/garbage-profiles/basics/garbage-profiles-basics.params';
import { GarbageProfilesBasicRequestService } from 'src/app/network/request/garbage-profiles/basics/garbage-profiles-basics.service';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { PutOutMaterialsParams } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';
import { GarbageProfilesMaterialRequestService } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.service';
import { ProfileDetailsDivisionSearchInfo } from './garbage-station-profile-details.model';

const NULL_KEY = 'null';

@Injectable()
export class GarbageStationProfileDetailsBusiness {
  private _selectMap: Map<string, Division[]> = new Map();

  private _divisionMap: Map<string, Division> = new Map();

  constructor(
    private _garbageStationProfilesRequest: GarbageStationProfilesRequestService,
    private _garbageProfilesBasicRequest: GarbageProfilesBasicRequestService,
    private _GarbageProfilesMaterialRequest: GarbageProfilesMaterialRequestService
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

  putout(params: PutOutMaterialsParams) {
    return this._GarbageProfilesMaterialRequest.putout(params);
  }
  /**
   * 本地保存数据
   * @param searchInfo
   */
  async getDivisionList(searchInfo: ProfileDetailsDivisionSearchInfo) {
    let res: Division[] = [];

    let key: string = '';
    if (searchInfo.ParentIdIsNull) {
      key = NULL_KEY;
    } else {
      key = searchInfo.ParentId ?? '';
    }
    if (this._selectMap.has(key)) {
      res = this._selectMap.get(key)!;
    } else {
      let { Data } = await this._getDivisionList(searchInfo);

      this._selectMap.set(key, Data);
      Data.forEach((division) => this._divisionMap.set(division.Id, division));

      res = Data;
    }
    return res;
  }

  getDivision(name: string) {
    for (let [key, value] of this._divisionMap.entries()) {
      // console.log(key, value);
      if (value.Name === name) {
        // console.log(name + '的id: ' + key);

        return key;
      }
    }
    return void 0;
  }
  // 仅负责请求数据
  private _getDivisionList(searchInfo: ProfileDetailsDivisionSearchInfo) {
    let params = new GetGarbageProfilesBasicDivisionsParams();
    if (searchInfo.ParentId) params.ParentId = searchInfo.ParentId;
    if (searchInfo.Name) params.Name = searchInfo.Name;
    if (searchInfo.ParentIdIsNull)
      params.ParentIdIsNull = searchInfo.ParentIdIsNull;

    return this._garbageProfilesBasicRequest.division.list(params);
  }
}
