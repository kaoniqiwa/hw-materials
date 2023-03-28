import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  IConverter,
  IPromiseConverter,
} from 'src/app/common/interfaces/converter.interface';
import { wait } from 'src/app/common/tools/tool';
import { GarbageStationProfilePropertyConverter } from 'src/app/converter/garbage-statopm-profile/garbage-statopm-profile-property.converter';
import { PropertyDataType } from 'src/app/enum/property-data-type.enum';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-source.tool';
import { PropertyModel } from 'src/app/model/property.model';

import { PagedList } from 'src/app/network/entity/page.entity';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import { ValueNamePair } from 'src/app/network/entity/value-name-pair.entity';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';

@Injectable()
export class MaintenanceProfileTableConverter
  implements IPromiseConverter<PagedList<PartialData>, PagedList<PartialData>>
{
  constructor(
    private source: GarbageStationProfilesSourceTools,
    public converter: MaintenanceProfileTableItemConverter
  ) {}

  async convert(source: PagedList<PartialData>, ...res: any[]) {
    return new Promise<PagedList<PartialData>>((resolve) => {
      wait(
        () => {
          return this.source.ProfileState.length > 0;
        },
        () => {
          let paged = new PagedList<PartialData>();
          paged.Page = source.Page;
          let all = source.Data.map((x) => {
            return this.converter.convert(x);
          });
          Promise.all(all).then((data) => {
            paged.Data = data;
            resolve(paged);
          });
        }
      );
    });
  }
}

@Injectable()
export class MaintenanceProfileTableItemConverter
  implements IConverter<PartialData, Promise<PartialData>>
{
  constructor(
    private service: MaintenanceProfileRequestService,
    private converter: GarbageStationProfilePropertyConverter
  ) {}

  async convert(source: PartialData): Promise<PartialData> {
    let view = 'View';
    for (const key in source) {
      source[key + view] = source[key];

      if (key === 'Id') {
        continue;
      }
      let value = source[key];
      let property = await this.service.property.get(key).then((x) => {
        return this.converter.convert(x);
      });

      if (property.IsArray) {
        source[key + view] = this.fromArray(value, property);
      } else if (property.isEnum) {
        source[key + view] = this.fromEnum(value, property.EnumeratedValues!);
      } else {
        switch (property.DataType) {
          case PropertyDataType.DateTime:
            source[key + view] = this.fromDateTime(value);
            break;
          case PropertyDataType.String:
            source[key + view] = this.fromString(key, value);
            break;
          case PropertyDataType.Date:
            source[key + view] = this.fromDate(value);
            break;
          case PropertyDataType.Time:
            source[key + view] = this.fromTime(value);
            break;
          case PropertyDataType.Int32:
            source[key + view] = this.fromInt32(value);
            break;
          case PropertyDataType.Double:
            source[key + view] = this.fromDouble(value);
            break;
          case PropertyDataType.Object:
            source[key + view] = this.fromObject(value);
            break;
          case PropertyDataType.Boolean:
            source[key + view] = this.fromBoolean(value);
            break;
          default:
            source[key + view] = value;
            break;
        }
      }
    }

    return source;
  }

  fromString<T>(key: string, value: T) {
    if (key.toLowerCase().includes('url')) {
      return this.fromUrl(value);
    }
    return value;
  }
  fromDateTime(value: string) {
    let date = new Date(value);
    return formatDate(date, 'YYYY-MM-dd HH:mm:ss', 'en');
  }
  fromDate<T>(value: T) {
    return value;
  }
  fromTime<T>(value: T) {
    return value;
  }
  fromInt32<T>(value: T) {
    return value;
  }
  fromDouble<T>(value: T) {
    return value;
  }
  fromObject<T>(value: T) {
    return value;
  }
  fromBoolean<T = boolean>(value: T) {
    return value ? '是' : '否';
  }

  fromEnum(value: number, enums: ValueNamePair[]) {
    if (value) {
      let result = value.toString();
      let keyvalue = enums.find((x) => x.Value === value);
      if (keyvalue) {
        result = keyvalue.Name;
      }
      return result;
    }
    return '无';
  }

  fromUrl<T>(value: T) {
    return value ? `<a>查看</a>` : '无';
  }
  fromArray<T>(value: T[], property: PropertyModel) {
    if (property.isEnum) {
      return this.fromEnumArray(
        value as unknown as number[],
        property.EnumeratedValues!
      );
    }
    return this.fromObjectArray(value);
  }
  fromObjectArray<T>(value: T[]) {
    return `<a>【 ${value.length} 】</a>`;
  }
  fromInt32Array<T = number>(value: T[]) {}
  fromEnumArray(array: number[], enums: ValueNamePair[]) {
    let result = '';

    let names = array.map((value) => {
      let pair = enums.find((e) => e.Value === value);
      return pair!.Name;
    });
    return names.join(',');
  }
}
