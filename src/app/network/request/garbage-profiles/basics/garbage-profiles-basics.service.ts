import { Injectable } from '@angular/core';
import { instanceToPlain } from 'class-transformer';
import { Cache } from 'src/app/network/cache/cache';
import { MaterialCategory } from 'src/app/network/entity/material-category.entity';
import { Material } from 'src/app/network/entity/material.entity';
import { PagedList } from 'src/app/network/entity/page.entity';
import { GarbageProfilesBasicsUrl } from 'src/app/network/url/garbage_profiles/basics/basics.url';
import { Division } from '../../../entity/division.entity';
import {
  BaseRequestService,
  BaseTypeRequestService,
} from '../../base-request.service';
import { HowellAuthHttpService } from '../../howell-auth-http.service';
import { AbstractService } from '../../service.interface';
import {
  GetGarbageProfilesBasicDivisionsParams,
  GetGarbageProfilesBasicMaterialsParams,
} from './garbage-profiles-basics.params';

@Injectable({
  providedIn: 'root',
})
export class GarbageProfilesBasicRequestService {
  private basic: BaseRequestService;

  constructor(_http: HowellAuthHttpService) {
    this.basic = new BaseRequestService(_http);
  }

  private _division?: BasicDivisionRequestService;
  public get division(): BasicDivisionRequestService {
    if (!this._division) {
      this._division = new BasicDivisionRequestService(this.basic);
    }
    return this._division;
  }

  private _material?: BasicMaterialRequestService;
  public get material(): BasicMaterialRequestService {
    if (!this._material) {
      this._material = new BasicMaterialRequestService(this.basic);
    }
    return this._material;
  }
}
@Cache(GarbageProfilesBasicsUrl.division.basic(), Division)
class BasicDivisionRequestService extends AbstractService<Division> {
  private type: BaseTypeRequestService<Division>;

  constructor(private basic: BaseRequestService) {
    super();
    this.type = this.basic.type(Division);
  }

  list(
    args: GetGarbageProfilesBasicDivisionsParams = new GetGarbageProfilesBasicDivisionsParams()
  ): Promise<PagedList<Division>> {
    let url = GarbageProfilesBasicsUrl.division.list();
    let plain = instanceToPlain(args);
    return this.type.paged(url, plain);
  }
  get(id: string): Promise<Division> {
    let url = GarbageProfilesBasicsUrl.division.item(id);
    return this.type.get(url);
  }
  update(instance: Division): Promise<Division> {
    let url = GarbageProfilesBasicsUrl.division.item(instance.Id);
    let plain = instanceToPlain(instance);
    return this.type.put(url, plain as Division);
  }
  delete(id: string): Promise<Division> {
    let url = GarbageProfilesBasicsUrl.division.item(id);
    return this.type.delete(url);
  }
}

class BasicMaterialRequestService {
  private type: BaseTypeRequestService<Material>;

  constructor(private basic: BaseRequestService) {
    this.type = this.basic.type(Material);
  }
  create(instance: Material): Promise<Material> {
    let url = GarbageProfilesBasicsUrl.material.basic();
    let plain = instanceToPlain(instance);
    return this.type.post(url, plain);
  }
  get(id: string): Promise<Material> {
    let url = GarbageProfilesBasicsUrl.material.item(id);
    return this.type.get(url);
  }
  update(instance: Material): Promise<Material> {
    let url = GarbageProfilesBasicsUrl.material.item(instance.Id);
    let plain = instanceToPlain(instance);
    return this.type.put(url, plain as Material);
  }
  delete(id: string): Promise<Material> {
    let url = GarbageProfilesBasicsUrl.material.item(id);
    return this.type.delete(url);
  }
  list(
    args: GetGarbageProfilesBasicMaterialsParams = new GetGarbageProfilesBasicMaterialsParams()
  ): Promise<PagedList<Material>> {
    let url = GarbageProfilesBasicsUrl.material.list();
    let plain = instanceToPlain(args);
    return this.type.paged(url, plain);
  }

  private _category?: BasicMaterialCategoryRequestService;
  public get category(): BasicMaterialCategoryRequestService {
    if (!this._category) {
      this._category = new BasicMaterialCategoryRequestService(this.basic);
    }
    return this._category;
  }
}

class BasicMaterialCategoryRequestService extends AbstractService<MaterialCategory> {
  private type: BaseTypeRequestService<MaterialCategory>;

  datas: MaterialCategory[] = [];

  constructor(private basic: BaseRequestService) {
    super();
    this.type = this.basic.type(MaterialCategory);
  }
  create(instance: MaterialCategory): Promise<MaterialCategory> {
    let url = GarbageProfilesBasicsUrl.material.category.basic();
    let plain = instanceToPlain(instance);
    return this.type.post(url, plain);
  }
  async get(id: number): Promise<MaterialCategory> {
    let result = this.datas.find((x) => x.Id === id);
    if (result) {
      return result;
    }
    let url = GarbageProfilesBasicsUrl.material.category.item(id);
    result = await this.type.get(url);
    this.datas.push(result);
    return result;
  }
  update(instance: MaterialCategory): Promise<MaterialCategory> {
    let url = GarbageProfilesBasicsUrl.material.category.item(instance.Id);
    let plain = instanceToPlain(instance);
    return this.type.put(url, plain as MaterialCategory).then((result) => {
      let index = this.datas.findIndex((x) => x.Id === result.Id);
      if (index >= 0) {
        this.datas[index] = result;
      }
      return result;
    });
  }
  delete(id: string): Promise<MaterialCategory> {
    let url = GarbageProfilesBasicsUrl.material.category.item(id);
    return this.type.delete(url).then((result) => {
      let index = this.datas.findIndex((x) => x.Id === result.Id);
      if (index >= 0) {
        this.datas.splice(index, 1);
      }
      return result;
    });
  }
}
