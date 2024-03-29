import { Injectable } from '@angular/core';
import { instanceToPlain } from 'class-transformer';
import { wait } from 'src/app/common/tools/tool';
import { ExcelUrl } from 'src/app/network/entity/excel-url.entity';
import { MaterialCategory } from 'src/app/network/entity/material-category.entity';
import { MaterialRecord } from 'src/app/network/entity/material-record.entity';
import { Material } from 'src/app/network/entity/material.entity';
import { PagedList } from 'src/app/network/entity/page.entity';
import { GarbageProfilesMaterialsUrl } from 'src/app/network/url/garbage_profiles/materials/materials.url';
import {
  BaseRequestService,
  BaseTypeRequestService,
} from '../../base-request.service';
import { HowellAuthHttpService } from '../../howell-auth-http.service';
import {
  GetGarbageProfilesMaterialsParams,
  GetMaterialsExcelParams,
  PutInMaterialsParams,
  PutOutMaterialsParams,
} from './garbage-profiles-materials.param';

@Injectable({
  providedIn: 'root',
})
export class GarbageProfilesMaterialRequestService {
  private basic: BaseRequestService;
  private type: BaseTypeRequestService<Material>;
  constructor(_http: HowellAuthHttpService) {
    this.basic = new BaseRequestService(_http);
    this.type = this.basic.type(Material);
  }

  create(instance: Material): Promise<Material> {
    let url = GarbageProfilesMaterialsUrl.basic;
    let plain = instanceToPlain(instance);
    return this.type.post(url, plain);
  }
  get(id: number): Promise<Material> {
    let url = GarbageProfilesMaterialsUrl.item(id);
    return this.type.get(url);
  }
  update(instance: Material): Promise<Material> {
    let url = GarbageProfilesMaterialsUrl.item(instance.Id);
    let plain = instanceToPlain(instance);
    return this.type.put(url, plain as Material);
  }
  delete(id: number): Promise<Material> {
    let url = GarbageProfilesMaterialsUrl.item(id);
    return this.type.delete(url);
  }
  list(
    params: GetGarbageProfilesMaterialsParams = new GetGarbageProfilesMaterialsParams()
  ): Promise<PagedList<Material>> {
    let url = GarbageProfilesMaterialsUrl.list();
    let plain = instanceToPlain(params);
    return this.type.paged(url, plain);
  }

  putin(params: PutInMaterialsParams) {
    let url = GarbageProfilesMaterialsUrl.putin();
    let plain = instanceToPlain(params);
    return this.basic.post(url, MaterialRecord, plain);
  }

  putout(params: PutOutMaterialsParams) {
    let url = GarbageProfilesMaterialsUrl.putout();
    let plain = instanceToPlain(params);
    return this.basic.post(url, MaterialRecord, plain);
  }

  excel(params: GetMaterialsExcelParams) {
    let url = GarbageProfilesMaterialsUrl.excels();
    let plain = instanceToPlain(params);
    return this.basic.post(url, ExcelUrl, plain);
  }

  private _category?: BasicMaterialCategoryRequestService;
  public get category(): BasicMaterialCategoryRequestService {
    if (!this._category) {
      this._category = new BasicMaterialCategoryRequestService(this.basic);
    }
    return this._category;
  }
}

class BasicMaterialCategoryRequestService {
  private type: BaseTypeRequestService<MaterialCategory>;

  private datas: MaterialCategory[] = [];
  private loading = false;

  constructor(private basic: BaseRequestService) {
    this.type = this.basic.type(MaterialCategory);
  }
  all(): Promise<MaterialCategory[]> {
    let url = GarbageProfilesMaterialsUrl.category.basic();
    return this.type.getArray(url);
  }
  load() {
    if (this.loading) {
      return false;
    }
    if (this.datas && this.datas.length > 0) {
      return true;
    }
    this.loading = true;
    this.all().then((x) => {
      this.datas = x;
      this.loading = false;
    });
    return false;
  }
  create(instance: MaterialCategory): Promise<MaterialCategory> {
    let url = GarbageProfilesMaterialsUrl.category.basic();
    let plain = instanceToPlain(instance);
    return this.type.post(url, plain);
  }
  async get(id: number): Promise<MaterialCategory> {
    return new Promise((resolve) => {
      wait(
        () => {
          return this.load();
        },
        () => {
          let result = this.datas.find((x) => x.Id === id);
          if (result) {
            resolve(result);
            return;
          }
          let url = GarbageProfilesMaterialsUrl.category.item(id);
          this.type.get(url).then((x) => {
            this.datas.push(x);
            resolve(x);
          });
        }
      );
    });
  }
  update(instance: MaterialCategory): Promise<MaterialCategory> {
    let url = GarbageProfilesMaterialsUrl.category.item(instance.Id);
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
    let url = GarbageProfilesMaterialsUrl.category.item(id);
    return this.type.delete(url).then((result) => {
      let index = this.datas.findIndex((x) => x.Id === result.Id);
      if (index >= 0) {
        this.datas.splice(index, 1);
      }
      return result;
    });
  }
}
