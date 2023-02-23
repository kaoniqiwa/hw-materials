import { Injectable } from '@angular/core';
import { ClassConstructor, instanceToPlain } from 'class-transformer';
import { IPropertyModel } from 'src/app/common/interfaces/model.interface';
import { wait } from 'src/app/common/tools/tool';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { Label } from 'src/app/network/entity/label.entity';
import { PagedList } from 'src/app/network/entity/page.entity';
import { IPartialData } from 'src/app/network/entity/partial-data.interface';
import { PartialResult } from 'src/app/network/entity/partial-result.entity';
import { Property } from 'src/app/network/entity/property.entity';
import { ValueNamePair } from 'src/app/network/entity/value-name-pair.entity';
import { GarbageStationProfilesUrl } from 'src/app/network/url/garbage_profiles/garbage-station-profiles/garbage-station-profiles.url';
import {
  BaseRequestService,
  BaseTypeRequestService,
} from '../../base-request.service';
import { HowellAuthHttpService } from '../../howell-auth-http.service';
import { AbstractService } from '../../service.interface';
import {
  GetGarbageStationProfilesParams,
  GetLabelsParams,
  GetPartialDatasParams,
  GetPropertiesParams,
} from './garbage-station-profiles.params';

@Injectable({
  providedIn: 'root',
})
export class GarbageStationProfilesRequestService extends AbstractService<GarbageStationProfile> {
  private basic: BaseRequestService;
  private type: BaseTypeRequestService<GarbageStationProfile>;

  constructor(_http: HowellAuthHttpService) {
    super();
    this.basic = new BaseRequestService(_http);
    this.type = this.basic.type(GarbageStationProfile);
  }

  create(instance: GarbageStationProfile): Promise<GarbageStationProfile> {
    let url = GarbageStationProfilesUrl.basic;
    let plain = instanceToPlain(instance);
    return this.type.post(url, plain as GarbageStationProfile);
  }
  get(id: string): Promise<GarbageStationProfile> {
    let url = GarbageStationProfilesUrl.item(id);
    return this.type.get(url);
  }
  update(instance: GarbageStationProfile): Promise<GarbageStationProfile> {
    let url = GarbageStationProfilesUrl.item(instance.Id);
    let plain = instanceToPlain(instance);
    return this.type.put(url, plain as GarbageStationProfile);
  }
  delete(id: string): Promise<GarbageStationProfile> {
    let url = GarbageStationProfilesUrl.item(id);
    return this.type.delete(url);
  }

  list(
    args: GetGarbageStationProfilesParams = new GetGarbageStationProfilesParams()
  ): Promise<PagedList<GarbageStationProfile>> {
    let url = GarbageStationProfilesUrl.list();
    let plain = instanceToPlain(args);
    return this.type.paged(url, plain);
  }

  private _property?: GarbageStationProfilesPropertiesRequestService;
  public get property(): GarbageStationProfilesPropertiesRequestService {
    if (!this._property) {
      this._property = new GarbageStationProfilesPropertiesRequestService(
        this.basic
      );
    }
    return this._property;
  }

  private _partialData?: GarbageStationProfilesPartialDatasRequestService;
  public get partialData(): GarbageStationProfilesPartialDatasRequestService {
    if (!this._partialData) {
      this._partialData = new GarbageStationProfilesPartialDatasRequestService(
        this.basic
      );
    }
    return this._partialData;
  }

  private _label?: GarbageStationProfilesLabelsRequestService;
  public get label(): GarbageStationProfilesLabelsRequestService {
    if (!this._label) {
      this._label = new GarbageStationProfilesLabelsRequestService(this.basic);
    }
    return this._label;
  }
}

class GarbageStationProfilesPropertiesRequestService extends AbstractService<Property> {
  private type: BaseTypeRequestService<Property>;

  constructor(private basic: BaseRequestService) {
    super();
    this.type = this.basic.type(Property);
  }

  properties: Property[] = [];
  loading = false;

  async get(id: string): Promise<Property> {
    if (this.properties && this.properties.length > 0) {
      let property = this.properties.find((x) => x.Id === id);
      if (property) {
        return property;
      }
    }
    let url = GarbageStationProfilesUrl.property.item(id);
    return this.type.get(url);
  }
  update(instance: Property): Promise<Property> {
    let url = GarbageStationProfilesUrl.property.item(instance.Id);
    let plain = instanceToPlain(instance);
    return this.type.put(url, plain as Property);
  }
  delete(id: string): Promise<Property> {
    let url = GarbageStationProfilesUrl.property.item(id);
    return this.type.delete(url);
  }
  list(
    args: GetPropertiesParams = new GetPropertiesParams()
  ): Promise<PagedList<Property>> {
    let url = GarbageStationProfilesUrl.property.list();
    let plain = instanceToPlain(args);
    return this.type.paged(url, plain);
  }

  // async name(name: string): Promise<ValueNamePair[]> {
  //   if (!this.properties || this.properties.length === 0) {
  //     this.properties = (await this.list()).Data;
  //   }
  //   let property = this.properties.find((x) => x.Name === name);
  //   if (property && property.EnumeratedValues) {
  //     return property.EnumeratedValues;
  //   }
  //   throw new Error(`${name} enum undefined`);
  // }

  async name(name: string): Promise<ValueNamePair[]> {
    return new Promise((resolve) => {
      wait(
        () => {
          return this.loading === false;
        },
        () => {
          if (!this.properties || this.properties.length === 0) {
            this.loading = true;
            this.list().then((x) => {
              this.properties = x.Data;
              this.loading = false;
              let property = this.properties.find((x) => x.Name === name);
              if (property && property.EnumeratedValues) {
                resolve(property.EnumeratedValues);
              }
            });
          } else {
            let property = this.properties.find((x) => x.Name === name);
            if (property && property.EnumeratedValues) {
              resolve(property.EnumeratedValues);
            }
          }
        }
      );
    });
  }

  // async language(name: string): Promise<string> {
  //   if (!this.properties || this.properties.length === 0) {
  //     this.properties = (await this.list()).Data;
  //   }

  //   let property = this.properties.find((x) => x.Name === name);
  //   if (property) {
  //     return property.Description;
  //   }
  //   throw new Error(`${name} name undefined`);
  // }
  async language(name: string): Promise<string> {
    return new Promise((resolve) => {
      wait(
        () => {
          return this.loading === false;
        },
        () => {
          if (!this.properties || this.properties.length === 0) {
            this.loading = true;
            this.list().then((x) => {
              this.properties = x.Data;
              this.loading = false;
              let property = this.properties.find((x) => x.Name === name);
              if (property) {
                resolve(property.Description);
              }
            });
          } else {
            let property = this.properties.find((x) => x.Name === name);
            if (property) {
              resolve(property.Description);
            }
          }
        }
      );
    });
  }
}

class GarbageStationProfilesPartialDatasRequestService {
  constructor(private basic: BaseRequestService) {}

  list<T extends IPropertyModel>(
    args: GetPartialDatasParams<T> = new GetPartialDatasParams(),
    type: ClassConstructor<T>
  ): Promise<PagedList<IPartialData>> {
    let url = GarbageStationProfilesUrl.partialData.list();
    let plain = instanceToPlain(args);
    return this.basic.paged(url, type, plain);
  }
  batch<T extends IPartialData>(datas: T[]): Promise<PartialResult<T>[]> {
    let url = GarbageStationProfilesUrl.partialData.basic();
    let plain = instanceToPlain(datas);
    let response = this.basic.postToArray<T, PartialResult<T>>(url, plain as T);
    return response;
  }
}

class GarbageStationProfilesLabelsRequestService extends AbstractService<Label> {
  private type: BaseTypeRequestService<Label>;

  constructor(private basic: BaseRequestService) {
    super();
    this.type = this.basic.type(Label);
  }

  get(id: string): Promise<Label> {
    let url = GarbageStationProfilesUrl.label.item(id);
    return this.type.get(url);
  }
  update(instance: Label): Promise<Label> {
    let url = GarbageStationProfilesUrl.label.item(instance.Id);
    let plain = instanceToPlain(instance);
    return this.type.put(url, plain as Label);
  }
  delete(id: string): Promise<Label> {
    let url = GarbageStationProfilesUrl.label.item(id);
    return this.type.delete(url);
  }
  list(
    args: GetLabelsParams = new GetLabelsParams()
  ): Promise<PagedList<Label>> {
    let url = GarbageStationProfilesUrl.label.list();
    let plain = instanceToPlain(args);
    return this.type.paged(url, plain);
  }
}
