import { Injectable } from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import {
  IConverter,
  IPromiseConverter,
} from 'src/app/common/interfaces/converter.interface';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { UserConfigType } from 'src/app/enum/user-config-type.enum';
import { UserRequestService } from 'src/app/network/request/user/user-request.service';

@Injectable()
export class GarbageStationProfileSettingBusiness
  implements IBusiness<string, string[]>
{
  constructor(
    private service: UserRequestService,
    private local: LocalStorageService
  ) {}
  Converter?:
    | IConverter<string, string[]>
    | IPromiseConverter<string, string[]>
    | undefined;
  async load(...args: any): Promise<string[]> {
    let data = await this.getData(
      this.local.user.Id,
      UserConfigType.GarbageStationProfileProperty
    );

    if (!data) {
      return [
        'ProfileName',
        'Province',
        'County',
        'Street',
        'Committee',
        'ProfileState',
        'UpdateTime',
      ];
    }

    return data as string[];
  }
  getData(userId: string, type: UserConfigType): Promise<any> {
    return this.service.config.get(userId, type);
  }

  async set(data: string) {
    return this.service.config.update(
      this.local.user.Id,
      UserConfigType.GarbageStationProfileProperty,
      data
    );
  }
}
