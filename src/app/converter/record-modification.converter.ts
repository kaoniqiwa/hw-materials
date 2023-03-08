import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IConverter } from '../common/interfaces/converter.interface';
import { ModificationRecordModel } from '../model/modification-record.model';
import { ModificationRecord } from '../network/entity/modification-record.entity';

import { GarbageStationProfilesRequestService } from '../network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.service';

import { GarbageStationProfileConverter } from './garbage-station-profile.converter';

@Injectable({
  providedIn: 'root',
})
export class ModificationRecordConverter
  implements
    IConverter<
      ModificationRecord | Promise<ModificationRecord>,
      ModificationRecordModel | Promise<ModificationRecordModel>
    >
{
  constructor(
    private service: GarbageStationProfilesRequestService,
    private garbage_station_profile: GarbageStationProfileConverter
  ) {}

  convert(source: ModificationRecord): ModificationRecordModel;
  convert(
    source: Promise<ModificationRecord>
  ): Promise<ModificationRecordModel>;
  convert(
    source: ModificationRecord | Promise<ModificationRecord>
  ): ModificationRecordModel | Promise<ModificationRecordModel> {
    if (source instanceof ModificationRecord) {
      let plain = instanceToPlain(source);
      let model = plainToInstance(ModificationRecordModel, plain);

      if (source.ProfileId) {
        model.Profile = this.service.cache.get(source.ProfileId).then((x) => {
          return this.garbage_station_profile.convert(x);
        });
      }
      source.ProfileType;
      return model;
    } else {
      return source.then((x) => {
        return this.convert(x);
      });
    }
  }
}
