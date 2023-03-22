import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';
import { GPSPoint } from 'src/app/network/entity/gps-point.entity';
import { GetLabelsParams } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { IConverter } from '../../common/interfaces/converter.interface';
import { PropertyDataType } from '../../enum/property-data-type.enum';
import { PropertyModel } from '../../model/property.model';
import { PartialData } from '../../network/entity/partial-data.interface';
import { ValueNamePair } from '../../network/entity/value-name-pair.entity';
import { GarbageStationProfilesRequestService } from '../../network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';
import { GarbageStationProfilePropertyConverter } from './garbage-statopm-profile-property.converter';

@Injectable({
  providedIn: 'root',
})
export class GarbageStationProfilePartialDataConverter
  implements IConverter<PartialData, Promise<PartialData>>
{
  constructor(
    private service: GarbageStationProfilesRequestService,
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
            source[key + view] = this.fromObject(value, property);
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
  fromObject<T>(value: T, property: PropertyModel) {
    if (value) {
      if (property.Name === 'GPSPoint') {
        let _value = plainToInstance(GPSPoint, value);
        return `${_value.Longitude},${_value.Latitude}`;
      }
    }

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
    return this.fromObjectArray(value, property);
  }
  fromObjectArray<T>(value: T[], property: PropertyModel) {
    if (property.Name === 'Labels') {
      return this.fromLabels(value as unknown as number[]);
    }
    return `<a>【 ${value.length} 】</a>`;
  }

  async fromLabels(ids: number[]) {
    let params = new GetLabelsParams();
    params.Ids = ids;
    let paged = await this.service.label.list(params);
    return paged.Data.map((x) => x.Name);
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
