import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IConverter } from '../common/interfaces/converter.interface';
import { Medium } from '../common/tools/medium';
import { MaterialRecordType } from '../enum/material-record-type.enum';
import { MaterialRecordModel } from '../model/material-record.model';
import { MaterialRecord } from '../network/entity/material-record.entity';
import { GarbageStationProfilesRequestService } from '../network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';

import { GarbageStationProfileConverter } from './garbage-station-profile.converter';

@Injectable({
  providedIn: 'root',
})
export class MaterialRecordConverter
  implements
    IConverter<
      MaterialRecord | Promise<MaterialRecord>,
      MaterialRecordModel | Promise<MaterialRecordModel>
    >
{
  constructor(
    private service: GarbageStationProfilesRequestService,
    private garbage_station_profile: GarbageStationProfileConverter
  ) {}

  convert(source: MaterialRecord): MaterialRecordModel;
  convert(source: Promise<MaterialRecord>): Promise<MaterialRecordModel>;
  convert(
    source: MaterialRecord | Promise<MaterialRecord>
  ): MaterialRecordModel | Promise<MaterialRecordModel> {
    if (source instanceof MaterialRecord) {
      let plain = instanceToPlain(source);
      let model = plainToInstance(MaterialRecordModel, plain);

      if (source.ProfileId) {
        model.Profile = this.service.get(source.ProfileId).then((x) => {
          return this.garbage_station_profile.convert(x);
        });
      }
      if (source.ImageUrls) {
        let all = source.ImageUrls.map((x) => {
          return new Promise<string>((resolve) => {
            resolve(Medium.data(x));
          });
        });
        model.Images = Promise.all(all);
      }
      switch (source.MaterialRecordType) {
        case MaterialRecordType.putin:
          model.MaterialRecordTypeName = '入库记录';
          break;
        case MaterialRecordType.putout:
          model.MaterialRecordTypeName = '出库记录';
          break;
        default:
          break;
      }
      return model;
    } else {
      return source.then((x) => {
        return this.convert(x);
      });
    }
  }
}
