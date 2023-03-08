import { Injectable } from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { ViewModelConverter } from 'src/app/converter/view-model.converter';
import { MaterialRecordType } from 'src/app/enum/material-record-type.enum';
import { MaterialRecordModel } from 'src/app/model/material-record.model';
import { MaterialRecord } from 'src/app/network/entity/material-record.entity';
import { PagedList } from 'src/app/network/entity/page.entity';
import { GetMaterialRecordsParams } from 'src/app/network/request/garbage-profiles/records/garbage-profiles-records.param';
import { GarbageProfilesRecordRequestService } from 'src/app/network/request/garbage-profiles/records/garbage-profiles-records.service';
import { GarbageProfilesRecordMaterialTableArgs } from './garbage-profiles-record-material-table.model';

@Injectable()
export class GarbageProfilesRecordMaterialTableBusiness
  implements
    IBusiness<PagedList<MaterialRecord>, PagedList<MaterialRecordModel>>
{
  constructor(
    private service: GarbageProfilesRecordRequestService,
    private converter: ViewModelConverter
  ) {}

  async load(
    index: number,
    size: number = 10,
    args: GarbageProfilesRecordMaterialTableArgs
  ) {
    let data = await this.getData(
      index,
      size,
      args.duration.begin,
      args.duration.end,
      args.type,
      args.profileName,
      args.materialName,
      args.materialIds,
      args.asc,
      args.desc
    );
    let model = new PagedList<MaterialRecordModel>();
    model.Page = data.Page;
    model.Data = data.Data.map((x) => {
      return this.converter.record.material.convert(x);
    });
    return model;
  }
  getData(
    index: number,
    size: number = 10,
    begin: Date,
    end: Date,
    type?: MaterialRecordType,
    profileName?: string,
    materialName?: string,
    materialIds?: number[],
    asc?: string,
    desc?: string
  ) {
    let params = new GetMaterialRecordsParams();
    params.PageIndex = index;
    params.PageSize = size;
    params.BeginTime = begin;
    params.EndTime = end;
    params.MaterialRecordType = type;
    params.ProfileName = profileName;
    params.MaterialName = materialName;
    params.MaterialIds = materialIds;
    params.Asc = asc;
    params.Desc = desc;
    return this.service.material.list(params);
  }
}
