import { Injectable } from '@angular/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { MaterialRecordConverter } from 'src/app/converter/record-material.converter';

import { MaterialRecord } from 'src/app/network/entity/material-record.entity';
import { GetMaterialRecordsParams } from 'src/app/network/request/garbage-profiles/records/garbage-profiles-records.param';
import { GarbageProfilesRecordRequestService } from 'src/app/network/request/garbage-profiles/records/garbage-profiles-records.service';
import {
  GarbageProfilesMaterialRecordTimelineArgs,
  SingleMaterialRecordModel,
} from './garbage-profiles-material-record-timeline.model';

@Injectable()
export class GarbageProfilesMaterialRecordTimelineBusiness
  implements IBusiness<MaterialRecord[], SingleMaterialRecordModel[]>
{
  constructor(
    private service: GarbageProfilesRecordRequestService,
    private converter: MaterialRecordConverter
  ) {}
  async load(
    materialId: number,
    args: GarbageProfilesMaterialRecordTimelineArgs
  ): Promise<SingleMaterialRecordModel[]> {
    let data = await this.getData(materialId, args);
    let model = data.map((data) => {
      let instance = this.converter.convert(data);
      let plain = instanceToPlain(instance);
      let item = plainToInstance(SingleMaterialRecordModel, plain);
      item.Item = instance.MaterialItems.find((x) => x.Id === materialId)!;

      return item;
    });
    return model;
  }
  async getData(
    materialId: number,
    args: GarbageProfilesMaterialRecordTimelineArgs
  ): Promise<MaterialRecord[]> {
    let params = new GetMaterialRecordsParams();
    params.MaterialIds = [materialId];
    params.BeginTime = args.duration.begin;
    params.EndTime = args.duration.end;
    if (args.asc) {
      params.Asc = 'CreationTime';
    } else {
      params.Desc = 'CreationTime';
    }
    let paged = await this.service.material.list(params);
    return paged.Data;
  }
}
