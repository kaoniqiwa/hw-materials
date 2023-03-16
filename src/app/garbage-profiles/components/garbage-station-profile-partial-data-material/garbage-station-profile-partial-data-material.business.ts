import { Injectable } from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { MaterialRecordConverter } from 'src/app/converter/record-material.converter';
import { MaterialRecordModel } from 'src/app/model/material-record.model';
import { MaterialRecord } from 'src/app/network/entity/material-record.entity';
import { GetMaterialRecordsParams } from 'src/app/network/request/garbage-profiles/records/garbage-profiles-records.param';
import { GarbageProfilesRecordRequestService } from 'src/app/network/request/garbage-profiles/records/garbage-profiles-records.service';

@Injectable()
export class GarbageStationProfilePartialDataMaterialBusiness
  implements IBusiness<MaterialRecord[], MaterialRecordModel[]>
{
  constructor(
    private service: GarbageProfilesRecordRequestService,
    private converter: MaterialRecordConverter
  ) {}

  async load(profileId: string): Promise<MaterialRecordModel[]> {
    let data = await this.getData(profileId);
    let model = data.map((x) => this.converter.convert(x));
    return model;
  }
  async getData(profileId: string): Promise<MaterialRecord[]> {
    let params = new GetMaterialRecordsParams();
    params.ProfileIds = [profileId];
    let paged = await this.service.material.list(params);
    return paged.Data;
  }
}
