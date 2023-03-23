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
  private _selectMap: Map<string, Division[]> = new Map();
  private _divisionMap: Map<string, Division> = new Map();
  private _divisionSearchInfo: DivisionSearchInfo = {};
  private _divisionInfo: DivisionInfo = new DivisionInfo();
  behaviorSubject = new BehaviorSubject(this._divisionInfo);

  constructor(
    private _garbageProfilesBasicRequest: GarbageProfilesBasicRequestService
  ) {}

  async getDivisionInfo(divisionMap: Map<DivisionLevel, string>) {
    for (let [level, value] of divisionMap.entries()) {
      let res = await this._getChildDivisionListByName(level, value);
      // console.log('key', level, res);

      let childLevel = EnumHelper.getDivisionChildLevel(level);

      if (childLevel && res) {
        this._divisionInfo[DivisionLevel[childLevel] as keyof DivisionInfo] =
          res;
      }
    }
    this.behaviorSubject.next(this._divisionInfo);
  }

  private async _getChildDivisionListByName(
    level: DivisionLevel = DivisionLevel.None,
    name: string = ''
  ) {
    let id = this._getDivisionIdByName(name);
    return this._getChildDivisionListById(level, id);
  }
  async _getChildDivisionListById(
    level: DivisionLevel = DivisionLevel.None,
    ParentId?: string
  ) {
    if (level == DivisionLevel.None) {
      this._divisionSearchInfo = {
        ParentIdIsNull: true,
      };
    } else {
      if (!ParentId) return null;
      this._divisionSearchInfo = {
        ParentId,
      };
    }
    let childLevel = EnumHelper.getDivisionChildLevel(level);

    // level 为 Committee 时，无下级，不需要请求
    if (childLevel) {
      return this._getDivisionList(this._divisionSearchInfo);
    }

    return null;
  }
  /**
   *  根据区划名称寻找区划ID
   * @param name
   * @returns
   */
  private _getDivisionIdByName(name: string) {
    for (let [key, value] of this._divisionMap.entries()) {
      // console.log(key, value);
      if (value.Name === name) {
        // console.log(name + '的id: ' + key);

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

    let key: string = '';
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
