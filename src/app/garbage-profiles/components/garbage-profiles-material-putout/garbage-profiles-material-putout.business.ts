import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { Material } from 'src/app/network/entity/material.entity';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import { GetPartialDatasParams } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { GarbageStationProfilesRequestService } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { GarbageProfilesMaterialRequestService } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.service';

@Injectable()
export class GarbageProfilesMaterialPutoutBusiness {
  constructor(
    material: GarbageProfilesMaterialRequestService,
    profile: GarbageStationProfilesRequestService
  ) {
    this.materials = new MaterialsBusiness(material);
    this.profiles = new ProfilesBusiness(profile);
  }

  materials: MaterialsBusiness;
  profiles: ProfilesBusiness;
}
class MaterialsBusiness implements IBusiness<Material[]> {
  constructor(private service: GarbageProfilesMaterialRequestService) {}

  load(...args: any): Promise<Material[]> {
    return this.getData();
  }
  async getData(...args: any): Promise<Material[]> {
    let paged = await this.service.list();
    return paged.Data;
  }
}
class ProfilesBusiness
  implements IBusiness<PartialData[], GarbageStationProfile[]>
{
  constructor(private service: GarbageStationProfilesRequestService) {}

  async load(...args: any): Promise<GarbageStationProfile[]> {
    let data = await this.getData();
    let plain = instanceToPlain(data);
    let model = plainToInstance(
      GarbageStationProfile,
      plain
    ) as unknown as GarbageStationProfile[];
    return model;
  }
  async getData(...args: any): Promise<PartialData[]> {
    let params = new GetPartialDatasParams();
    params.PropertyIds = ['ProfileName'];
    let paged = await this.service.partialData.list(params);
    return paged.Data;
  }
}
