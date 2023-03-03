import { Injectable } from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { ViewModelConverter } from 'src/app/converter/view-model.converter';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { Division } from 'src/app/network/entity/division.entity';
import { GetGarbageProfilesBasicDivisionsParams } from 'src/app/network/request/garbage-profiles/basics/garbage-profiles-basics.params';
import { GarbageProfilesBasicRequestService } from 'src/app/network/request/garbage-profiles/basics/garbage-profiles-basics.service';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { GarbageStationProfileDetailsSource } from './profile-details.model';

@Injectable()
export class GProfileDetailsSourceBusiness
  implements IBusiness<Division[], GarbageStationProfileDetailsSource>
{
  constructor(
    private basicService: GarbageProfilesBasicRequestService,
    private profileService: GarbageStationProfilesRequestService,
    private converter: ViewModelConverter
  ) {}

  async load(
    station: GarbageStationProfileModel
  ): Promise<GarbageStationProfileDetailsSource> {
    let model = new GarbageStationProfileDetailsSource();
    model.provinces = (await this.getProvinces()).map((x) =>
      this.converter.Division(x)
    );
    let province = model.provinces.find((x) => x.Name === station.Province);
    if (province) {
      model.citys = (await this.getChild(province.Id)).map((x) =>
        this.converter.Division(x)
      );
      let city = model.citys.find((x) => x.Name === station.City);
      if (city) {
        model.countys = (await this.getChild(city.Id)).map((x) =>
          this.converter.Division(x)
        );
        let county = model.countys.find((x) => x.Name === station.County);
        if (county) {
          model.streets = (await this.getChild(county.Id)).map((x) =>
            this.converter.Division(x)
          );
        }
      }
    }
    return model;
  }

  getData(...args: any): Promise<Division[]> {
    throw new Error('Method not implemented.');
  }

  async getProvinces() {
    let params = new GetGarbageProfilesBasicDivisionsParams();
    params.ParentIdIsNull = true;
    let paged = await this.basicService.division.list(params);
    return paged.Data;
  }

  async getChild(parentId: string) {
    let params = new GetGarbageProfilesBasicDivisionsParams();
    params.ParentId = parentId;
    let paged = await this.basicService.division.list(params);
    return paged.Data;
  }
}
