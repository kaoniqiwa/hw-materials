import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EnumHelper } from 'src/app/enum/enum-helper';
import { Division } from 'src/app/network/entity/division.entity';
import { GetGarbageProfilesBasicDivisionsParams } from 'src/app/network/request/garbage-profiles/basics/garbage-profiles-basics.params';
import { GarbageProfilesBasicRequestService } from 'src/app/network/request/garbage-profiles/basics/garbage-profiles-basics.service';
import { DivisionLevel } from '../../../../../enum/division-level.enum';
import { DivisionInfo, DivisionSearchInfo, NULL_KEY } from './division.model';

@Injectable({
  providedIn: 'root',
})
export class DivisionUtil {
  private _selectMap: Map<string | null, Division[]> = new Map();
  private _divisionMap: Map<string, Division> = new Map();
  private _divisionSearchInfo: DivisionSearchInfo = {};
  private _divisionInfo: DivisionInfo = new DivisionInfo();
  behaviorSubject = new BehaviorSubject(this._divisionInfo);

  constructor(
    private _garbageProfilesBasicRequest: GarbageProfilesBasicRequestService
  ) {}

  async getChildDivisionListByName(divisionSource: Map<DivisionLevel, string>) {
    this._divisionInfo = new DivisionInfo();
    let parentId: string | undefined = void 0;

    for (let [level, value] of divisionSource.entries()) {
      let id = this._getDivisionIdByName(value, parentId);
      parentId = id;

      let res = await this._getChildDivisionListById(level, id);

      // console.log('key', level, res);

      let childLevel = EnumHelper.getDivisionChildLevel(level);

      if (childLevel && res) {
        this._divisionInfo[DivisionLevel[childLevel] as keyof DivisionInfo] =
          res;
      }
    }
    this.behaviorSubject.next(this._divisionInfo);

    return;
  }
  private async _getChildDivisionListById(
    level: DivisionLevel = DivisionLevel.None,
    ParentId?: string
  ) {
    if (level == DivisionLevel.None) {
      this._divisionSearchInfo = {
        ParentIdIsNull: true,
      };
    } else {
      if (!ParentId || !EnumHelper.getDivisionChildLevel(level)) return null;

      this._divisionSearchInfo = {
        ParentId,
      };
    }

    return this._getDivisionList(this._divisionSearchInfo);
  }
  /**
   *  根据区划名称寻找区划ID
   * @param name
   * @returns
   */
  private _getDivisionIdByName(name: string, parentId?: string) {
    for (let [key, value] of this._divisionMap.entries()) {
      // 比如市辖区有多个，需要parentId约束
      if (value.Name == name && value.ParentId == parentId) {
        return key;
      }
    }
    return void 0;
  }
  /**
   * 本地保存数据
   * @param searchInfo
   */
  private async _getDivisionList(searchInfo: DivisionSearchInfo) {
    let res: Division[] = [];

    let key: string | null = NULL_KEY;
    if (searchInfo.ParentIdIsNull) {
      key = NULL_KEY;
    } else {
      key = searchInfo.ParentId ?? '';
    }
    if (this._selectMap.has(key)) {
      res = this._selectMap.get(key)!;
    } else {
      let { Data } = await this._divisionList(searchInfo);

      // 本地缓存数据
      this._selectMap.set(key, Data);
      Data.forEach((division) => this._divisionMap.set(division.Id, division));

      res = Data;
    }
    return res;
  }
  /**
   *  拉取后台信息
   * @param searchInfo
   * @returns Promise<PagedList<Division>>
   */
  private _divisionList(searchInfo: DivisionSearchInfo) {
    let params = new GetGarbageProfilesBasicDivisionsParams();
    if (searchInfo.ParentId) params.ParentId = searchInfo.ParentId;
    if (searchInfo.Name) params.Name = searchInfo.Name;
    if (searchInfo.ParentIdIsNull)
      params.ParentIdIsNull = searchInfo.ParentIdIsNull;

    return this._garbageProfilesBasicRequest.division.list(params);
  }
}
