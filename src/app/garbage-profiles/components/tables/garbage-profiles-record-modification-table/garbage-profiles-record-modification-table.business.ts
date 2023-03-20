import { Injectable } from '@angular/core';
import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { ViewModelConverter } from 'src/app/converter/view-model.converter';
import { ModificationRecordModel } from 'src/app/model/modification-record.model';
import { ModificationRecord } from 'src/app/network/entity/modification-record.entity';
import { PagedList } from 'src/app/network/entity/page.entity';
import { GetModificationRecordsParams } from 'src/app/network/request/garbage-profiles/records/garbage-profiles-records.param';
import { GarbageProfilesRecordRequestService } from 'src/app/network/request/garbage-profiles/records/garbage-profiles-records.service';
import { GarbageProfilesRecordModificationTableArgs } from './garbage-profiles-record-modification-table.model';

@Injectable()
export class GarbageProfilesRecordModificationTableBusiness
  implements
    IBusiness<
      PagedList<ModificationRecord>,
      PagedList<ModificationRecordModel>
    >
{
  constructor(
    private service: GarbageProfilesRecordRequestService,
    private converter: ViewModelConverter
  ) {}
  async load(
    index: number,
    size: number = 10,
    args: GarbageProfilesRecordModificationTableArgs
  ): Promise<PagedList<ModificationRecordModel>> {
    let data = await this.getData(index, size, args);
    let paged = new PagedList<ModificationRecordModel>();
    paged.Page = data.Page;
    paged.Data = data.Data.map((x) => {
      return this.converter.record.modification.convert(x);
    });
    return paged;
  }
  getData(
    index: number,
    size: number = 10,
    args: GarbageProfilesRecordModificationTableArgs
  ): Promise<PagedList<ModificationRecord>> {
    let params = new GetModificationRecordsParams();
    params.PageIndex = index;
    params.PageSize = size;
    params.BeginTime = args.duration.begin;
    params.EndTime = args.duration.end;

    params.Asc = args.asc;
    params.Desc = args.desc;

    params.ProfileName = args.name;
    params.ProfileType = args.type;

    return this.service.modification.list(params);
  }
}
